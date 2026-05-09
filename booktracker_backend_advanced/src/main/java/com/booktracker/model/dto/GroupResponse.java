package com.booktracker.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GroupResponse {

    private Long id;
    private String name;

    private Long createdById;
    private String createdByName;

    private String lastMessage;
    private LocalDateTime lastMessageDate;
    private String lastSenderName;

    private int membersCount;
    private int unreadCount;

    private List<MemberDto> members;
}