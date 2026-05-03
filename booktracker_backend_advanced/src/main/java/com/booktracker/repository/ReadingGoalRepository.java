package com.booktracker.repository;

import com.booktracker.entity.ReadingGoal;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReadingGoalRepository extends JpaRepository<ReadingGoal, Long> {}
