
package com.booktracker.controller;
import org.springframework.web.bind.annotation.*;
import java.util.*;
import com.booktracker.entity.Review;
import com.booktracker.repository.ReviewRepository;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {
 private final ReviewRepository repo;
 public ReviewController(ReviewRepository repo){this.repo=repo;}

 @GetMapping
 public List<Review> getAll(){return repo.findAll();}
}
