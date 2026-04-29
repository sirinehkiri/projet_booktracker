package com.booktracker.controller;

import com.booktracker.entity.Book;
import com.booktracker.entity.Review;
import com.booktracker.entity.User;
import com.booktracker.repository.BookRepository;
import com.booktracker.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;

@RestController
@RequestMapping("/reviews")
@CrossOrigin(origins = "http://localhost:4200")
public class ReviewController {

 @Autowired
 private ReviewRepository reviewRepository;

 @Autowired
 private BookRepository bookRepository;

 @PostMapping("/{bookId}")
 public Review addOrUpdateReview(@PathVariable Long bookId,
                                 @RequestBody Review incoming,
                                 @AuthenticationPrincipal User user) {

  if (user == null) {
   throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not authenticated");
  }

  Book book = bookRepository.findById(bookId)
          .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Book not found"));

  Review existing = reviewRepository.findByUserAndBook(user, book);
  if (existing != null) {

   if (incoming.getRating() != null) {
    existing.setRating(incoming.getRating());
   }

   if (incoming.getComment() != null) {
    existing.setComment(incoming.getComment());
   }

   existing.setDate(LocalDate.now());

   return reviewRepository.save(existing);
  }

  Review newReview = new Review();
  newReview.setUser(user);
  newReview.setBook(book);
  newReview.setRating(incoming.getRating());
  newReview.setComment(incoming.getComment());
  newReview.setDate(LocalDate.now());

  return reviewRepository.save(newReview);
 }


 @GetMapping("/{bookId}/my")
 public Review getMyReview(@PathVariable Long bookId,
                           @AuthenticationPrincipal User user) {

  if (user == null) {
   throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not authenticated");
  }

  Book book = bookRepository.findById(bookId)
          .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Book not found"));

  return reviewRepository.findByUserAndBook(user, book);
 }

 @DeleteMapping("/{id}")
 public void delete(@PathVariable Long id,
                    @AuthenticationPrincipal User user) {

  Review review = reviewRepository.findById(id)
          .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Review not found"));


  reviewRepository.delete(review);
 }
}