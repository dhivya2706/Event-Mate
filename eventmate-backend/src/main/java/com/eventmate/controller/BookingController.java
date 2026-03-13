package com.eventmate.controller;

import java.util.HashMap;
import java.util.List;
import com.eventmate.dto.BookingRequest;
import jakarta.validation.Valid;
import com.eventmate.entity.Booking;
import com.eventmate.entity.Event;
import com.eventmate.repository.BookingRepository;
import com.eventmate.repository.EventRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:3000")
public class BookingController {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private EventRepository eventRepository;

    @PostMapping("/create")
    public Booking createBooking(@Valid @RequestBody BookingRequest request) {

        Event event = eventRepository.findById(request.getEventId())
                .orElseThrow(() -> new RuntimeException("Event not found"));

        Booking booking = new Booking();

        booking.setEvent(event);
        booking.setSeatCategory(request.getSeatCategory());
        booking.setSeatsBooked(request.getSeatsBooked());
        booking.setTotalAmount(request.getTotalAmount());
        booking.setUserName(request.getUserName());
        booking.setUserEmail(request.getUserEmail());

        booking.setPaymentMode("ONLINE");
        booking.setPaymentStatus("PENDING");
        booking.setBookingStatus("Pending");
        booking.setBookingDate(java.time.LocalDateTime.now());
        booking.setSeatNumbers(String.join(",", request.getSeatNumbers()));

        return bookingRepository.save(booking);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getBookingById(@PathVariable Long id) {

        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        Map<String, Object> map = new HashMap<>();
        map.put("id", booking.getId());
        map.put("userName", booking.getUserName());
        map.put("eventName", booking.getEvent().getEventName());
        map.put("venue", booking.getEvent().getVenue());
        map.put("seatsBooked", booking.getSeatsBooked());
        map.put("totalAmount", booking.getTotalAmount());
        map.put("bookingDate", booking.getBookingDate());

        return ResponseEntity.ok(map);
    }

    @GetMapping("/organizer")
    public List<Map<String, Object>> getBookingsByOrganizer(@RequestParam String email) {

        return bookingRepository.findByOrganizerEmail(email)
                .stream()
                .map(booking -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", booking.getId());
                    map.put("userName", booking.getUserName());
                    map.put("eventName", booking.getEvent().getEventName());
                    map.put("seatsBooked", booking.getSeatsBooked());
                    map.put("seatCategory", booking.getSeatCategory());
                    map.put("paymentMode", booking.getPaymentMode());
                    map.put("paymentStatus", booking.getPaymentStatus());
                    map.put("bookingStatus", booking.getBookingStatus());
                    map.put("bookingDate", booking.getBookingDate());
                    return map;
                }).toList();
    }

    @GetMapping("/organizer/total")
    public Long getTotalBookings(@RequestParam String email) {
        return bookingRepository.countByOrganizerEmail(email);
    }

    @GetMapping("/organizer/revenue")
    public Double getTotalRevenue(@RequestParam String email) {
        Double revenue = bookingRepository.sumRevenueByOrganizerEmail(email);
        return revenue != null ? revenue : 0.0;
    }

    @GetMapping("/organizer/confirmed")
    public Long getConfirmedCount(@RequestParam String email) {
        return bookingRepository.countConfirmedByOrganizer(email);
    }

    @GetMapping("/organizer/cancelled")
    public Long getCancelledCount(@RequestParam String email) {
        return bookingRepository.countCancelledByOrganizer(email);
    }

    @GetMapping("/organizer/pending")
    public Long getPendingCount(@RequestParam String email) {
        return bookingRepository.countPendingByOrganizer(email);
    }

    @GetMapping("/event/{eventId}")
    public List<Booking> getBookingsByEvent(@PathVariable Long eventId) {
        return bookingRepository.findByEvent_Id(eventId);
    }

    @GetMapping("/completed")
    public ResponseEntity<List<Booking>> getCompletedBookings(
            @RequestParam String email) {

        List<Booking> completed = bookingRepository
                .findByUserEmailAndBookingStatusAndPaymentStatus(
                        email,
                        "CONFIRMED",
                        "PAID"
                );

        System.out.println("Completed bookings size: " + completed.size());

        return ResponseEntity.ok(completed);
    }
}
