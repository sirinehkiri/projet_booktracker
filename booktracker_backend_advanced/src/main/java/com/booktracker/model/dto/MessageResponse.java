package com.booktracker.model.dto;

import java.time.LocalDateTime;

public class MessageResponse {

    private Long id;
    private Long senderId;
    private Long receiverId;
    private String senderName;
    private String content;

    public String getSenderImage() {
        return senderImage;
    }

    public void setSenderImage(String senderImage) {
        this.senderImage = senderImage;
    }

    private LocalDateTime sentAt;
    private boolean isRead;
    private String senderImage;

    public MessageResponse(Long id, Long senderId, Long receiverId, String senderName, String content, LocalDateTime sentAt, boolean isRead, String senderImage) {
        this.id = id;
        this.senderId = senderId;
        this.receiverId = receiverId;
        this.senderName = senderName;
        this.content = content;
        this.sentAt = sentAt;
        this.isRead = isRead;
        this.senderImage = senderImage;
    }

    public MessageResponse() {
    }


    public Long getId() {
        return id;
    }

    public Long getSenderId() {
        return senderId;
    }

    public Long getReceiverId() {
        return receiverId;
    }

    public String getSenderName() {
        return senderName;
    }

    public String getContent() {
        return content;
    }

    public LocalDateTime getSentAt() {
        return sentAt;
    }

    public boolean isRead() {
        return isRead;
    }
}