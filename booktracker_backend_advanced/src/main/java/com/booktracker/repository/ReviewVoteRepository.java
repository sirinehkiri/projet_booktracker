package com.booktracker.repository;

import com.booktracker.entity.Review;
import com.booktracker.entity.ReviewVote;
import com.booktracker.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ReviewVoteRepository extends JpaRepository<ReviewVote, Long> {
    Optional<ReviewVote> findByUserAndReview(User user, Review review);
}
