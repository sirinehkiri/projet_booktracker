package com.booktracker.services;

import com.booktracker.entity.Book;
import com.booktracker.entity.Review;
import com.booktracker.entity.User;
import com.booktracker.entity.UserPreferences;
import com.booktracker.repository.BookRepository;
import com.booktracker.repository.ReviewRepository;
import com.booktracker.repository.UserPreferencesRepository;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class RecommendationService {

    private final BookRepository bookRepository;
    private final ReviewRepository reviewRepository;
    private final UserPreferencesRepository userPreferencesRepository;

    public RecommendationService(
            BookRepository bookRepository,
            ReviewRepository reviewRepository,
            UserPreferencesRepository userPreferencesRepository
    ) {
        this.bookRepository = bookRepository;
        this.reviewRepository = reviewRepository;
        this.userPreferencesRepository = userPreferencesRepository;
    }

    // ============================================
    // 🎯 PERSONALIZED - Basé sur TES bonnes notes
    // ============================================
    public List<Book> getRecommendations(User currentUser) {
        System.out.println("🎯 PERSONALIZED for user: " + currentUser.getId());

        List<Review> allReviews = reviewRepository.findAll();
        List<Book> allBooks = bookRepository.findAll();

        List<Review> userGoodReviews = allReviews.stream()
                .filter(r -> r.getUser() != null
                        && r.getUser().getId().equals(currentUser.getId())
                        && r.getRating() != null
                        && r.getRating() >= 4)
                .collect(Collectors.toList());

        Set<Long> alreadyReviewedBookIds = allReviews.stream()
                .filter(r -> r.getUser() != null
                        && r.getUser().getId().equals(currentUser.getId())
                        && r.getBook() != null)
                .map(r -> r.getBook().getId())
                .collect(Collectors.toSet());

        if (userGoodReviews.isEmpty()) {
            return getPopularBooks(allBooks, alreadyReviewedBookIds);
        }

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

        Map<Book, Double> bookScores = new HashMap<>();

        for (Book book : allBooks) {
            if (alreadyReviewedBookIds.contains(book.getId())) continue;

            double score = 0;
            boolean matched = false;

            if (book.getGenre() != null
                    && favoriteGenres.contains(book.getGenre().toLowerCase().trim())) {
                score += 10;
                matched = true;
            }

            if (book.getAuthor() != null
                    && favoriteAuthors.contains(book.getAuthor().toLowerCase().trim())) {
                score += 20;
                matched = true;
            }

            if (matched) {
                score += book.getAverageRating();
                bookScores.put(book, score);
            }
        }

        if (bookScores.isEmpty()) {
            return getPopularBooks(allBooks, alreadyReviewedBookIds);
        }

        return bookScores.entrySet().stream()
                .sorted(Map.Entry.<Book, Double>comparingByValue().reversed())
                .map(Map.Entry::getKey)
                .limit(12)
                .collect(Collectors.toList());
    }

    // ============================================
    // HELPER: Livres populaires
    // ============================================
    private List<Book> getPopularBooks(List<Book> allBooks, Set<Long> excludeBookIds) {
        return allBooks.stream()
                .filter(b -> !excludeBookIds.contains(b.getId()))
                .sorted((a, b) -> Double.compare(b.getAverageRating(), a.getAverageRating()))
                .limit(12)
                .collect(Collectors.toList());
    }

    // ============================================
    // 👥 SOCIAL - Livres populaires basés sur AVIS
    // ============================================
    public List<Map<String, Object>> getSocialRecommendations(Long userId) {
        System.out.println("👥 SOCIAL for user: " + userId);

        List<Review> allReviews = reviewRepository.findAll();
        List<Book> allBooks = bookRepository.findAll();

        List<Map<String, Object>> result = new ArrayList<>();

        for (Book book : allBooks) {
            List<Review> bookReviews = allReviews.stream()
                    .filter(r -> r.getBook() != null
                            && r.getBook().getId().equals(book.getId())
                            && r.getRating() != null
                            && r.getUser() != null)
                    .collect(Collectors.toList());

            if (bookReviews.isEmpty()) continue;

            long reviewCount = bookReviews.size();

            double avgRating = bookReviews.stream()
                    .mapToInt(Review::getRating)
                    .average()
                    .orElse(0);

            long distinctUsers = bookReviews.stream()
                    .map(r -> r.getUser().getId())
                    .distinct()
                    .count();

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

        result.sort((a, b) -> Double.compare(
                (Double) b.get("socialScore"),
                (Double) a.get("socialScore")));

        if (result.size() > 12) {
            result = result.subList(0, 12);
        }

        return result;
    }

    // ============================================
    // ✨ SMART - Preferences + Social ratings
    // ============================================
    public List<Map<String, Object>> getSmartRecommendations(Long userId) {
        System.out.println("✨ SMART recommendations for user: " + userId);

        UserPreferences prefs =
                userPreferencesRepository.findByUserId(userId).orElse(null);

        if (prefs == null) {
            System.out.println("⚠️ No preferences found, returning social only");
            return getSocialRecommendations(userId);
        }

        List<String> favGenres = prefs.getPreferredGenres() != null
                ? prefs.getPreferredGenres() : new ArrayList<>();
        List<String> favLangs = prefs.getPreferredLanguages() != null
                ? prefs.getPreferredLanguages() : new ArrayList<>();
        List<String> favAuthors = prefs.getFavoriteAuthors() != null
                ? prefs.getFavoriteAuthors() : new ArrayList<>();

        System.out.println("🎨 Fav genres: " + favGenres);
        System.out.println("🌍 Fav languages: " + favLangs);
        System.out.println("✍️ Fav authors: " + favAuthors);

        if (favGenres.isEmpty() && favLangs.isEmpty() && favAuthors.isEmpty()) {
            return getSocialRecommendations(userId);
        }

        List<Review> allReviews = reviewRepository.findAll();
        List<Book> allBooks = bookRepository.findAll();

        List<Map<String, Object>> result = new ArrayList<>();

        for (Book book : allBooks) {

            boolean matchGenre = book.getGenre() != null &&
                    favGenres.stream().anyMatch(g ->
                            g.equalsIgnoreCase(book.getGenre()));

            boolean matchLang = book.getLangue() != null &&
                    favLangs.stream().anyMatch(l ->
                            l.equalsIgnoreCase(book.getLangue()));

            boolean matchAuthor = book.getAuthor() != null &&
                    favAuthors.stream().anyMatch(a ->
                            book.getAuthor().toLowerCase()
                                    .contains(a.toLowerCase()));

            if (!matchGenre && !matchLang && !matchAuthor) continue;

            List<Review> bookReviews = allReviews.stream()
                    .filter(r -> r.getBook() != null
                            && r.getBook().getId().equals(book.getId())
                            && r.getRating() != null
                            && r.getUser() != null)
                    .collect(Collectors.toList());

            long reviewCount = bookReviews.size();

            double avgRating = bookReviews.isEmpty() ? 0 :
                    bookReviews.stream()
                    .mapToInt(Review::getRating)
                    .average()
                    .orElse(0);

            long distinctUsers = bookReviews.stream()
                    .map(r -> r.getUser().getId())
                    .distinct()
                    .count();

            double prefScore = 0;
            if (matchGenre) prefScore += 15;
            if (matchLang) prefScore += 10;
            if (matchAuthor) prefScore += 25;

            double socialScore = (avgRating * 10) +
                    (distinctUsers * 8) + (reviewCount * 3);

            double finalScore = prefScore + socialScore;

            List<String> reasons = new ArrayList<>();
            if (matchGenre) reasons.add("📚 " + book.getGenre());
            if (matchAuthor) reasons.add("✍️ " + book.getAuthor());
            if (matchLang) reasons.add("🌍 " + book.getLangue());
            if (avgRating > 0) {
                reasons.add("⭐ " + String.format("%.1f", avgRating) + "/5");
            }
            if (distinctUsers > 0) {
                reasons.add("👥 " + distinctUsers + " user(s) loved this");
            }

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
            bookMap.put("smartScore", finalScore);
            bookMap.put("reasons", reasons);

            result.add(bookMap);
        }

        result.sort((a, b) -> Double.compare(
                (Double) b.get("smartScore"),
                (Double) a.get("smartScore")));

        if (result.size() > 12) {
            result = result.subList(0, 12);
        }

        System.out.println("✅ Returning " + result.size() + " smart recommendations");
        return result;
    }
}