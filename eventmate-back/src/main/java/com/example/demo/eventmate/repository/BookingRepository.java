package com.example.demo.eventmate.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.demo.eventmate.model.Booking;

public interface BookingRepository extends JpaRepository<Booking, Long> {
}