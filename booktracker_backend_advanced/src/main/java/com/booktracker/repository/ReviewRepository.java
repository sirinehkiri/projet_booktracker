package com.booktracker.repository;

import com.booktracker.entity.Book;
import com.booktracker.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import com.booktracker.entity.Review;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    Review findByUserAndBook(User user, Book book);

}