package com.eventmate.dto;

public class ReminderDTO {

    private Long bookingId;
    private String userName;
    private String userEmail;
    private String eventName;
    private String eventDate;

    public ReminderDTO(Long bookingId, String userName, String userEmail, String eventName, String eventDate) {
        this.bookingId = bookingId;
        this.userName = userName;
        this.userEmail = userEmail;
        this.eventName = eventName;
        this.eventDate = eventDate;
    }

    public Long getBookingId() {
        return bookingId;
    }

    public String getUserName() {
        return userName;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public String getEventName() {
        return eventName;
    }

    public String getEventDate() {
        return eventDate;
    }
}