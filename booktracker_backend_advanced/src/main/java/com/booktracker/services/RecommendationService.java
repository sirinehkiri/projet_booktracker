package com.booktracker.services;

import com.booktracker.entity.Book;
import com.booktracker.entity.Review;
import com.booktracker.entity.User;
import com.booktracker.repository.BookRepository;
import com.booktracker.repository.ReviewRepository;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class RecommendationService {

    private final BookRepository bookRepository;
    private final ReviewRepository reviewRepository;

    public RecommendationService(
            BookRepository bookRepository,
            ReviewRepository reviewRepository
    ) {
        this.bookRepository = bookRepository;
        this.reviewRepository = reviewRepository;
    }

    // ============================================
    // 🎯 PERSONALIZED - Basé sur TES bonnes notes
    // (+ FALLBACK: livres populaires si pas de match)
    // ============================================
    public List<Book> getRecommendations(User currentUser) {
        System.out.println("🎯 PERSONALIZED for user: " + currentUser.getId());

        List<Review> allReviews = reviewRepository.findAll();
        List<Book> allBooks = bookRepository.findAll();

        // 1. Récupérer reviews du USER avec rating >= 4
        List<Review> userGoodReviews = allReviews.stream()
                .filter(r -> r.getUser() != null
                        && r.getUser().getId().equals(currentUser.getId())
                        && r.getRating() != null
                        && r.getRating() >= 4)
                .collect(Collectors.toList());

        System.out.println("⭐ User has " + userGoodReviews.size() + " good reviews (rating >= 4)");

        // 2. Récupérer TOUS les livres déjà reviewés (pour les exclure)
        Set<Long> alreadyReviewedBookIds = allReviews.stream()
                .filter(r -> r.getUser() != null
                        && r.getUser().getId().equals(currentUser.getId())
                        && r.getBook() != null)
                .map(r -> r.getBook().getId())
                .collect(Collectors.toSet());

        System.out.println("📚 Already reviewed: " + alreadyReviewedBookIds.size() + " books");

        // 3. 🆕 FALLBACK 1: Si aucune bonne note → livres populaires
        if (userGoodReviews.isEmpty()) {
            System.out.println("ℹ️ No good reviews, returning popular books");
            return getPopularBooks(allBooks, alreadyReviewedBookIds);
        }

        // 4. Extraire genres + auteurs préférés
        Set<String> favoriteGenres = new HashSet<>();
        Set<String> favoriteAuthors = new HashSet<>();

        for (Review review : userGoodReviews) {
            Book book = review.getBook();
            if (book == null) continue;

            if (book.getGenre() != null) {
                favoriteGenres.add(book.getGenre().toLowerCase().trim());
            }
            if (book.getAuthor() != null) {
                favoriteAuthors.add(book.getAuthor().toLowerCase().trim());
            }
        }

        System.out.println("🎨 Favorite genres: " + favoriteGenres);
        System.out.println("✍️ Favorite authors: " + favoriteAuthors);

        // 5. Filtrer livres avec match genre OU auteur
        Map<Book, Double> bookScores = new HashMap<>();

        for (Book book : allBooks) {
            // Skip livres déjà reviewés
            if (alreadyReviewedBookIds.contains(book.getId())) continue;

            double score = 0;
            boolean matched = false;

            // Match genre
            if (book.getGenre() != null
                    && favoriteGenres.contains(book.getGenre().toLowerCase().trim())) {
                score += 10;
                matched = true;
            }

            // Match auteur (poids plus fort)
            if (book.getAuthor() != null
                    && favoriteAuthors.contains(book.getAuthor().toLowerCase().trim())) {
                score += 20;
                matched = true;
            }

            // Bonus rating
            if (matched) {
                score += book.getAverageRating();
                bookScores.put(book, score);
            }
        }

        System.out.println("✅ Found " + bookScores.size() + " matching books");

        // 6. 🆕 FALLBACK 2: Si pas de match → livres populaires
        if (bookScores.isEmpty()) {
            System.out.println("ℹ️ No matches, returning popular unreviewed books");
            return getPopularBooks(allBooks, alreadyReviewedBookIds);
        }

        // 7. Trier par score décroissant
        return bookScores.entrySet().stream()
                .sorted(Map.Entry.<Book, Double>comparingByValue().reversed())
                .map(Map.Entry::getKey)
                .limit(12)
                .collect(Collectors.toList());
    }

    // 🆕 HELPER: Livres populaires (non reviewés par le user)
    private List<Book> getPopularBooks(List<Book> allBooks, Set<Long> excludeBookIds) {
        return allBooks.stream()
                .filter(b -> !excludeBookIds.contains(b.getId()))
                .sorted((a, b) -> Double.compare(b.getAverageRating(), a.getAverageRating()))
                .limit(12)
                .collect(Collectors.toList());
    }

    // ============================================
    // 👥 SOCIAL - Livres populaires basés sur AVIS de TOUS users
    // ============================================
    public List<Map<String, Object>> getSocialRecommendations(Long userId) {
        System.out.println("👥 SOCIAL for user: " + userId);

        List<Review> allReviews = reviewRepository.findAll();
        List<Book> allBooks = bookRepository.findAll();

        System.out.println("📊 Total reviews in DB: " + allReviews.size());
        System.out.println("📚 Total books in DB: " + allBooks.size());

        List<Map<String, Object>> result = new ArrayList<>();

        for (Book book : allBooks) {
            // 🔥 Récupérer TOUTES les reviews du livre (TOUS les users, y compris le user actuel)
            List<Review> bookReviews = allReviews.stream()
                    .filter(r -> r.getBook() != null
                            && r.getBook().getId().equals(book.getId())
                            && r.getRating() != null
                            && r.getUser() != null)
                    .collect(Collectors.toList());

            // SOCIAL = SEULEMENT livres avec au moins 1 review
            if (bookReviews.isEmpty()) continue;

            long reviewCount = bookReviews.size();

            // Note moyenne
            double avgRating = bookReviews.stream()
                    .mapToInt(Review::getRating)
                    .average()
                    .orElse(0);

            // Nombre d'users distincts qui ont reviewé
            long distinctUsers = bookReviews.stream()
                    .map(r -> r.getUser().getId())
                    .distinct()
                    .count();

            // 🔥 Score = (note × 10) + (distinct users × 10) + (reviews × 3)
            double socialScore = (avgRating * 10) + (distinctUsers * 10) + (reviewCount * 3);

            Map<String, Object> bookMap = new HashMap<>();
            bookMap.put("id", book.getId());
            bookMap.put("title", book.getTitle());
            bookMap.put("author", book.getAuthor());
            bookMap.put("genre", book.getGenre());
            bookMap.put("year", book.getYear());
            bookMap.put("description", book.getDescription());
            bookMap.put("pic", book.getPic());
            bookMap.put("langue", book.getLangue());
            bookMap.put("total_pages", book.getTotal_pages());
            bookMap.put("averageRating", avgRating);
            bookMap.put("reviewCount", reviewCount);
            bookMap.put("distinctUsers", distinctUsers);
            bookMap.put("socialScore", socialScore);
            bookMap.put("reasons", List.of(
                    "⭐ " + String.format("%.1f", avgRating) + "/5",
                    "👥 " + distinctUsers + " user(s) loved this",
                    "📝 " + reviewCount + " review(s)"
            ));

            result.add(bookMap);
        }

        // Trier par score décroissant
        result.sort((a, b) -> Double.compare(
                (Double) b.get("socialScore"),
                (Double) a.get("socialScore")));

        // Limiter à 12
        if (result.size() > 12) {
            result = result.subList(0, 12);
        }

        System.out.println("✅ Returning " + result.size() + " social recommendations");
        return result;
    }
}