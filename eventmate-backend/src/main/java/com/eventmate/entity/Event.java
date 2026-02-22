package com.eventmate.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "events")
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "event_name")
    private String eventName;

    @Column(name = "ticket_price")
    private Double ticketPrice;

    @Column(name = "total_seats")
    private Integer totalSeats;

    @Column(name = "event_date")
    private String eventDate;

    @Column(name = "venue")
    private String venue;

    @Column(name = "image_name")
    private String imageName;
    
    @ManyToOne
    @JoinColumn(name = "organizer_id")
    private Organizer organizer;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getEventName() { return eventName; }
    public void setEventName(String eventName) { this.eventName = eventName; }

    public Double getTicketPrice() { return ticketPrice; }
    public void setTicketPrice(Double ticketPrice) { this.ticketPrice = ticketPrice; }

    public Integer getTotalSeats() { return totalSeats; }
    public void setTotalSeats(Integer totalSeats) { this.totalSeats = totalSeats; }

    public Organizer getOrganizer() { return organizer; }
    public void setOrganizer(Organizer organizer) { this.organizer = organizer; }

    public String getEventDate() { return eventDate; }
public void setEventDate(String eventDate) { this.eventDate = eventDate; }

public String getVenue() { return venue; }
public void setVenue(String venue) { this.venue = venue; }

public String getImageName() { return imageName; }
public void setImageName(String imageName) { this.imageName = imageName; }
}