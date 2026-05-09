package com.booktracker.repository;

import com.booktracker.entity.Book;
import com.booktracker.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import com.booktracker.entity.Review;
import java.util.List;
public interface ReviewRepository extends JpaRepository<Review, Long> {
    Review findByUserAndBook(User user, Book book);
    List<Review> findByUserIdOrderByDateDesc(Long userId);
    List<Review> findByUserIdInAndRatingGreaterThanEqual(List<Long> userIds, Integer rating);
    List<Review> findByUser(User user);
}

