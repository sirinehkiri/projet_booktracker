package com.booktracker.controller;

import com.booktracker.entity.Book;
import com.booktracker.entity.Review;
import com.booktracker.repository.BookRepository;
import com.booktracker.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/reviews")
@CrossOrigin(origins = "http://localhost:4200")
public class ReviewController {

 @Autowired
 private ReviewRepository reviewRepository;

 @Autowired
 private BookRepository bookRepository;

 @PostMapping("/{bookId}")
 public Review addReview(@PathVariable Long bookId, @RequestBody Review review){

  Book book = bookRepository.findById(bookId).orElseThrow();

  review.setBook(book);

  return reviewRepository.save(review);
 }
}