package com.example.demo.eventmate.controller;

import com.example.demo.eventmate.model.*;
import com.example.demo.eventmate.repository.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/organizer")
@CrossOrigin(origins = "http://localhost:3000")
public class OrganizerController {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FeedbackRepository feedbackRepository;

    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    // ================= GET BOOKINGS BY ORGANIZER =================
    @GetMapping("/bookings")
    public List<Booking> getBookingsByOrganizer(@RequestParam(required = false) Long organizerId) {

        if (organizerId != null) {

            List<String> eventIds = eventRepository.findByOrganizerId(organizerId)
                    .stream()
                    .map(Event::getEventId)
                    .collect(Collectors.toList());

            return bookingRepository.findAll()
                    .stream()
                    .filter(b -> eventIds.contains(b.getEventId()))
                    .collect(Collectors.toList());
        }

        return bookingRepository.findAll();
    }

    // ================= CONFIRM BOOKING =================
    @PutMapping("/booking/confirm/{id}")
    public ResponseEntity<?> confirmBooking(@PathVariable Long id) {

        Booking booking = bookingRepository.findById(id).orElse(null);

        if (booking == null) {
            return ResponseEntity.notFound().build();
        }

        booking.setBookingStatus("Confirmed");

        bookingRepository.save(booking);

        return ResponseEntity.ok("Booking confirmed");
    }

    // ================= CANCEL BOOKING =================
    @PutMapping("/booking/cancel/{id}")
    public ResponseEntity<?> cancelBooking(@PathVariable Long id) {

        Booking booking = bookingRepository.findById(id).orElse(null);

        if (booking == null) {
            return ResponseEntity.notFound().build();
        }

        booking.setBookingStatus("Cancelled");

        bookingRepository.save(booking);

        return ResponseEntity.ok("Booking cancelled");
    }

    // ================= CONFIRM PAYMENT =================
    @PutMapping("/payment/confirm/{id}")
    public ResponseEntity<?> confirmPayment(@PathVariable Long id) {

        Booking booking = bookingRepository.findById(id).orElse(null);

        if (booking == null) {
            return ResponseEntity.notFound().build();
        }

        booking.setPaymentStatus("Confirmed");

        bookingRepository.save(booking);

        return ResponseEntity.ok("Payment confirmed");
    }

    // ================= GET FEEDBACK BY ORGANIZER =================
    @GetMapping("/feedback")
    public List<Feedback> getFeedbackByOrganizer(@RequestParam(required = false) Long organizerId) {

        if (organizerId != null) {

            List<String> eventIds = eventRepository.findByOrganizerId(organizerId)
                    .stream()
                    .map(Event::getEventId)
                    .collect(Collectors.toList());

            return feedbackRepository.findAll()
                    .stream()
                    .filter(f -> eventIds.contains(f.getEventId()))
                    .collect(Collectors.toList());
        }

        return feedbackRepository.findAll();
    }

    // ================= UPDATE ORGANIZER PROFILE =================
    @PutMapping("/profile/{id}")
    public ResponseEntity<?> updateProfile(
            @PathVariable Long id,
            @RequestBody Map<String, String> body
    ) {

        User user = userRepository.findById(id).orElse(null);

        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        if (body.containsKey("name") && !body.get("name").isBlank()) {
            user.setName(body.get("name"));
        }

        if (body.containsKey("email") && !body.get("email").isBlank()) {
            user.setEmail(body.get("email"));
        }

        if (body.containsKey("password") && !body.get("password").isBlank()) {
            user.setPassword(passwordEncoder.encode(body.get("password")));
        }

        userRepository.save(user);

        return ResponseEntity.ok("Profile updated successfully");
    }

    // ================= ADD EVENT =================
    @PostMapping("/add-event")
    public ResponseEntity<?> addEvent(
            @RequestParam String title,
            @RequestParam String venue,
            @RequestParam String event_date,
            @RequestParam int capacity,
            @RequestParam double price,
            @RequestParam Long organizerId,
            @RequestParam MultipartFile image
    ) throws IOException {

        Event event = new Event();

        event.setEventId(UUID.randomUUID().toString());
        event.setTitle(title);
        event.setVenue(venue);
        event.setEventDate(LocalDateTime.parse(event_date + "T00:00:00"));
        event.setCapacity(capacity);
        event.setPrice(price);
        event.setOrganizerId(organizerId);

        // waiting for admin approval
        event.setStatus("PENDING");

        event.setImage(image.getBytes());

        eventRepository.save(event);

        return ResponseEntity.ok("Event added successfully. Waiting for admin approval.");
    }

    // ================= GET EVENTS BY ORGANIZER =================
    @GetMapping("/events")
    public List<Event> getEventsByOrganizer(@RequestParam(required = false) Long organizerId) {

        if (organizerId != null) {
            return eventRepository.findByOrganizerId(organizerId);
        }

        return eventRepository.findAll();
    }

    // ================= GET EVENT IMAGE =================
    @GetMapping("/event-image/{id}")
    public ResponseEntity<byte[]> getEventImage(@PathVariable String id) {

        Event event = eventRepository.findById(id).orElse(null);

        if (event == null || event.getImage() == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"event.jpg\"")
                .contentType(MediaType.IMAGE_JPEG)
                .body(event.getImage());
    }

    // ================= DELETE EVENT =================
    @DeleteMapping("/events/{id}")
    public ResponseEntity<?> deleteEvent(@PathVariable String id) {

        Event event = eventRepository.findById(id).orElse(null);

        if (event == null) {
            return ResponseEntity.notFound().build();
        }

        eventRepository.delete(event);

        return ResponseEntity.ok("Event deleted successfully");
    }

    // ================= UPDATE EVENT =================
    @PutMapping("/events/{id}")
    public ResponseEntity<?> updateEvent(
            @PathVariable String id,
            @RequestParam String title,
            @RequestParam String venue,
            @RequestParam String event_date,
            @RequestParam int capacity,
            @RequestParam double price,
            @RequestParam(required = false) MultipartFile image
    ) throws IOException {

        Event event = eventRepository.findById(id).orElse(null);

        if (event == null) {
            return ResponseEntity.notFound().build();
        }

        event.setTitle(title);
        event.setVenue(venue);
        event.setEventDate(LocalDateTime.parse(event_date + "T00:00:00"));
        event.setCapacity(capacity);
        event.setPrice(price);

        // again waiting admin approval
        event.setStatus("PENDING");

        if (image != null && !image.isEmpty()) {
            event.setImage(image.getBytes());
        }

        eventRepository.save(event);

        return ResponseEntity.ok("Event updated. Waiting for admin approval.");
    }
}