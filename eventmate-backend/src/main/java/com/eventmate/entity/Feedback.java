package com.eventmate.entity;
import jakarta.persistence.*;
import java.time.LocalDateTime;
@Entity
@Table(name = "feedback",
       uniqueConstraints = @UniqueConstraint(columnNames = {"event_id", "user_email"}))
public class Feedback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    private String userEmail;

    private int rating;

    @Column(columnDefinition = "TEXT")
    private String description;

    private LocalDateTime createdAt = LocalDateTime.now();

    public Long getId() { return id; }
    public Event getEvent() { return event; }
    public String getUserEmail() { return userEmail; }
    public int getRating() { return rating; }
    public String getDescription() { return description; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }
    public void setRating(int rating) { this.rating = rating; }
    public void setDescription(String description) { this.description = description; }
    public void setEvent(Event event) { this.event = event; }
}