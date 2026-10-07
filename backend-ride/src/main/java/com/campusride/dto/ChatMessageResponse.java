package com.campusride.dto;

import java.time.LocalDateTime;

public class ChatMessageResponse {

    private Long id;
    private Long rideId;
    private Long senderId;
    private String senderName;
    private String message;
    private LocalDateTime sentAt;

    public ChatMessageResponse() {
    }

    public ChatMessageResponse(
            Long id,
            Long rideId,
            Long senderId,
            String senderName,
            String message,
            LocalDateTime sentAt) {

        this.id = id;
        this.rideId = rideId;
        this.senderId = senderId;
        this.senderName = senderName;
        this.message = message;
        this.sentAt = sentAt;
    }

    public Long getId() {
        return id;
    }

    public Long getRideId() {
        return rideId;
    }

    public Long getSenderId() {
        return senderId;
    }

    public String getSenderName() {
        return senderName;
    }

    public String getMessage() {
        return message;
    }

    public LocalDateTime getSentAt() {
        return sentAt;
    }
}
