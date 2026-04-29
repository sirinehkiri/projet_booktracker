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

import java.util.List;

@Service
@RequiredArgsConstructor
public class SocialService {

    private final UserRepository userRepository;
    private final FollowRequestRepository followRequestRepository;
    private final NotificationRepository notificationRepository;

    public List<User> getAllUsersExceptCurrent() {
        User currentUser = getCurrentUser();
        return userRepository.findAll()
                .stream()
                .filter(user -> !user.getId().equals(currentUser.getId()))
                .toList();
    }

    public FollowRequest sendFollowRequest(Long receiverId) {
        User sender = getCurrentUser();

        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (followRequestRepository.findBySenderAndReceiver(sender, receiver).isPresent()) {
            throw new RuntimeException("Follow request already sent");
        }

        FollowRequest request = new FollowRequest();
        request.setSender(sender);
        request.setReceiver(receiver);
        request.setStatus("PENDING");

        return followRequestRepository.save(request);
    }

    public List<User> getAcceptedContacts() {
        User currentUser = getCurrentUser();

        return followRequestRepository.findAll().stream()
                .filter(req -> "ACCEPTED".equals(req.getStatus()))
                .filter(req ->
                        req.getSender().getId().equals(currentUser.getId()) ||
                                req.getReceiver().getId().equals(currentUser.getId())
                )
                .map(req -> req.getSender().getId().equals(currentUser.getId())
                        ? req.getReceiver()
                        : req.getSender())
                .distinct()
                .toList();
    }

    public List<FollowRequest> getPendingRequests() {
        User currentUser = getCurrentUser();

        return followRequestRepository.findByReceiver(currentUser)
                .stream()
                .filter(req -> "PENDING".equals(req.getStatus()))
                .toList();
    }

    public List<FollowRequest> getSentPendingRequests() {
        User currentUser = getCurrentUser();

        return followRequestRepository.findBySender(currentUser)
                .stream()
                .filter(req -> "PENDING".equals(req.getStatus()))
                .toList();
    }

    public FollowRequest acceptRequest(Long requestId) {
        User currentUser = getCurrentUser();

        FollowRequest request = followRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        if (!request.getReceiver().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        request.setStatus("ACCEPTED");
        FollowRequest savedRequest = followRequestRepository.save(request);

        Notification notification = new Notification();
        notification.setUser(request.getSender());
        notification.setMessage(currentUser.getUsername() + " accepted your follow request");
        notificationRepository.save(notification);

        return savedRequest;
    }

    public FollowRequest rejectRequest(Long requestId) {
        User currentUser = getCurrentUser();

        FollowRequest request = followRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        if (!request.getReceiver().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        request.setStatus("REJECTED");
        FollowRequest savedRequest = followRequestRepository.save(request);

        Notification notification = new Notification();
        notification.setUser(request.getSender());
        notification.setMessage(currentUser.getUsername() + " rejected your follow request");
        notificationRepository.save(notification);

        return savedRequest;
    }

    public List<Notification> getNotifications() {
        return notificationRepository.findByUserOrderByCreatedAtDesc(getCurrentUser());
    }

    private User getCurrentUser() {
        return (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }
}