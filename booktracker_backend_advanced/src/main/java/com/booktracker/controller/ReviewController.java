package com.booktracker.controller;

import com.booktracker.entity.Book;
import com.booktracker.entity.Review;
import com.booktracker.entity.User;
import com.booktracker.repository.BookRepository;
import com.booktracker.repository.ReviewRepository;
import com.booktracker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

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
 public Review addReview(@PathVariable Long bookId,
                         @RequestBody Review review,
                         Principal principal){

  Book book = bookRepository.findById(bookId).orElseThrow();

  User user = userRepository.findByEmail(principal.getName()).orElseThrow();

  review.setBook(book);
  review.setUser(user);

  return reviewRepository.save(review);
 }
}