package com.booktracker.controller;

import com.booktracker.entity.Review;
import com.booktracker.entity.ReviewVote;
import com.booktracker.entity.User;
import com.booktracker.repository.ReviewRepository;
import com.booktracker.repository.ReviewVoteRepository;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.ResponseEntity;

import org.springframework.security.core.annotation.AuthenticationPrincipal;

import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/votes")
@CrossOrigin(origins = "http://localhost:4200")
public class ReviewVoteController {

    @Autowired
    private ReviewVoteRepository voteRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    @PostMapping("/{reviewId}")
    public ResponseEntity<Map<String, Object>> vote(
            @PathVariable Long reviewId,
            @AuthenticationPrincipal User user
    ) {

        // =====================================================
        // CHECK USER
        // =====================================================

        if (user == null) {

            return ResponseEntity
                    .badRequest()
                    .body(Map.of(
                            "message",
                            "User not authenticated"
                    ));
        }

        // =====================================================
        // FIND REVIEW
        // =====================================================

        Review review = reviewRepository
                .findById(reviewId)
                .orElseThrow(() ->
                        new RuntimeException("Review not found")
                );

        // =====================================================
        // CHECK EXISTING VOTE
        // =====================================================

        Optional<ReviewVote> existingVote =
                voteRepository.findByUserAndReview(
                        user,
                        review
                );

        Map<String, Object> response =
                new HashMap<>();

        // =====================================================
        // UNLIKE
        // =====================================================

        if (existingVote.isPresent()) {

            voteRepository.delete(existingVote.get());

            long totalLikes =
                    voteRepository.countByReview(review);

            response.put("status", "unliked");

            response.put("liked", false);

            response.put("likesCount", totalLikes);

            return ResponseEntity.ok(response);
        }

        // =====================================================
        // LIKE
        // =====================================================

        ReviewVote vote = new ReviewVote();

        vote.setUser(user);

        vote.setReview(review);

        vote.setValue(1);

        voteRepository.save(vote);

        long totalLikes =
                voteRepository.countByReview(review);

        response.put("status", "liked");

        response.put("liked", true);

        response.put("likesCount", totalLikes);

        return ResponseEntity.ok(response);
    }
}