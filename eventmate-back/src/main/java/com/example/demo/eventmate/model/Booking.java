package com.example.demo.eventmate.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "event_id")
    @JsonProperty("eventId")
    private String eventId;

    @Column(name = "seats_booked")
    @JsonProperty("seatsBooked")
    private int seatsBooked;

    @Column(name = "total_amount")
    @JsonProperty("totalAmount")
    private double totalAmount;

    @Column(name = "booking_date")
    @JsonProperty("bookingDate")
    private LocalDateTime bookingDate;

    // 🔥 ADD ALL GETTERS & SETTERS

    public Long getId() {
        return id;
    }

    public String getEventId() {
        return eventId;
    }

    public int getSeatsBooked() {
        return seatsBooked;
    }

    public double getTotalAmount() {
        return totalAmount;
    }

    public LocalDateTime getBookingDate() {
        return bookingDate;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setEventId(String eventId) {
        this.eventId = eventId;
    }

    public void setSeatsBooked(int seatsBooked) {
        this.seatsBooked = seatsBooked;
    }

    public void setTotalAmount(double totalAmount) {
        this.totalAmount = totalAmount;
    }

    public void setBookingDate(LocalDateTime bookingDate) {
        this.bookingDate = bookingDate;
    }
}