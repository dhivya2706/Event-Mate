package com.eventmate.repository;

import org.springframework.data.repository.CrudRepository;

import com.eventmate.entity.Payment;

public interface PaymentRepository extends CrudRepository<Payment, Long> {
}