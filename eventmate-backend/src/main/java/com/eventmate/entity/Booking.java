package com.eventmate.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "bookings")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer seatsBooked;
    private Double totalAmount;
    private LocalDateTime bookingDate;
    private String userName;       
    private String paymentMode;    
    private String paymentStatus;   
    private String bookingStatus;   

    @ManyToOne
    @JoinColumn(name = "event_id")
    private Event event;

    public Long getEventId() {
        return event != null ? event.getId() : null;
    }
}
