package com.eventmate.entity;

import java.util.List;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "events")
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "event_name")
    private String eventName;

    @Column(name = "vip_seats")
    private Integer vipSeats;

    @Column(name = "vip_price")
    private Double vipPrice;

    @Column(name = "premium_seats")
    private Integer premiumSeats;

    @Column(name = "premium_price")
    private Double premiumPrice;

    @Column(name = "regular_seats")
    private Integer regularSeats;

    @Column(name = "regular_price")
    private Double regularPrice;

    @Column(name = "event_date")
    private String eventDate;

    @Column(name = "venue")
    private String venue;

    @Column(name = "image_name")
    private String imageName;

    @ManyToOne
    @JoinColumn(name = "organizer_id")
    private Organizer organizer;

    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Booking> bookings;

    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<com.eventmate.entity.Feedback> feedbacks;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEventName() {
        return eventName;
    }

    public void setEventName(String eventName) {
        this.eventName = eventName;
    }

    public Integer getVipSeats() {
        return vipSeats;
    }

    public void setVipSeats(Integer vipSeats) {
        this.vipSeats = vipSeats;
    }

    public Double getVipPrice() {
        return vipPrice;
    }

    public void setVipPrice(Double vipPrice) {
        this.vipPrice = vipPrice;
    }

    public Integer getPremiumSeats() {
        return premiumSeats;
    }

    public void setPremiumSeats(Integer premiumSeats) {
        this.premiumSeats = premiumSeats;
    }

    public Double getPremiumPrice() {
        return premiumPrice;
    }

    public void setPremiumPrice(Double premiumPrice) {
        this.premiumPrice = premiumPrice;
    }

    public Integer getRegularSeats() {
        return regularSeats;
    }

    public void setRegularSeats(Integer regularSeats) {
        this.regularSeats = regularSeats;
    }

    public Double getRegularPrice() {
        return regularPrice;
    }

    public void setRegularPrice(Double regularPrice) {
        this.regularPrice = regularPrice;
    }

    public Organizer getOrganizer() {
        return organizer;
    }

    public void setOrganizer(Organizer organizer) {
        this.organizer = organizer;
    }

    public String getEventDate() {
        return eventDate;
    }

    public void setEventDate(String eventDate) {
        this.eventDate = eventDate;
    }

    public String getVenue() {
        return venue;
    }

    public void setVenue(String venue) {
        this.venue = venue;
    }

    public String getImageName() {
        return imageName;
    }

    public void setImageName(String imageName) {
        this.imageName = imageName;
    }
}
