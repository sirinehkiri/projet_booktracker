package com.booktracker.controller;

import com.booktracker.entity.Book;
import com.booktracker.entity.Review;
import com.booktracker.entity.User;
import com.booktracker.repository.BookRepository;
import com.booktracker.repository.ReviewRepository;
import com.booktracker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;


import java.security.Principal;
import java.time.LocalDate;
import java.util.Optional;

@RestController
@RequestMapping("/reviews")
@CrossOrigin(origins = "http://localhost:4200")
public class ReviewController {

 @Autowired
 private ReviewRepository reviewRepository;

 @Autowired
 private BookRepository bookRepository;

 @Autowired
 private UserRepository userRepository;

 @PostMapping("/{bookId}")
 public Review addOrUpdateReview(@PathVariable Long bookId,
                                 @RequestBody Review incoming,
                                 @AuthenticationPrincipal User user) {

  Book book = bookRepository.findById(bookId).orElseThrow();

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
     return existing;
 }


 @GetMapping("/{bookId}/my")
 public Review getMyReview(@PathVariable Long bookId,
                           @AuthenticationPrincipal User user){

  Book book = bookRepository.findById(bookId).orElseThrow();

  Review review = reviewRepository.findByUserAndBook(user, book);

  if (review == null) {
   throw new RuntimeException("Review not found");
  }

  return review;
 }

 @DeleteMapping("/{id}")
 public void delete(@PathVariable Long id,
                    @AuthenticationPrincipal User user) {
  System.out.println("suppp");

  Review r = reviewRepository.findById(id).orElseThrow();

  reviewRepository.delete(r);
 }
}