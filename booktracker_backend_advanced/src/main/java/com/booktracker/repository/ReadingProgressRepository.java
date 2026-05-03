package com.booktracker.repository;

import com.booktracker.entity.ReadingProgress;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReadingProgressRepository extends JpaRepository<ReadingProgress, Long> {}

