package com.booktracker.controller;

import com.booktracker.entity.Review;
import com.booktracker.entity.ReviewVote;
import com.booktracker.entity.User;
import com.booktracker.repository.ReviewRepository;
import com.booktracker.repository.ReviewVoteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

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
    public ReviewVote vote(@PathVariable Long reviewId,
                           @AuthenticationPrincipal User user){

        Review review = reviewRepository.findById(reviewId).orElseThrow();

        Optional<ReviewVote> existing = voteRepository.findByUserAndReview(user, review);

        if(existing.isPresent()){
            return existing.get(); // déjà voté
        }

        ReviewVote vote = new ReviewVote();
        vote.setUser(user);
        vote.setReview(review);
        vote.setValue(1);

        return voteRepository.save(vote);
    }
}
