package com.example.demo.eventmate.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "payments")
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "booking_id")
    private Long bookingId;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "payment_method")
    private String paymentMethod;

    @Column(name = "amount")
    private double amount;

    @Column(name = "transaction_id")
    private String transactionId;

    @Column(name = "payment_status")
    private String paymentStatus;

    @Column(name = "payment_date")
    private LocalDate paymentDate;

    // Getters & Setters
    public Long getBookingId() { return bookingId; }
    public void setBookingId(Long bookingId) { this.bookingId = bookingId; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public void setAmount(double amount) { this.amount = amount; }
    public void setTransactionId(String transactionId) { this.transactionId = transactionId; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
    public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }
    public void setPaymentDate(LocalDate paymentDate) { this.paymentDate = paymentDate; }
}