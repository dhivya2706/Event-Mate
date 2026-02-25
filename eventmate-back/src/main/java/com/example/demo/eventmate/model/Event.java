package com.example.demo.eventmate.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "events")
public class Event {

    @Id
    @Column(name = "event_id")
    private String eventId;

    private String title;
    private String venue;

    @Column(name = "event_date")
    private LocalDateTime eventDate;

    private int capacity;
    private double price;

    // ---------------- GETTERS ----------------

    public String getEventId() {
        return eventId;
    }

    public String getTitle() {
        return title;
    }

    public String getVenue() {
        return venue;
    }

    public LocalDateTime getEventDate() {
        return eventDate;
    }

    public int getCapacity() {
        return capacity;
    }

    public double getPrice() {
        return price;
    }

    // ---------------- SETTERS ----------------

    public void setEventId(String eventId) {
        this.eventId = eventId;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setVenue(String venue) {
        this.venue = venue;
    }

    public void setEventDate(LocalDateTime eventDate) {
        this.eventDate = eventDate;
    }

    public void setCapacity(int capacity) {
        this.capacity = capacity;
    }

    public void setPrice(double price) {
        this.price = price;
    }
}