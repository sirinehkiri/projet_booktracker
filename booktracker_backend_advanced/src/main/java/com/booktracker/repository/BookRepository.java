package com.booktracker.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.booktracker.entity.Book;

import java.time.LocalDateTime;
import java.util.List;

public interface BookRepository
        extends JpaRepository<Book, Long> {

    // =====================================================
    // ALL BOOKS
    // =====================================================

    @Query("""
        SELECT b FROM Book b
        ORDER BY b.id DESC
        """)
    List<Book> findAllOrderByIdDesc();

    // =====================================================
    // SEARCH
    // =====================================================

    @Query("""
        SELECT b FROM Book b
        WHERE LOWER(b.title)
                LIKE LOWER(CONCAT('%', :keyword, '%'))
           OR LOWER(b.author)
                LIKE LOWER(CONCAT('%', :keyword, '%'))
           OR LOWER(b.genre)
                LIKE LOWER(CONCAT('%', :keyword, '%'))
           OR LOWER(b.description)
                LIKE LOWER(CONCAT('%', :keyword, '%'))
        """)
    List<Book> searchBooks(
            @Param("keyword") String keyword
    );

    // =====================================================
    // ADVANCED SEARCH
    // =====================================================

    @Query("""
        SELECT b FROM Book b
        WHERE (:title IS NULL
            OR LOWER(b.title)
                LIKE LOWER(CONCAT('%', :title, '%')))
          AND (:author IS NULL
            OR LOWER(b.author)
                LIKE LOWER(CONCAT('%', :author, '%')))
          AND (:genre IS NULL
            OR LOWER(b.genre)
                LIKE LOWER(CONCAT('%', :genre, '%')))
          AND (:year IS NULL
            OR b.year = :year)
        """)
    List<Book> advancedSearch(
            @Param("title")  String title,
            @Param("author") String author,
            @Param("genre")  String genre,
            @Param("year")   Integer year
    );

    // =====================================================
    // TRENDING
    // =====================================================

    @Query("""
        SELECT b FROM Book b
        LEFT JOIN b.reviews r
        GROUP BY b
        HAVING AVG(r.rating) > 0
        ORDER BY AVG(r.rating) DESC
        """)
    List<Book> findTrendingBooks();

    // =====================================================
    // RECENTLY ADDED
    // =====================================================

    @Query("""
        SELECT b FROM Book b
        WHERE b.createdAt >= :fromDate
        ORDER BY b.createdAt DESC
        """)
    List<Book> findRecentlyAdded(
            @Param("fromDate")
            LocalDateTime fromDate
    );

    // =====================================================
    // BY GENRE
    // =====================================================

    List<Book> findByGenreIgnoreCase(String genre);

    // =====================================================
    // ALL GENRES
    // =====================================================

    @Query("""
        SELECT DISTINCT b.genre
        FROM Book b
        ORDER BY b.genre
        """)
    List<String> findAllGenres();
}