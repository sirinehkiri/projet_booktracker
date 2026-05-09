package com.booktracker.services;

import com.booktracker.entity.FollowRequest;
import com.booktracker.entity.Notification;
import com.booktracker.entity.User;
import com.booktracker.repository.FollowRequestRepository;
import com.booktracker.repository.NotificationRepository;
import com.booktracker.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class SocialService {

    private final UserRepository userRepository;
    private final FollowRequestRepository
            followRequestRepository;
    private final NotificationRepository
            notificationRepository;

    // =====================================================
    // GET ALL USERS
    // =====================================================

    public List<User> getAllUsersExceptCurrent() {

        User currentUser = getCurrentUser();

        return userRepository.findAll()
                .stream()
                .filter(user ->
                        !user.getId()
                                .equals(currentUser.getId())
                )
                .toList();
    }

    // =====================================================
    // SEND FOLLOW REQUEST
    // =====================================================

    public FollowRequest sendFollowRequest(
            Long receiverId
    ) {

        User sender = getCurrentUser();

        User receiver =
                userRepository.findById(receiverId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                )
                        );

        if (followRequestRepository
                .findBySenderAndReceiver(
                        sender,
                        receiver
                ).isPresent()) {
            throw new RuntimeException(
                    "Follow request already sent"
            );
        }

        FollowRequest request = new FollowRequest();
        request.setSender(sender);
        request.setReceiver(receiver);
        request.setStatus("PENDING");

        return followRequestRepository.save(request);
    }

    // =====================================================
    // GET ACCEPTED CONTACTS
    // =====================================================

    public List<User> getAcceptedContacts() {

        User currentUser = getCurrentUser();

        return followRequestRepository.findAll()
                .stream()
                .filter(req ->
                        "ACCEPTED".equals(req.getStatus())
                )
                .filter(req ->
                        req.getSender()
                                .getId()
                                .equals(currentUser.getId())
                                ||
                                req.getReceiver()
                                        .getId()
                                        .equals(currentUser.getId())
                )
                .map(req ->
                        req.getSender()
                                .getId()
                                .equals(currentUser.getId())
                                ? req.getReceiver()
                                : req.getSender()
                )
                .distinct()
                .toList();
    }

    // =====================================================
    // GET PENDING REQUESTS
    // =====================================================

    public List<FollowRequest> getPendingRequests() {

        User currentUser = getCurrentUser();

        return followRequestRepository
                .findByReceiver(currentUser)
                .stream()
                .filter(req ->
                        "PENDING".equals(req.getStatus())
                )
                .toList();
    }

    // =====================================================
    // GET SENT PENDING REQUESTS
    // =====================================================

    public List<FollowRequest> getSentPendingRequests() {

        User currentUser = getCurrentUser();

        return followRequestRepository
                .findBySender(currentUser)
                .stream()
                .filter(req ->
                        "PENDING".equals(req.getStatus())
                )
                .toList();
    }

    // =====================================================
    // ACCEPT REQUEST
    // =====================================================

    public FollowRequest acceptRequest(Long requestId) {

        User currentUser = getCurrentUser();

        FollowRequest request =
                followRequestRepository
                        .findById(requestId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Request not found"
                                )
                        );

        if (!request.getReceiver()
                .getId()
                .equals(currentUser.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        request.setStatus("ACCEPTED");

        FollowRequest savedRequest =
                followRequestRepository.save(request);

        Notification notification = new Notification();
        notification.setUser(request.getSender());
        notification.setMessage(
                currentUser.getUsername() +
                        " accepted your follow request"
        );
        notificationRepository.save(notification);

        return savedRequest;
    }

    // =====================================================
    // REJECT REQUEST
    // =====================================================

    public FollowRequest rejectRequest(Long requestId) {

        User currentUser = getCurrentUser();

        FollowRequest request =
                followRequestRepository
                        .findById(requestId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Request not found"
                                )
                        );

        if (!request.getReceiver()
                .getId()
                .equals(currentUser.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        request.setStatus("REJECTED");

        FollowRequest savedRequest =
                followRequestRepository.save(request);

        Notification notification = new Notification();
        notification.setUser(request.getSender());
        notification.setMessage(
                currentUser.getUsername() +
                        " rejected your follow request"
        );
        notificationRepository.save(notification);

        return savedRequest;
    }

    // =====================================================
    // GET NOTIFICATIONS
    // =====================================================

    public List<Notification> getNotifications() {
        return notificationRepository
                .findByUserOrderByCreatedAtDesc(
                        getCurrentUser()
                );
    }

    // =====================================================
    // ✅ GET FLOWS COUNT
    // =====================================================

    public Map<String, Long> getUserFlows(
            Long userId
    ) {

        Map<String, Long> flows = new HashMap<>();

        long followers =
                followRequestRepository
                        .countByReceiverIdAndStatus(
                                userId,
                                "ACCEPTED"
                        );

        long following =
                followRequestRepository
                        .countBySenderIdAndStatus(
                                userId,
                                "ACCEPTED"
                        );

        flows.put("followers", followers);
        flows.put("following", following);
        flows.put("total", followers + following);

        return flows;
    }

    // =====================================================
    // CURRENT USER
    // =====================================================

    private User getCurrentUser() {
        return (User) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();
    }
}