package com.booktracker.repository;

import com.booktracker.entity.FollowRequest;
import com.booktracker.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface FollowRequestRepository
        extends JpaRepository<FollowRequest, Long> {

    List<FollowRequest> findByReceiver(User receiver);

    List<FollowRequest> findBySender(User sender);

    Optional<FollowRequest> findBySenderAndReceiver(
            User sender,
            User receiver
    );

    // =====================================================
    // FOLLOWING IDS
    // =====================================================

    @Query(
            "SELECT f.receiver.id FROM FollowRequest f " +
                    "WHERE f.sender.id = :userId " +
                    "AND f.status = 'ACCEPTED'"
    )
    List<Long> findFollowingIdsByUserId(
            @Param("userId") Long userId
    );

    // =====================================================
    // COUNT FOLLOWERS / FOLLOWING
    // =====================================================

    long countByReceiverIdAndStatus(
            Long receiverId,
            String status
    );

    long countBySenderIdAndStatus(
            Long senderId,
            String status
    );

    // =====================================================
    // COUNT FRIENDS (
    // =====================================================

    @Query(
            "SELECT COUNT(DISTINCT " +
                    "CASE " +
                    "WHEN f.sender.id = :userId " +
                    "THEN f.receiver.id " +
                    "ELSE f.sender.id " +
                    "END" +
                    ") " +
                    "FROM FollowRequest f " +
                    "WHERE (f.sender.id = :userId " +
                    "OR f.receiver.id = :userId) " +
                    "AND f.status = 'ACCEPTED'"
    )
    long countFriendsByUserId(
            @Param("userId") Long userId
    );
}