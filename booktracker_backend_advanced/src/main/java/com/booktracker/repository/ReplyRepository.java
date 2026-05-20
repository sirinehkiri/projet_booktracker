package com.booktracker.repository;

import com.booktracker.entity.Reply;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReplyRepository
        extends JpaRepository<Reply, Long> {
}