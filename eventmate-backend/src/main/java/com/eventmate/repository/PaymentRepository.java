package com.eventmate.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.eventmate.entity.Payment;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

    Optional<Payment> findByOrderId(String orderId);

    Optional<Payment> findByPaymentId(String paymentId);

    Long countByPaymentStatusIgnoreCase(String paymentStatus);

    List<Payment> findByPaymentStatusIgnoreCase(String paymentStatus);
}