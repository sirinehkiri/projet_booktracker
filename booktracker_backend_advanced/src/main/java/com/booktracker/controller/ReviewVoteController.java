package com.booktracker.controller;

import com.booktracker.entity.Review;
import com.booktracker.entity.ReviewVote;
import com.booktracker.entity.User;
import com.booktracker.repository.ReviewRepository;
import com.booktracker.repository.ReviewVoteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

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
    public Map<String, String> vote(@PathVariable Long reviewId,
                       @AuthenticationPrincipal User user) {

        Review review = reviewRepository.findById(reviewId)
                .orElseThrow();

        Optional<ReviewVote> existing =
                voteRepository.findByUserAndReview(user, review);

        // 🔥 TOGGLE (like/unlike)
        if (existing.isPresent()) {
            voteRepository.delete(existing.get());
            return Map.of("status", "unliked");
        }

        ReviewVote vote = new ReviewVote();
        vote.setUser(user);
        vote.setReview(review);
        vote.setValue(1);

        voteRepository.save(vote);

        return Map.of("status", "liked");
    }
}
