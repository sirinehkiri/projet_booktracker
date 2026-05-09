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

    // =====================================================
    // GET RECOMMENDATIONS
    // Criteria:
    // - t9raw min akther min user (>= 2 users)
    // - totale etoiles >= 10
    // =====================================================

    public List<Book> getRecommendations(
            User currentUser
    ) {

        // 1. Kol reviews
        List<Review> allReviews =
                reviewRepository.findAll();

        // 2. Kol books
        List<Book> allBooks =
                bookRepository.findAll();

        // 3. Filter books:
        //    - t9raw min >= 2 users
        //    - totale etoiles >= 10
        List<Book> qualifiedBooks =
                allBooks.stream()
                        .filter(book -> {

                            // Reviews mta3 el book
                            List<Review> bookReviews =
                                    allReviews.stream()
                                            .filter(r ->
                                                    r.getBook() != null &&
                                                            r.getRating() != null &&
                                                            r.getBook()
                                                                    .getId()
                                                                    .equals(book.getId())
                                            )
                                            .collect(
                                                    Collectors.toList()
                                            );

                            // Count distinct users
                            long distinctUsers =
                                    bookReviews.stream()
                                            .filter(r ->
                                                    r.getUser() != null
                                            )
                                            .map(r ->
                                                    r.getUser().getId()
                                            )
                                            .distinct()
                                            .count();

                            // Totale etoiles
                            int totalStars =
                                    bookReviews.stream()
                                            .mapToInt(r ->
                                                    r.getRating() != null
                                                            ? r.getRating()
                                                            : 0
                                            )
                                            .sum();

                            // ✅ Criteria
                            return distinctUsers >= 2
                                    && totalStars >= 10;
                        })
                        .collect(Collectors.toList());

        // 4. Ken vide - relax criteria
        //    (1 user + etoiles >= 4)
        if (qualifiedBooks.isEmpty()) {
            qualifiedBooks = allBooks.stream()
                    .filter(book -> {

                        List<Review> bookReviews =
                                allReviews.stream()
                                        .filter(r ->
                                                r.getBook() != null &&
                                                        r.getRating() != null &&
                                                        r.getBook()
                                                                .getId()
                                                                .equals(book.getId())
                                        )
                                        .collect(
                                                Collectors.toList()
                                        );

                        int totalStars =
                                bookReviews.stream()
                                        .mapToInt(r ->
                                                r.getRating() != null
                                                        ? r.getRating()
                                                        : 0
                                        )
                                        .sum();

                        return totalStars >= 4;
                    })
                    .collect(Collectors.toList());
        }

        // 5. Reviews mta3 current user
        List<Review> userReviews =
                allReviews.stream()
                        .filter(r ->
                                r.getUser() != null &&
                                        r.getUser()
                                                .getId()
                                                .equals(
                                                        currentUser.getId()
                                                )
                        )
                        .collect(Collectors.toList());

        // 6. Genre + Author scores
        Map<String, Double> genreScores =
                new HashMap<>();
        Map<String, Double> authorScores =
                new HashMap<>();

        for (Review review : userReviews) {

            if (review.getRating() == null ||
                    review.getBook() == null) {
                continue;
            }

            double rating =
                    review.getRating().doubleValue();

            String genre = review.getBook().getGenre();
            String author = review.getBook().getAuthor();

            if (genre != null) {
                genreScores.merge(
                        genre, rating, Double::sum
                );
            }
            if (author != null) {
                authorScores.merge(
                        author, rating, Double::sum
                );
            }
        }

        // 7. Calculate score - qualified books
        Map<Book, Double> bookScores =
                new HashMap<>();

        for (Book book : qualifiedBooks) {

            double score = 0;

            // Reviews mta3 el book
            List<Review> bookReviews =
                    allReviews.stream()
                            .filter(r ->
                                    r.getBook() != null &&
                                            r.getRating() != null &&
                                            r.getBook()
                                                    .getId()
                                                    .equals(book.getId())
                            )
                            .collect(Collectors.toList());

            // Distinct users
            long distinctUsers =
                    bookReviews.stream()
                            .filter(r ->
                                    r.getUser() != null
                            )
                            .map(r -> r.getUser().getId())
                            .distinct()
                            .count();

            // Totale etoiles
            int totalStars =
                    bookReviews.stream()
                            .mapToInt(r ->
                                    r.getRating() != null
                                            ? r.getRating()
                                            : 0
                            )
                            .sum();

            // ✅ +3 par distinct user
            score += distinctUsers * 3;

            // ✅ +1 par etoile
            score += totalStars;

            // ✅ +5 nafs el genre
            if (book.getGenre() != null &&
                    genreScores.containsKey(
                            book.getGenre()
                    )
            ) {
                score += 5;
            }

            // ✅ +3 nafs el author
            if (book.getAuthor() != null &&
                    authorScores.containsKey(
                            book.getAuthor()
                    )
            ) {
                score += 3;
            }

            // ✅ +2 avg rating >= 4
            if (book.getAverageRating() >= 4.0) {
                score += 2;
            }

            bookScores.put(book, score);
        }

        // 8. Sort DESC
        return bookScores.entrySet()
                .stream()
                .sorted(
                        Map.Entry
                                .<Book, Double>
                                        comparingByValue()
                                .reversed()
                )
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());
    }
}