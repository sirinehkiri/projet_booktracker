package com.booktracker.repository;

import com.booktracker.entity.Book;
import com.booktracker.entity.User;
import com.booktracker.entity.UserBook;
import org.springframework.data.jpa.repository.JpaRepository;
import com.booktracker.entity.ReadingStatus;
import java.util.List;
import java.util.Optional;

public interface UserBookRepository extends JpaRepository<UserBook, Long> {

    Optional<UserBook> findByUserAndBook(User user, Book book);

    List<UserBook> findByUser(User user);

    Optional<UserBook> findByUserIdAndBookId(Long userId, Long bookId);

    List<UserBook> findByUserIdAndStatus(Long userId, ReadingStatus status);
    long countByUserIdAndStatus(Long userId, ReadingStatus status);

}
