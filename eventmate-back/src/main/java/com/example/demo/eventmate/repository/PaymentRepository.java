package com.example.demo.eventmate.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.demo.eventmate.model.Payment;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

    Payment findByBookingId(Long bookingId); // ✅ ADD THIS

}