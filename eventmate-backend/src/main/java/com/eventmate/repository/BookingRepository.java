package com.eventmate.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.eventmate.entity.Booking;

public interface BookingRepository extends JpaRepository<Booking, Long> {

     List<Booking> findByEvent_Id(Long eventId);

    @Query("""
        SELECT b FROM Booking b
        WHERE b.event.organizer.email = :email
        """)
    List<Booking> findBookingsByOrganizerEmail(@Param("email") String email);

    @Query("SELECT b FROM Booking b WHERE b.event.organizer.id = :organizerId")
    List<Booking> findBookingsByOrganizer(@Param("organizerId") Long organizerId);

    @Query("SELECT COUNT(b) FROM Booking b WHERE b.event.id = :eventId")
    Long countBookingsByEvent(Long eventId);

    @Query("SELECT SUM(b.totalAmount) FROM Booking b WHERE b.event.id = :eventId")
    Double sumRevenueByEvent(Long eventId);

    long count();

    @Query("SELECT SUM(b.totalAmount) FROM Booking b")
    Double sumAllRevenue();

    @Query("SELECT COUNT(b) FROM Booking b WHERE b.bookingStatus = 'Confirmed'")
     Long countConfirmed();

    @Query("SELECT COUNT(b) FROM Booking b WHERE b.bookingStatus = 'PENDING_PAYMENT'")
    Long countPending();

    @Query("SELECT COUNT(b) FROM Booking b WHERE b.bookingStatus = 'Cancelled'")
    Long countCancelled();

    @Query("SELECT COUNT(b) FROM Booking b WHERE b.event.organizer.email = :email")
    Long countByOrganizerEmail(@Param("email") String email);

    @Query("SELECT SUM(b.totalAmount) FROM Booking b WHERE b.event.organizer.email = :email")
    Double sumRevenueByOrganizerEmail(@Param("email") String email);

    @Query("SELECT COUNT(b) FROM Booking b WHERE b.event.organizer.email = :email AND b.bookingStatus = 'Confirmed'")
    Long countConfirmedByOrganizer(@Param("email") String email);

    @Query("SELECT COUNT(b) FROM Booking b WHERE b.event.organizer.email = :email AND b.bookingStatus = 'Pending'")
    Long countPendingByOrganizer(@Param("email") String email);

    @Query("SELECT COUNT(b) FROM Booking b WHERE b.event.organizer.email = :email AND b.bookingStatus = 'Cancelled'")
    Long countCancelledByOrganizer(@Param("email") String email);

}

