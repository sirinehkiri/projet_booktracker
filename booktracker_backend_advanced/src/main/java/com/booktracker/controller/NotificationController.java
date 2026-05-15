package com.booktracker.controller;

import com.booktracker.entity.Notification;
import com.booktracker.entity.User;
import com.booktracker.repository.NotificationRepository;
import com.booktracker.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "http://localhost:4200")
public class NotificationController {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public NotificationController(
            NotificationRepository notificationRepository,
            UserRepository userRepository
    ) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
    }

    // =========================
    // GET USER NOTIFICATIONS
    // =========================
    @GetMapping
    public List<Notification> getNotifications(
            Authentication authentication
    ) {

        User user = (User) authentication.getPrincipal();

        return notificationRepository
                .findByUserOrderByCreatedAtDesc(user);
    }

    // =========================
    // MARK AS READ
    // =========================
    @PutMapping("/{id}/read")
    public Notification markAsRead(
            @PathVariable Long id,
            Authentication authentication
    ) {

        User user = (User) authentication.getPrincipal();

        Notification notification =
                notificationRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new RuntimeException("Notification not found"));

        if (!notification.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        notification.setRead(true);

        return notificationRepository.save(notification);
    }

    // =========================
    // DELETE NOTIFICATION
    // =========================
    @DeleteMapping("/{id}")
    public void deleteNotification(
            @PathVariable Long id,
            Authentication authentication
    ) {

        User user =
                userRepository
                        .findByUsername(authentication.getName())
                        .orElseThrow(() ->
                                new RuntimeException("User not found"));

        Notification notification =
                notificationRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new RuntimeException("Notification not found"));

        if (!notification.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        notificationRepository.delete(notification);
    }
}