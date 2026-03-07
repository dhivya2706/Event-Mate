package com.example.demo.eventmate.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "events")
public class Event {

    @Id
    private String eventId;

    private String title;
    private String venue;
    private LocalDateTime eventDate;
    private int capacity;
    private double price;

    // Organizer ID
    private Long organizerId;

    // ✅ NEW: Event approval status
    private String status = "PENDING";

    @Lob
    @Column(columnDefinition = "LONGBLOB")
    private byte[] image;

    // ===== Getters & Setters =====

    public String getEventId() { return eventId; }
    public void setEventId(String eventId) { this.eventId = eventId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getVenue() { return venue; }
    public void setVenue(String venue) { this.venue = venue; }

    public LocalDateTime getEventDate() { return eventDate; }
    public void setEventDate(LocalDateTime eventDate) { this.eventDate = eventDate; }

    public int getCapacity() { return capacity; }
    public void setCapacity(int capacity) { this.capacity = capacity; }

    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }

    public Long getOrganizerId() { return organizerId; }
    public void setOrganizerId(Long organizerId) { this.organizerId = organizerId; }

    public byte[] getImage() { return image; }
    public void setImage(byte[] image) { this.image = image; }

    // ===== STATUS =====

    public String getStatus() { return status; }

    public void setStatus(String status) { this.status = status; }

}