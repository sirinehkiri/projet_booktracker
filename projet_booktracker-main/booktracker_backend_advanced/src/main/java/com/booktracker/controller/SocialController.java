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

@RestController
@RequestMapping("/api/social")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class SocialController {

    private final SocialService socialService;

    @GetMapping("/users")
    public ResponseEntity<List<User>> getUsers() {
        return ResponseEntity.ok(socialService.getAllUsersExceptCurrent());
    }

    @GetMapping("/contacts")
    public ResponseEntity<List<User>> getContacts() {
        return ResponseEntity.ok(socialService.getAcceptedContacts());
    }

    @PostMapping("/follow")
    public ResponseEntity<FollowRequest> sendFollow(@RequestBody FollowRequestDto dto) {
        return ResponseEntity.ok(socialService.sendFollowRequest(dto.getReceiverId()));
    }

    @GetMapping("/requests")
    public ResponseEntity<List<FollowRequest>> getRequests() {
        return ResponseEntity.ok(socialService.getPendingRequests());
    }

    @GetMapping("/sent-requests")
    public ResponseEntity<List<FollowRequest>> getSentRequests() {
        return ResponseEntity.ok(socialService.getSentPendingRequests());
    }

    @PutMapping("/requests/{id}/accept")
    public ResponseEntity<FollowRequest> accept(@PathVariable Long id) {
        return ResponseEntity.ok(socialService.acceptRequest(id));
    }

    @PutMapping("/requests/{id}/reject")
    public ResponseEntity<FollowRequest> reject(@PathVariable Long id) {
        return ResponseEntity.ok(socialService.rejectRequest(id));
    }

    @GetMapping("/notifications")
    public ResponseEntity<List<Notification>> getNotifications() {
        return ResponseEntity.ok(socialService.getNotifications());
    }
}