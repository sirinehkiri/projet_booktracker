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

import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final FollowRequestRepository followRequestRepository;

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

        return acceptedContacts.stream()
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

    // RENOMMÉ : getConversation devient getConversationMessages
    // TRÈS IMPORTANT : Retire la logique de marquage comme lu d'ici !
    public List<MessageResponse> getConversationMessages(Long otherUserId) { // Renommé userId en otherUserId
        User currentUser = getCurrentUser();

        User otherUser = userRepository.findById(otherUserId) // otherUserId
                .orElseThrow(() -> new RuntimeException("User not found"));

        // *** LA LOGIQUE SUIVANTE EST SUPPRIMÉE D'ICI ***
        // List<Message> unreadMessages = messageRepository.findByReceiverAndSenderAndIsReadFalse(currentUser, otherUser);
        // unreadMessages.forEach(message -> message.setRead(true));
        // messageRepository.saveAll(unreadMessages);
        // *** Elle est maintenant dans markMessagesAsReadForUser() ***

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

        boolean canChat = followRequestRepository.findAll().stream().anyMatch(req ->
                "ACCEPTED".equals(req.getStatus()) &&
                        (
                                (req.getSender().getId().equals(sender.getId()) &&
                                        req.getReceiver().getId().equals(receiver.getId()))
                                        ||
                                        (req.getSender().getId().equals(receiver.getId()) &&
                                                req.getReceiver().getId().equals(sender.getId()))
                        )
        );

        if (!canChat) {
            throw new RuntimeException("You can chat only with accepted contacts");
        }

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

    // NOUVEAU : Méthode dédiée pour marquer les messages d'un utilisateur spécifique comme lus
    public void markMessagesAsReadForUser(Long otherUserId) {
        User currentUser = getCurrentUser();
        User otherUser = userRepository.findById(otherUserId)
                .orElseThrow(() -> new RuntimeException("Other user not found"));

        List<Message> unreadMessages =
                messageRepository.findByReceiverAndSenderAndIsReadFalse(currentUser, otherUser);

        unreadMessages.forEach(message -> message.setRead(true));
        messageRepository.saveAll(unreadMessages);
    }

    private User getCurrentUser() {
        return (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }
    public boolean deleteMessage(Long messageId) {
        User currentUser = getCurrentUser();

        Message message = messageRepository.findByIdAndUser(messageId, currentUser);

        if (message == null) {
            return false;
        }

        messageRepository.delete(message);
        return true;
    }
}
