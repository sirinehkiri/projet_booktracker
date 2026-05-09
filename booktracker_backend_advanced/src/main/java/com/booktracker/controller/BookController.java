package com.booktracker.controller;

import com.booktracker.entity.Book;
import com.booktracker.entity.User;
import com.booktracker.services.BookService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/books")
@CrossOrigin(origins = "http://localhost:4200")
public class BookController {

 private final BookService bookService;

 public BookController(BookService bookService) {
  this.bookService = bookService;
 }

 // =====================================================
 // GET ALL BOOKS
 // =====================================================

 @GetMapping
 public ResponseEntity<List<Book>> getAllBooks(
         Authentication authentication
 ) {
  String username = authentication.getName();
  return ResponseEntity.ok(
          bookService.getAllBooks(username)
  );
 }

 // =====================================================
 // GET BOOK BY ID
 // =====================================================

 @GetMapping("/{id}")
 public ResponseEntity<Book> getBookById(
         @PathVariable Long id,
         Authentication authentication
 ) {
  User user =
          (User) authentication.getPrincipal();
  String username = user.getUsername();
  return ResponseEntity.ok(
          bookService.getBookById(id, username)
  );
 }

 // =====================================================
 // SEARCH
 // =====================================================

 @GetMapping("/search")
 public ResponseEntity<List<Book>> searchBooks(
         @RequestParam(required = false)
         String keyword
 ) {
  return ResponseEntity.ok(
          bookService.searchBooks(keyword)
  );
 }

 // =====================================================
 // ADVANCED SEARCH
 // =====================================================

 @GetMapping("/search/advanced")
 public ResponseEntity<List<Book>> advancedSearch(
         @RequestParam(required = false) String title,
         @RequestParam(required = false) String author,
         @RequestParam(required = false) String genre,
         @RequestParam(required = false) Integer year
 ) {
  return ResponseEntity.ok(
          bookService.advancedSearch(
                  title,
                  author,
                  genre,
                  year
          )
  );
 }

 // =====================================================
 // TRENDING
 // =====================================================

 @GetMapping("/trending")
 public ResponseEntity<List<Book>> getTrendingBooks() {
  return ResponseEntity.ok(
          bookService.getTrendingBooks()
  );
 }

 // =====================================================
 // RECENTLY ADDED
 // =====================================================

 @GetMapping("/recent")
 public ResponseEntity<List<Book>> getRecentlyAdded() {
  return ResponseEntity.ok(
          bookService.getRecentlyAdded()
  );
 }

 // =====================================================
 // BY GENRE
 // =====================================================

 @GetMapping("/genre/{genre}")
 public ResponseEntity<List<Book>> getByGenre(
         @PathVariable String genre
 ) {
  return ResponseEntity.ok(
          bookService.getBooksByGenre(genre)
  );
 }

 // =====================================================
 // ALL GENRES
 // =====================================================

 @GetMapping("/genres")
 public ResponseEntity<List<String>> getAllGenres() {
  return ResponseEntity.ok(
          bookService.getAllGenres()
  );
 }

 // =====================================================
 // CREATE BOOK
 // =====================================================

 @PreAuthorize("hasRole('ADMIN')")
 @PostMapping
 public ResponseEntity<Book> createBook(
         @RequestBody Book book,
         Authentication authentication
 ) {
  String username = authentication.getName();
  System.out.println("url " + book.getPic());
  return ResponseEntity.ok(
          bookService.createBook(book, username)
  );
 }

 // =====================================================
 // UPDATE BOOK
 // =====================================================

 @PreAuthorize("hasRole('ADMIN')")
 @PutMapping("/{id}")
 public ResponseEntity<Book> updateBook(
         @PathVariable Long id,
         @RequestBody Book book,
         Authentication authentication
 ) {
  String username = authentication.getName();
  System.out.println(book.getTotal_pages());
  return ResponseEntity.ok(
          bookService.updateBook(
                  id,
                  book,
                  username
          )
  );
 }

 // =====================================================
 // DELETE BOOK
 // =====================================================

 @PreAuthorize("hasRole('ADMIN')")
 @DeleteMapping("/{id}")
 public ResponseEntity<Void> deleteBook(
         @PathVariable Long id,
         Authentication authentication
 ) {
  String username = authentication.getName();
  bookService.deleteBook(id, username);
  return ResponseEntity.noContent().build();
 }
}