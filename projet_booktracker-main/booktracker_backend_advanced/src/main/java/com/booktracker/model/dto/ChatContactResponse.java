package com.booktracker.model.dto;

import java.time.LocalDateTime;

public class ChatContactResponse {

    private Long id;
    private String username;
    private String email;
    private String image;
    private String lastMessage;
    private LocalDateTime lastMessageDate;
    private String lastSenderName;

    public ChatContactResponse() {
    }

    public ChatContactResponse(Long id, String username, String email, String image,
                               String lastMessage, LocalDateTime lastMessageDate, String lastSenderName) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.image = image;
        this.lastMessage = lastMessage;
        this.lastMessageDate = lastMessageDate;
        this.lastSenderName = lastSenderName;
    }

    public Long getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public String getEmail() {
        return email;
    }

    public String getImage() {
        return image;
    }

    public String getLastMessage() {
        return lastMessage;
    }

    public LocalDateTime getLastMessageDate() {
        return lastMessageDate;
    }

    public String getLastSenderName() {
        return lastSenderName;
    }
}