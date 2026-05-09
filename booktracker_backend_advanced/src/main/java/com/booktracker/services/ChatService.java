package com.booktracker.services;

import com.booktracker.entity.ChatGroup;
import com.booktracker.entity.GroupMember;
import com.booktracker.entity.GroupMessage;
import com.booktracker.entity.Message;
import com.booktracker.entity.User;

import com.booktracker.model.dto.ChatContactResponse;
import com.booktracker.model.dto.GroupCreateRequest;
import com.booktracker.model.dto.GroupMessageRequest;
import com.booktracker.model.dto.GroupMessageResponse;
import com.booktracker.model.dto.GroupResponse;
import com.booktracker.model.dto.MemberDto;
import com.booktracker.model.dto.MessageRequest;
import com.booktracker.model.dto.MessageResponse;

import com.booktracker.repository.ChatGroupRepository;
import com.booktracker.repository.FollowRequestRepository;
import com.booktracker.repository.GroupMemberRepository;
import com.booktracker.repository.GroupMessageRepository;
import com.booktracker.repository.MessageRepository;
import com.booktracker.repository.UserRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ChatService {

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final FollowRequestRepository followRequestRepository;

    // GROUP
    private final ChatGroupRepository chatGroupRepository;
    private final GroupMemberRepository groupMemberRepository;
    private final GroupMessageRepository groupMessageRepository;

    // =====================================================
    // CONTACTS
    // =====================================================

    @Transactional(readOnly = true)
    public List<ChatContactResponse>
    getMyChatContacts() {

        User currentUser = getCurrentUser();

        List<User> acceptedContacts =
                followRequestRepository.findAll()
                        .stream()
                        .filter(req ->
                                "ACCEPTED".equals(
                                        req.getStatus()
                                )
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
                        .collect(Collectors.toList());

        List<Message> allMessages =
                messageRepository.findAll();

        Set<User> chatPartners =
                allMessages.stream()
                        .filter(m ->
                                m.getSender()
                                        .getId()
                                        .equals(currentUser.getId())
                                        ||
                                        m.getReceiver()
                                                .getId()
                                                .equals(currentUser.getId())
                        )
                        .map(m ->
                                m.getSender()
                                        .getId()
                                        .equals(currentUser.getId())
                                        ? m.getReceiver()
                                        : m.getSender()
                        )
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
                            messageRepository
                                    .findBySenderAndReceiverOrSenderAndReceiverOrderBySentAtAsc(
                                            currentUser,
                                            contact,
                                            contact,
                                            currentUser
                                    );

                    Message lastMessage =
                            conversation.isEmpty()
                                    ? null
                                    : conversation.get(
                                    conversation.size() - 1
                            );

                    return new ChatContactResponse(
                            contact.getId(),
                            contact.getUsername(),
                            contact.getEmail(),
                            "",
                            lastMessage != null
                                    ? lastMessage.getContent()
                                    : "",
                            lastMessage != null
                                    ? lastMessage.getSentAt()
                                    : null,
                            lastMessage != null
                                    ? lastMessage.getSender()
                                      .getUsername()
                                    : ""
                    );
                })
                .sorted(
                        Comparator.comparing(
                                ChatContactResponse
                                        ::getLastMessageDate,
                                Comparator.nullsLast(
                                        Comparator.reverseOrder()
                                )
                        )
                )
                .collect(Collectors.toList());
    }

    // =====================================================
    // PRIVATE CONVERSATION
    // =====================================================

    @Transactional(readOnly = true)
    public List<MessageResponse>
    getConversationMessages(Long userId) {

        User currentUser = getCurrentUser();

        User otherUser =
                userRepository.findById(userId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                )
                        );

        List<Message> messages =
                messageRepository
                        .findBySenderAndReceiverOrSenderAndReceiverOrderBySentAtAsc(
                                currentUser,
                                otherUser,
                                otherUser,
                                currentUser
                        );

        return messages.stream()
                .map(message ->
                        new MessageResponse(
                                message.getId(),
                                message.getSender().getId(),
                                message.getReceiver().getId(),
                                message.getSender().getUsername(),
                                message.getContent(),
                                message.getSentAt(),
                                message.isRead()
                        )
                )
                .collect(Collectors.toList());
    }

    // =====================================================
    // SEND PRIVATE MESSAGE
    // =====================================================

    public MessageResponse
    sendMessage(MessageRequest request) {

        User sender = getCurrentUser();

        if (request.getReceiverId() == null) {
            throw new RuntimeException(
                    "Receiver is required"
            );
        }

        if (request.getContent() == null ||
                request.getContent().trim().isEmpty()) {
            throw new RuntimeException(
                    "Message content cannot be empty"
            );
        }

        User receiver =
                userRepository.findById(
                                request.getReceiverId()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Receiver not found"
                                )
                        );

        Message message = new Message();

        message.setSender(sender);
        message.setReceiver(receiver);
        message.setContent(request.getContent().trim());
        message.setRead(false);

        Message savedMessage =
                messageRepository.save(message);

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

    // =====================================================
    // PRIVATE UNREAD
    // =====================================================

    @Transactional(readOnly = true)
    public List<MessageResponse>
    getUnreadMessages() {

        User currentUser = getCurrentUser();

        List<Message> unreadMessages =
                messageRepository
                        .findByReceiverAndIsReadFalseOrderBySentAtDesc(
                                currentUser
                        );

        return unreadMessages.stream()
                .map(message ->
                        new MessageResponse(
                                message.getId(),
                                message.getSender().getId(),
                                message.getReceiver().getId(),
                                message.getSender().getUsername(),
                                message.getContent(),
                                message.getSentAt(),
                                message.isRead()
                        )
                )
                .collect(Collectors.toList());
    }

    // =====================================================
    // MARK PRIVATE AS READ
    // =====================================================

    public void markMessagesAsReadForUser(
            Long otherUserId
    ) {

        User currentUser = getCurrentUser();

        User otherUser =
                userRepository.findById(otherUserId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                )
                        );

        List<Message> unreadMessages =
                messageRepository
                        .findByReceiverAndSenderAndIsReadFalse(
                                currentUser,
                                otherUser
                        );

        unreadMessages.forEach(
                message -> message.setRead(true)
        );

        messageRepository.saveAll(unreadMessages);
    }

    // =====================================================
    // DELETE PRIVATE
    // =====================================================

    public boolean deleteMessage(Long messageId) {

        User currentUser = getCurrentUser();

        Optional<Message> optionalMessage =
                messageRepository.findById(messageId);

        if (optionalMessage.isEmpty()) {
            return false;
        }

        Message message = optionalMessage.get();

        boolean isSender =
                message.getSender()
                        .getId()
                        .equals(currentUser.getId());

        boolean isReceiver =
                message.getReceiver()
                        .getId()
                        .equals(currentUser.getId());

        if (!isSender && !isReceiver) {
            return false;
        }

        messageRepository.delete(message);

        return true;
    }

    // =====================================================
    // USER INFO
    // =====================================================

    @Transactional(readOnly = true)
    public Map<String, Object>
    getUserInfo(Long userId) {

        User user =
                userRepository.findById(userId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                )
                        );

        Map<String, Object> response = new HashMap<>();

        response.put("id", user.getId());
        response.put("username", user.getUsername());
        response.put("email", user.getEmail());

        return response;
    }

    // =====================================================
    // CREATE GROUP
    // =====================================================

    public GroupResponse createGroup(
            GroupCreateRequest request
    ) {

        User currentUser = getCurrentUser();

        if (request.getName() == null ||
                request.getName().trim().isEmpty()) {
            throw new RuntimeException(
                    "Group name required"
            );
        }

        ChatGroup group = new ChatGroup();

        group.setName(request.getName().trim());
        group.setCreatedBy(currentUser);

        ChatGroup savedGroup =
                chatGroupRepository.save(group);

        // CREATOR
        GroupMember creator = new GroupMember();

        creator.setChatGroup(savedGroup);
        creator.setUser(currentUser);
        creator.setLastReadAt(LocalDateTime.now());

        groupMemberRepository.save(creator);

        // MEMBERS
        if (request.getMemberIds() != null) {

            for (Long memberId : request.getMemberIds()) {

                if (memberId.equals(currentUser.getId())) {
                    continue;
                }

                User user =
                        userRepository.findById(memberId)
                                .orElseThrow(() ->
                                        new RuntimeException(
                                                "User not found"
                                        )
                                );

                GroupMember member = new GroupMember();

                member.setChatGroup(savedGroup);
                member.setUser(user);
                member.setLastReadAt(LocalDateTime.now());

                groupMemberRepository.save(member);
            }
        }

        List<MemberDto> members =
                groupMemberRepository
                        .findByChatGroup_Id(savedGroup.getId())
                        .stream()
                        .map(m -> new MemberDto(
                                m.getUser().getId(),
                                m.getUser().getUsername(),
                                m.getUser().getEmail()
                        ))
                        .collect(Collectors.toList());

        return new GroupResponse(
                savedGroup.getId(),
                savedGroup.getName(),
                currentUser.getId(),
                currentUser.getUsername(),
                "",
                null,
                "",
                members.size(),
                0,
                members
        );
    }

    // =====================================================
    // GET MY GROUPS
    // =====================================================

    @Transactional(readOnly = true)
    public List<GroupResponse>
    getMyGroups() {

        User currentUser = getCurrentUser();

        List<ChatGroup> groups =
                chatGroupRepository
                        .findMyGroups(currentUser.getId());

        return groups.stream()
                .map(group -> {

                    GroupMessage lastMessage =
                            groupMessageRepository
                                    .findTopByChatGroupOrderBySentAtDesc(
                                            group
                                    );

                    List<MemberDto> members =
                            groupMemberRepository
                                    .findByChatGroup_Id(
                                            group.getId()
                                    )
                                    .stream()
                                    .map(m -> new MemberDto(
                                            m.getUser().getId(),
                                            m.getUser().getUsername(),
                                            m.getUser().getEmail()
                                    ))
                                    .collect(Collectors.toList());

                    int unreadCount =
                            calculateUnreadGroupMessages(
                                    group,
                                    currentUser
                            );

                    return new GroupResponse(
                            group.getId(),
                            group.getName(),
                            group.getCreatedBy().getId(),
                            group.getCreatedBy().getUsername(),

                            lastMessage != null
                                    ? lastMessage.getContent()
                                    : "",

                            lastMessage != null
                                    ? lastMessage.getSentAt()
                                    : null,

                            lastMessage != null
                                    ? lastMessage.getSender()
                                      .getUsername()
                                    : "",

                            members.size(),
                            unreadCount,
                            members
                    );
                })
                .collect(Collectors.toList());
    }

    // =====================================================
    // GET ALL GROUPS (li mach fihom el user)
    // =====================================================

    @Transactional(readOnly = true)
    public List<GroupResponse> getAllGroups() {

        User currentUser = getCurrentUser();

        List<ChatGroup> allGroups =
                chatGroupRepository.findAll();

        List<Long> myGroupIds =
                groupMemberRepository
                        .findAll()
                        .stream()
                        .filter(m ->
                                m.getUser()
                                        .getId()
                                        .equals(currentUser.getId())
                        )
                        .map(m ->
                                m.getChatGroup().getId()
                        )
                        .collect(Collectors.toList());

        return allGroups.stream()
                .filter(group ->
                        !myGroupIds.contains(group.getId())
                )
                .map(group -> {

                    List<MemberDto> members =
                            groupMemberRepository
                                    .findByChatGroup_Id(
                                            group.getId()
                                    )
                                    .stream()
                                    .map(m -> new MemberDto(
                                            m.getUser().getId(),
                                            m.getUser().getUsername(),
                                            m.getUser().getEmail()
                                    ))
                                    .collect(Collectors.toList());

                    return new GroupResponse(
                            group.getId(),
                            group.getName(),
                            group.getCreatedBy().getId(),
                            group.getCreatedBy().getUsername(),
                            "",
                            null,
                            "",
                            members.size(),
                            0,
                            members
                    );
                })
                .collect(Collectors.toList());
    }

    // =====================================================
    // GROUP CONVERSATION
    // =====================================================

    @Transactional(readOnly = true)
    public List<GroupMessageResponse>
    getGroupConversation(Long groupId) {

        ChatGroup group =
                chatGroupRepository.findById(groupId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Group not found"
                                )
                        );

        return groupMessageRepository
                .findByChatGroupOrderBySentAtAsc(group)
                .stream()
                .map(message ->
                        new GroupMessageResponse(
                                message.getId(),
                                group.getId(),
                                message.getSender().getId(),
                                message.getSender().getUsername(),
                                message.getContent(),
                                message.getSentAt()
                        )
                )
                .collect(Collectors.toList());
    }

    // =====================================================
    // SEND GROUP MESSAGE
    // =====================================================

    public GroupMessageResponse
    sendGroupMessage(
            Long groupId,
            GroupMessageRequest request
    ) {

        User currentUser = getCurrentUser();

        ChatGroup group =
                chatGroupRepository.findById(groupId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Group not found"
                                )
                        );

        GroupMessage message = new GroupMessage();

        message.setChatGroup(group);
        message.setSender(currentUser);
        message.setContent(request.getContent());

        GroupMessage saved =
                groupMessageRepository.save(message);

        return new GroupMessageResponse(
                saved.getId(),
                group.getId(),
                currentUser.getId(),
                currentUser.getUsername(),
                saved.getContent(),
                saved.getSentAt()
        );
    }

    // =====================================================
    // MARK GROUP AS READ
    // =====================================================

    public void markGroupAsRead(Long groupId) {

        User currentUser = getCurrentUser();

        GroupMember member =
                groupMemberRepository
                        .findByChatGroup_IdAndUser_Id(
                                groupId,
                                currentUser.getId()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Not member"
                                )
                        );

        member.setLastReadAt(LocalDateTime.now());

        groupMemberRepository.save(member);
    }

    // =====================================================
    // LEAVE GROUP
    // =====================================================

    public Map<String, String> leaveGroup(Long groupId) {

        User currentUser = getCurrentUser();

        ChatGroup group =
                chatGroupRepository.findById(groupId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Group not found"
                                )
                        );

        GroupMember member =
                groupMemberRepository
                        .findByChatGroup_IdAndUser_Id(
                                groupId,
                                currentUser.getId()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "You are not a member"
                                )
                        );

        if (group.getCreatedBy()
                .getId()
                .equals(currentUser.getId())) {

            throw new RuntimeException(
                    "Admin cannot leave. Delete the group instead."
            );
        }

        groupMemberRepository.delete(member);

        return Map.of(
                "status", "success",
                "message", "You have left the group"
        );
    }

    // =====================================================
    // REJOIN GROUP
    // =====================================================

    public Map<String, String> rejoinGroup(Long groupId) {

        User currentUser = getCurrentUser();

        ChatGroup group =
                chatGroupRepository.findById(groupId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Group not found"
                                )
                        );

        boolean alreadyMember =
                groupMemberRepository
                        .existsByChatGroup_IdAndUser_Id(
                                groupId,
                                currentUser.getId()
                        );

        if (alreadyMember) {
            throw new RuntimeException(
                    "You are already a member"
            );
        }

        GroupMember member = new GroupMember();

        member.setChatGroup(group);
        member.setUser(currentUser);
        member.setLastReadAt(LocalDateTime.now());

        groupMemberRepository.save(member);

        return Map.of(
                "status", "success",
                "message", "You have joined the group"
        );
    }

    // =====================================================
    // CALCULATE GROUP UNREAD
    // =====================================================

    private int calculateUnreadGroupMessages(
            ChatGroup group,
            User currentUser
    ) {

        Optional<GroupMember> optionalMember =
                groupMemberRepository
                        .findByChatGroup_IdAndUser_Id(
                                group.getId(),
                                currentUser.getId()
                        );

        if (optionalMember.isEmpty()) {
            return 0;
        }

        GroupMember member = optionalMember.get();

        if (member.getLastReadAt() == null) {

            return (int)
                    groupMessageRepository
                            .findByChatGroupOrderBySentAtAsc(group)
                            .stream()
                            .filter(m ->
                                    !m.getSender()
                                            .getId()
                                            .equals(currentUser.getId())
                            )
                            .count();
        }

        return (int)
                groupMessageRepository
                        .findByChatGroupAndSentAtAfter(
                                group,
                                member.getLastReadAt()
                        )
                        .stream()
                        .filter(m ->
                                !m.getSender()
                                        .getId()
                                        .equals(currentUser.getId())
                        )
                        .count();
    }

    // =====================================================
    // CURRENT USER
    // =====================================================

    private User getCurrentUser() {

        Object principal =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication()
                        .getPrincipal();

        if (principal instanceof User) {
            return (User) principal;
        }

        throw new RuntimeException(
                "Authenticated user not found"
        );
    }
}