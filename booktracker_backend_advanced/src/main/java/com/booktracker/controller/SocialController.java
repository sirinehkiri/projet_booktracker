package com.booktracker.controller;

import com.booktracker.entity.FollowRequest;
import com.booktracker.entity.Notification;
import com.booktracker.entity.User;
import com.booktracker.model.dto.FollowRequestDto;
import com.booktracker.services.SocialService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/social")
@RequiredArgsConstructor
public class SocialController {

    private final SocialService socialService;

    // =====================================================
    // GET USERS
    // =====================================================

    @GetMapping("/users")
    public ResponseEntity<List<User>> getUsers() {
        return ResponseEntity.ok(
                socialService.getAllUsersExceptCurrent()
        );
    }

    // =====================================================
    // GET CONTACTS
    // =====================================================

    @GetMapping("/contacts")
    public ResponseEntity<List<User>> getContacts() {
        return ResponseEntity.ok(
                socialService.getAcceptedContacts()
        );
    }

    // =====================================================
    // SEND FOLLOW REQUEST
    // =====================================================

    @PostMapping("/follow")
    public ResponseEntity<FollowRequest> sendFollow(
            @RequestBody FollowRequestDto dto
    ) {
        return ResponseEntity.ok(
                socialService.sendFollowRequest(
                        dto.getReceiverId()
                )
        );
    }

    // =====================================================
    // GET PENDING REQUESTS
    // =====================================================

    @GetMapping("/requests")
    public ResponseEntity<List<FollowRequest>>
    getRequests() {
        return ResponseEntity.ok(
                socialService.getPendingRequests()
        );
    }

    // =====================================================
    // GET SENT REQUESTS
    // =====================================================

    @GetMapping("/sent-requests")
    public ResponseEntity<List<FollowRequest>>
    getSentRequests() {
        return ResponseEntity.ok(
                socialService.getSentPendingRequests()
        );
    }

    // =====================================================
    // ACCEPT REQUEST
    // =====================================================

    @PutMapping("/requests/{id}/accept")
    public ResponseEntity<FollowRequest> accept(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(
                socialService.acceptRequest(id)
        );
    }

    // =====================================================
    // REJECT REQUEST
    // =====================================================

    @PutMapping("/requests/{id}/reject")
    public ResponseEntity<FollowRequest> reject(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(
                socialService.rejectRequest(id)
        );
    }

    // =====================================================
    // GET NOTIFICATIONS
    // =====================================================

    @GetMapping("/notifications")
    public ResponseEntity<List<Notification>>
    getNotifications() {
        return ResponseEntity.ok(
                socialService.getNotifications()
        );
    }

    // =====================================================
    // ✅ GET FLOWS COUNT
    // =====================================================

    @GetMapping("/users/{userId}/flows")
    public ResponseEntity<Map<String, Long>>
    getUserFlows(
            @PathVariable Long userId
    ) {
        return ResponseEntity.ok(
                socialService.getUserFlows(userId)
        );
    }
    private long followersCount;

    public long getFollowersCount() {
        return followersCount;
    }

    public void setFollowersCount(
            long followersCount
    ) {
        this.followersCount = followersCount;
    }

}