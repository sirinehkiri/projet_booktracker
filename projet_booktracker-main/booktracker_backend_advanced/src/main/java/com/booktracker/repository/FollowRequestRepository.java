package com.booktracker.repository;

import com.booktracker.entity.FollowRequest;
import com.booktracker.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FollowRequestRepository extends JpaRepository<FollowRequest, Long> {
    List<FollowRequest> findByReceiver(User receiver);
    List<FollowRequest> findBySender(User sender);
    Optional<FollowRequest> findBySenderAndReceiver(User sender, User receiver);
}