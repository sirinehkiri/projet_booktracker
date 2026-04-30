package com.booktracker.controller;

import com.booktracker.model.dto.ChatContactResponse;
import com.booktracker.model.dto.MessageRequest;
import com.booktracker.model.dto.MessageResponse;
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
            return ResponseEntity.ok(Map.of("status", "Message deleted"));
        } else {
            return ResponseEntity.badRequest().body(Map.of("status", "Cannot delete this message"));
        }
    }
}