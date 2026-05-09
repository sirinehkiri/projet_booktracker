package com.booktracker.services;

import com.booktracker.entity.Book;
import com.booktracker.entity.Review;
import com.booktracker.entity.User;
import com.booktracker.repository.BookRepository;
import com.booktracker.repository.ReviewVoteRepository;
import com.booktracker.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookService {

    private final BookRepository bookRepository;
    private final UserRepository userRepository;
    private final ReviewVoteRepository
            reviewVoteRepository;

    public BookService(
            BookRepository bookRepository,
            UserRepository userRepository,
            ReviewVoteRepository reviewVoteRepository
    ) {
        this.bookRepository = bookRepository;
        this.userRepository = userRepository;
        this.reviewVoteRepository = reviewVoteRepository;
    }

    // =====================================================
    // GET ALL BOOKS - jdid loul
    // =====================================================

    public List<Book> getAllBooks(String username) {
        return bookRepository.findAllOrderByIdDesc();
    }

    // =====================================================
    // GET BOOK BY ID
    // =====================================================

    public Book getBookById(
            Long id,
            String username
    ) {

        Book book = bookRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Book not found: " + id
                        )
                );

        if (username == null) {
            throw new RuntimeException(
                    "Username is null"
            );
        }

        User user = userRepository
                .findByUsername(username)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found: " + username
                        )
                );

        List<Long> likedIds =
                reviewVoteRepository
                        .findLikedReviewIds(user);

        for (Review r : book.getReviews()) {
            r.setLiked(likedIds.contains(r.getId()));
        }

        return book;
    }

    // =====================================================
    // CREATE BOOK
    // =====================================================

    public Book createBook(
            Book book,
            String username
    ) {
        return bookRepository.save(book);
    }

    // =====================================================
    // UPDATE BOOK
    // =====================================================

    public Book updateBook(
            Long id,
            Book updatedBook,
            String username
    ) {
        return bookRepository.findById(id)
                .map(book -> {
                    book.setTitle(
                            updatedBook.getTitle()
                    );
                    book.setAuthor(
                            updatedBook.getAuthor()
                    );
                    book.setGenre(
                            updatedBook.getGenre()
                    );
                    book.setYear(
                            updatedBook.getYear()
                    );
                    book.setDescription(
                            updatedBook.getDescription()
                    );
                    book.setPic(
                            updatedBook.getPic()
                    );
                    book.setLangue(
                            updatedBook.getLangue()
                    );
                    book.setTotal_pages(
                            updatedBook.getTotal_pages()
                    );
                    return bookRepository.save(book);
                })
                .orElseThrow(() ->
                        new RuntimeException(
                                "Book not found: " + id
                        )
                );
    }

    // =====================================================
    // DELETE BOOK
    // =====================================================

    public void deleteBook(
            Long id,
            String username
    ) {
        if (!bookRepository.existsById(id)) {
            throw new RuntimeException(
                    "Book not found: " + id
            );
        }
        bookRepository.deleteById(id);
    }

    // =====================================================
    // SEARCH
    // =====================================================

    public List<Book> searchBooks(String keyword) {
        if (keyword == null ||
                keyword.trim().isEmpty()) {
            return bookRepository
                    .findAllOrderByIdDesc();
        }
        return bookRepository.searchBooks(
                keyword.trim()
        );
    }

    // =====================================================
    // ADVANCED SEARCH
    // =====================================================

    public List<Book> advancedSearch(
            String title,
            String author,
            String genre,
            Integer year
    ) {
        return bookRepository.advancedSearch(
                title != null &&
                        !title.trim().isEmpty()
                        ? title.trim() : null,
                author != null &&
                        !author.trim().isEmpty()
                        ? author.trim() : null,
                genre != null &&
                        !genre.trim().isEmpty()
                        ? genre.trim() : null,
                year
        );
    }

    // =====================================================
    // TRENDING - limit 5
    // =====================================================

    public List<Book> getTrendingBooks() {
        return bookRepository
                .findTrendingBooks()
                .stream()
                .filter(book ->
                        book.getReviews() != null &&
                                !book.getReviews().isEmpty() &&
                                book.getAverageRating() > 0
                )
                .limit(5)
                .collect(Collectors.toList());
    }

    // =====================================================
    // RECENTLY ADDED - jdid loul
    // =====================================================

    public List<Book> getRecentlyAdded() {

        LocalDateTime sevenDaysAgo =
                LocalDateTime.now().minusDays(7);

        List<Book> recent =
                bookRepository
                        .findRecentlyAdded(sevenDaysAgo)
                        .stream()
                        .collect(Collectors.toList());

        if (recent.isEmpty()) {
            return bookRepository
                    .findAllOrderByIdDesc()
                    .stream()
                    .limit(5)
                    .collect(Collectors.toList());
        }

        return recent;
    }

    // =====================================================
    // BY GENRE
    // =====================================================

    public List<Book> getBooksByGenre(String genre) {
        return bookRepository
                .findByGenreIgnoreCase(genre);
    }

    // =====================================================
    // ALL GENRES
    // =====================================================

    public List<String> getAllGenres() {
        return bookRepository.findAllGenres();
    }
}