package com.booktracker.controller;

import com.booktracker.entity.Book;
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

 // GET all books
 @GetMapping
 public ResponseEntity<List<Book>> getAllBooks(Authentication authentication) {

  String username = authentication.getName(); // récupéré du token
  return ResponseEntity.ok(bookService.getAllBooks(username));
 }

 // GET book by ID
 @GetMapping("/{id}")
 public ResponseEntity<Book> getBookById(@PathVariable Long id, Authentication authentication) {

  String username = authentication.getName();

  return ResponseEntity.ok(bookService.getBookById(id, username));
 }

 // CREATE book
 @PreAuthorize("hasRole('ADMIN')")
 @PostMapping

 public ResponseEntity<Book> createBook(@RequestBody Book book, Authentication authentication) {

  String username = authentication.getName();
  System.out.println("url "+book.getPic());

  return ResponseEntity.ok(bookService.createBook(book, username));
 }

 // UPDATE book
 @PreAuthorize("hasRole('ADMIN')")
 @PutMapping("/{id}")
 public ResponseEntity<Book> updateBook(@PathVariable Long id,
                                        @RequestBody Book book,
                                        Authentication authentication) {

  String username = authentication.getName();
  System.out.println(book.getTotal_pages());

  return ResponseEntity.ok(bookService.updateBook(id, book, username));
 }

 // DELETE book
 @PreAuthorize("hasRole('ADMIN')")
 @DeleteMapping("/{id}")
 public ResponseEntity<Void> deleteBook(@PathVariable Long id, Authentication authentication) {

  String username = authentication.getName();

  bookService.deleteBook(id, username);
  return ResponseEntity.noContent().build();
 }
}