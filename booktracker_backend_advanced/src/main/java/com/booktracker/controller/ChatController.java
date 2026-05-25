package com.booktracker.controller;

import com.booktracker.model.dto.*;
import com.booktracker.services.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class ChatController {

    private final ChatService chatService;

    // =====================================================
    // PRIVATE CHAT
    // =====================================================

    @GetMapping("/contacts")
    public ResponseEntity<List<ChatContactResponse>> getChatContacts() {
        return ResponseEntity.ok(chatService.getMyChatContacts());
    }

    @GetMapping("/conversation/{userId}")
    public ResponseEntity<List<MessageResponse>> getConversation(@PathVariable Long userId) {
        return ResponseEntity.ok(chatService.getConversationMessages(userId));
    }

    @PostMapping("/send")
    public ResponseEntity<MessageResponse> sendMessage(@RequestBody MessageRequest request) {
        return ResponseEntity.ok(chatService.sendMessage(request));
    }

    @GetMapping("/unread")
    public ResponseEntity<List<MessageResponse>> getUnreadMessages() {
        return ResponseEntity.ok(chatService.getUnreadMessages());
    }

    @PostMapping("/markAsRead/{otherUserId}")
    public ResponseEntity<Void> markMessagesAsRead(@PathVariable Long otherUserId) {
        chatService.markMessagesAsReadForUser(otherUserId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/delete/{messageId}")
    public ResponseEntity<Map<String, String>> deleteMessage(@PathVariable Long messageId) {
        boolean deleted = chatService.deleteMessage(messageId);

        if (deleted) {
            return ResponseEntity.ok(Map.of("status", "success", "message", "Message deleted"));
        }
        return ResponseEntity.badRequest().body(Map.of("status", "error", "message", "Cannot delete this message"));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<Map<String, Object>> getUserById(@PathVariable Long userId) {
        return ResponseEntity.ok(chatService.getUserInfo(userId));
    }

    // =====================================================
    // ✅ GET FRIENDS
    // =====================================================

    @GetMapping("/friends")
    public ResponseEntity<List<MemberDto>> getFriends() {
        // Récupère tes amis acceptés (followers + following confirmés)
        return ResponseEntity.ok(chatService.getMyFriends());
    }

    // =====================================================
    // GROUP CHAT
    // =====================================================

    @PostMapping("/groups")
    public ResponseEntity<GroupResponse> createGroup(@RequestBody GroupCreateRequest request) {
        return ResponseEntity.ok(chatService.createGroup(request));
    }

    @GetMapping("/groups")
    public ResponseEntity<List<GroupResponse>> getMyGroups() {
        return ResponseEntity.ok(chatService.getMyGroups());
    }

    @GetMapping("/groups/all")
    public ResponseEntity<List<GroupResponse>> getAllGroups() {
        return ResponseEntity.ok(chatService.getAllGroups());
    }

    @GetMapping("/groups/{groupId}/conversation")
    public ResponseEntity<List<GroupMessageResponse>> getGroupConversation(@PathVariable Long groupId) {
        return ResponseEntity.ok(chatService.getGroupConversation(groupId));
    }

    @PostMapping("/groups/{groupId}/send")
    public ResponseEntity<GroupMessageResponse> sendGroupMessage(
            @PathVariable Long groupId,
            @RequestBody GroupMessageRequest request
    ) {
        return ResponseEntity.ok(chatService.sendGroupMessage(groupId, request));
    }

    @PostMapping("/groups/{groupId}/markAsRead")
    public ResponseEntity<Void> markGroupAsRead(@PathVariable Long groupId) {
        chatService.markGroupAsRead(groupId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/groups/{groupId}/leave")  // Correction: c'est DELETE pas POST pour leave
    public ResponseEntity<Map<String, String>> leaveGroup(@PathVariable Long groupId) {
        try {
            return ResponseEntity.ok(chatService.leaveGroup(groupId));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("status", "error", "message", e.getMessage()));
        }
    }

    @PostMapping("/groups/{groupId}/rejoin")
    public ResponseEntity<Map<String, String>> rejoinGroup(@PathVariable Long groupId) {
        try {
            return ResponseEntity.ok(chatService.rejoinGroup(groupId));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("status", "error", "message", e.getMessage()));
        }
    }

    @PostMapping("/groups/{groupId}/join")
    public ResponseEntity<Map<String, String>> joinGroupAlias(@PathVariable Long groupId) {
        try {
            return ResponseEntity.ok(chatService.rejoinGroup(groupId));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("status", "error", "message", e.getMessage()));
        }
    }

    // =====================================================
    // USERS & MEMBERS
    // =====================================================

    @GetMapping("/users")
    public ResponseEntity<List<MemberDto>> searchUsers(@RequestParam(required = false) String q) {
        return ResponseEntity.ok(chatService.searchUsers(q));
    }

    @PostMapping("/groups/{groupId}/add-member/{userId}")
    public ResponseEntity<Map<String, String>> addMemberToGroup(
            @PathVariable Long groupId,
            @PathVariable Long userId
    ) {
        try {
            return ResponseEntity.ok(chatService.addMemberToGroup(groupId, userId));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("status", "error", "message", e.getMessage()));
        }
    }
}