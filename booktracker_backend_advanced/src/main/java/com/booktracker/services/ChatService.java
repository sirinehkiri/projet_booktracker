package com.booktracker.services;

import com.booktracker.entity.Message;
import com.booktracker.entity.User;
import com.booktracker.model.dto.ChatContactResponse;
import com.booktracker.model.dto.MessageRequest;
import com.booktracker.model.dto.MessageResponse;
import com.booktracker.repository.FollowRequestRepository;
import com.booktracker.repository.MessageRepository;
import com.booktracker.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final FollowRequestRepository followRequestRepository;

    // ============================================
    // CONTACTS
    // ============================================
    public List<ChatContactResponse> getMyChatContacts() {
        User currentUser = getCurrentUser();

        List<User> acceptedContacts = followRequestRepository.findAll().stream()
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

        List<Message> allMessages = messageRepository.findAll();
        Set<User> chatPartners = allMessages.stream()
                .filter(m -> m.getSender().getId().equals(currentUser.getId()) ||
                        m.getReceiver().getId().equals(currentUser.getId()))
                .map(m -> m.getSender().getId().equals(currentUser.getId())
                        ? m.getReceiver()
                        : m.getSender())
                .distinct()
                .collect(Collectors.toSet());

        Set<Long> seenIds = new HashSet<>();
        seenIds.add(currentUser.getId());
        List<User> allContacts = new ArrayList<>();

        for (User contact : acceptedContacts) {
            if (!seenIds.contains(contact.getId())) {
                seenIds.add(contact.getId());
                allContacts.add(contact);
            }
        }

        for (User contact : chatPartners) {
            if (!seenIds.contains(contact.getId())) {
                seenIds.add(contact.getId());
                allContacts.add(contact);
            }
        }

        return allContacts.stream()
                .map(contact -> {
                    List<Message> conversation =
                            messageRepository.findBySenderAndReceiverOrSenderAndReceiverOrderBySentAtAsc(
                                    currentUser, contact, contact, currentUser
                            );

                    Message lastMessage = conversation.isEmpty()
                            ? null
                            : conversation.get(conversation.size() - 1);

                    return new ChatContactResponse(
                            contact.getId(),
                            contact.getUsername(),
                            contact.getEmail(),
                            "",
                            lastMessage != null ? lastMessage.getContent() : "",
                            lastMessage != null ? lastMessage.getSentAt() : null,
                            lastMessage != null ? lastMessage.getSender().getUsername() : ""
                    );
                })
                .sorted(Comparator.comparing(
                        ChatContactResponse::getLastMessageDate,
                        Comparator.nullsLast(Comparator.reverseOrder())
                ))
                .toList();
    }

    // ============================================
    // CONVERSATION
    // ============================================
    public List<MessageResponse> getConversationMessages(Long userId) {
        User currentUser = getCurrentUser();

        User otherUser = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Message> messages =
                messageRepository.findBySenderAndReceiverOrSenderAndReceiverOrderBySentAtAsc(
                        currentUser, otherUser, otherUser, currentUser
                );

        return messages.stream()
                .map(message -> new MessageResponse(
                        message.getId(),
                        message.getSender().getId(),
                        message.getReceiver().getId(),
                        message.getSender().getUsername(),
                        message.getContent(),
                        message.getSentAt(),
                        message.isRead()
                ))
                .toList();
    }

    // ============================================
    // ENVOYER
    // ============================================
    public MessageResponse sendMessage(MessageRequest request) {
        User sender = getCurrentUser();

        if (request.getReceiverId() == null) {
            throw new RuntimeException("Receiver is required");
        }

        if (request.getContent() == null || request.getContent().trim().isEmpty()) {
            throw new RuntimeException("Message content cannot be empty");
        }

        User receiver = userRepository.findById(request.getReceiverId())
                .orElseThrow(() -> new RuntimeException("Receiver not found"));

        Message message = new Message();
        message.setSender(sender);
        message.setReceiver(receiver);
        message.setContent(request.getContent().trim());
        message.setRead(false);

        Message savedMessage = messageRepository.save(message);

        return new MessageResponse(
                savedMessage.getId(),
                savedMessage.getSender().getId(),
                savedMessage.getReceiver().getId(),
                savedMessage.getSender().getUsername(),
                savedMessage.getContent(),
                savedMessage.getSentAt(),
                savedMessage.isRead()
        );
    }

    // ============================================
    // MESSAGES NON LUS
    // ============================================
    public List<MessageResponse> getUnreadMessages() {
        User currentUser = getCurrentUser();

        List<Message> unreadMessages =
                messageRepository.findByReceiverAndIsReadFalseOrderBySentAtDesc(currentUser);

        return unreadMessages.stream()
                .map(message -> new MessageResponse(
                        message.getId(),
                        message.getSender().getId(),
                        message.getReceiver().getId(),
                        message.getSender().getUsername(),
                        message.getContent(),
                        message.getSentAt(),
                        message.isRead()
                ))
                .toList();
    }

    // ============================================
    // MARQUER COMME LU
    // ============================================
    public void markMessagesAsReadForUser(Long otherUserId) {
        User currentUser = getCurrentUser();

        User otherUser = userRepository.findById(otherUserId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Message> unreadMessages =
                messageRepository.findByReceiverAndSenderAndIsReadFalse(currentUser, otherUser);

        unreadMessages.forEach(message -> message.setRead(true));
        messageRepository.saveAll(unreadMessages);
    }

    // ============================================
    // SUPPRIMER
    // ============================================
    public boolean deleteMessage(Long messageId) {
        User currentUser = getCurrentUser();

        Optional<Message> optionalMessage = messageRepository.findById(messageId);

        if (optionalMessage.isEmpty()) {
            return false;
        }

        Message message = optionalMessage.get();

        if (!message.getSender().getId().equals(currentUser.getId()) &&
                !message.getReceiver().getId().equals(currentUser.getId())) {
            return false;
        }

        messageRepository.delete(message);
        return true;
    }

    // ============================================
    // GET USER INFO
    // ============================================
    public Map<String, Object> getUserInfo(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Map<String, Object> response = new HashMap<>();
        response.put("id", user.getId());
        response.put("username", user.getUsername());
        response.put("email", user.getEmail());
        return response;
    }

    // ============================================
    // USER COURANT
    // ============================================
    private User getCurrentUser() {
        return (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }
}