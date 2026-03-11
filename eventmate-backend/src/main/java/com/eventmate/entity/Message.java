package com.eventmate.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
@Entity
@Table(name="messages")
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "TEXT")

    private Long senderId;
    private Long receiverId;

    private String senderRole;
    private String receiverRole;

    private String message;

    private boolean isDeleted = false;

    private LocalDateTime createdAt = LocalDateTime.now();
public Long getSenderId() {
    return senderId;
}

public Long getReceiverId() {
    return receiverId;
}

public String getMessage() {
    return message;
}
}