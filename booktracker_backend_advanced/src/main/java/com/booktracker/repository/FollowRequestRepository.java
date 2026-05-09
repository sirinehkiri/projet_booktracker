package com.booktracker.repository;

import com.booktracker.entity.FollowRequest;
import com.booktracker.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface FollowRequestRepository extends JpaRepository<FollowRequest, Long> {
    List<FollowRequest> findByReceiver(User receiver);
    List<FollowRequest> findBySender(User sender);
    Optional<FollowRequest> findBySenderAndReceiver(User sender, User receiver);
    @Query("SELECT f.receiver.id FROM FollowRequest f WHERE f.sender.id = :userId AND f.status = 'ACCEPTED'")
    List<Long> findFollowingIdsByUserId(@Param("userId") Long userId);

    long countByReceiverIdAndStatus(Long receiverId, String status);
    long countBySenderIdAndStatus(Long senderId, String status);
}
