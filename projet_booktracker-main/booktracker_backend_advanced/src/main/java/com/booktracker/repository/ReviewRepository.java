package com.booktracker.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.booktracker.entity.Review;

public interface ReviewRepository extends JpaRepository<Review, Long> {
}