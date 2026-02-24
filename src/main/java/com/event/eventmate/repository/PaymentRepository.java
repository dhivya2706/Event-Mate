package com.event.eventmate.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.event.eventmate.model.Payment;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
}