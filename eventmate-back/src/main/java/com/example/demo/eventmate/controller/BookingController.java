package com.example.demo.eventmate.controller;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.eventmate.model.Booking;
import com.example.demo.eventmate.repository.BookingRepository;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:3000")
public class BookingController {

    @Autowired
    private BookingRepository bookingRepository;

    // ================= GET ALL BOOKINGS =================
    @GetMapping
    public ResponseEntity<List<Booking>> getAllBookings() {
        return ResponseEntity.ok(bookingRepository.findAll());
    }

    // ================= GET BOOKINGS BY USER =================
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Booking>> getBookingsByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(bookingRepository.findByUserId(userId));
    }

    // ================= GET BOOKING BY ID =================
    @GetMapping("/{id}")
    public ResponseEntity<?> getBookingById(@PathVariable Long id) {

        return bookingRepository.findById(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElse(ResponseEntity.badRequest()
                        .body("Booking not found"));
    }

    // ================= CREATE BOOKING =================
    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody Booking booking) {

        if (booking.getUserId() == null || booking.getEventId() == null) {
            return ResponseEntity.badRequest()
                    .body("UserId and EventId are required");
        }

        booking.setBookingDate(LocalDateTime.now());

        // Initial status
        booking.setBookingStatus("Pending");
        booking.setPaymentStatus("Pending");

        Booking savedBooking = bookingRepository.save(booking);

        return ResponseEntity.ok(savedBooking);
    }

    // ================= CONFIRM BOOKING =================
    @PutMapping("/confirm/{id}")
    public ResponseEntity<?> confirmBooking(@PathVariable Long id) {

        return bookingRepository.findById(id)
                .<ResponseEntity<?>>map(booking -> {

                    if ("Cancelled".equals(booking.getBookingStatus())) {
                        return ResponseEntity.badRequest()
                                .body("Cannot confirm cancelled booking");
                    }

                    booking.setBookingStatus("Confirmed");

                    bookingRepository.save(booking);

                    return ResponseEntity.ok("Booking Confirmed Successfully");
                })
                .orElse(ResponseEntity.badRequest()
                        .body("Booking not found"));
    }

    // ================= DECLINE BOOKING =================
    @PutMapping("/decline/{id}")
    public ResponseEntity<?> cancelBooking(@PathVariable Long id) {

        return bookingRepository.findById(id)
                .<ResponseEntity<?>>map(booking -> {

                    booking.setBookingStatus("Cancelled");

                    bookingRepository.save(booking);

                    return ResponseEntity.ok("Booking Cancelled Successfully");
                })
                .orElse(ResponseEntity.badRequest()
                        .body("Booking not found"));
    }

    // ================= DELETE BOOKING =================
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBooking(@PathVariable Long id) {

        if (!bookingRepository.existsById(id)) {
            return ResponseEntity.badRequest()
                    .body("Booking not found");
        }

        bookingRepository.deleteById(id);

        return ResponseEntity.ok("Booking Deleted Successfully");
    }
}