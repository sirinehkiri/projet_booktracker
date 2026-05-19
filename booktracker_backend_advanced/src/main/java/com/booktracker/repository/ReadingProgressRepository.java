package com.booktracker.repository;

import com.booktracker.entity.ReadingProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface ReadingProgressRepository extends JpaRepository<ReadingProgress, Long> {
    @Query("""
        SELECT COALESCE(SUM(rp.readingTime),0)
        FROM ReadingProgress rp
        WHERE rp.userBook.user.id = :userId
    """)
    Integer getTotalReadingMinutes(Long userId);
}

