package com.eventmate.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.eventmate.entity.Booking;

public interface BookingRepository extends JpaRepository<Booking, Long> {

     List<Booking> findByEvent_Id(Long eventId);

    @Query("SELECT COUNT(b) FROM Booking b WHERE b.event.id = :eventId")
    Long countBookingsByEvent(Long eventId);

    @Query("SELECT SUM(b.totalAmount) FROM Booking b WHERE b.event.id = :eventId")
    Double sumRevenueByEvent(Long eventId);

    long count();

    @Query("SELECT SUM(b.totalAmount) FROM Booking b")
    Double sumAllRevenue();
}

