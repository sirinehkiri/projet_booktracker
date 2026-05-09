package com.booktracker.controller;

import com.booktracker.entity.Book;
import com.booktracker.entity.User;
import com.booktracker.services.RecommendationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/books/recommendations")
@CrossOrigin(origins = "http://localhost:4200")
public class RecommendationController {

    private final RecommendationService
            recommendationService;

    public RecommendationController(
            RecommendationService recommendationService
    ) {
        this.recommendationService =
                recommendationService;
    }

    // =====================================================
    // GET RECOMMENDATIONS
    // =====================================================

    @GetMapping
    public ResponseEntity<List<Book>>
    getRecommendations(
            Authentication authentication
    ) {

        User user =
                (User) authentication.getPrincipal();

        return ResponseEntity.ok(
                recommendationService
                        .getRecommendations(user)
        );
    }
}