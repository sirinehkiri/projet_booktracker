package com.booktracker.repository;

import com.booktracker.entity.BookList;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface BookListRepository extends JpaRepository<BookList, Long> {
    List<BookList> findByUserIdOrderByPositionAsc(Long userId);
    Optional<BookList> findByIdAndUserId(Long id, Long userId);
    boolean existsByUserIdAndNameIgnoreCase(Long userId, String name);
}