package com.booktracker.repository;

import com.booktracker.entity.Review;
import com.booktracker.entity.ReviewVote;
import com.booktracker.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ReviewVoteRepository extends JpaRepository<ReviewVote, Long> {
    Optional<ReviewVote> findByUserAndReview(User user, Review review);
    @Query("SELECT v.review.id FROM ReviewVote v WHERE v.user = :user")
    List<Long> findLikedReviewIds(@Param("user") User user);
}
