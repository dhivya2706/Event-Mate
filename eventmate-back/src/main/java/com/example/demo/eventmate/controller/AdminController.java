package com.example.demo.eventmate.controller;

import com.example.demo.eventmate.model.*;
import com.example.demo.eventmate.repository.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminController {

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private FeedbackRepository feedbackRepository;

    @Autowired
    private UserRepository userRepository;

    // ================= PROFILE =================
    @GetMapping("/profile")
    public ResponseEntity<?> getAdminProfile(@RequestParam String email) {

        Optional<User> opt = userRepository.findByEmail(email);

        if (opt.isEmpty()) {
            return ResponseEntity.badRequest().body("Admin not found");
        }

        User admin = opt.get();

        if (admin.getRole() != Role.ADMIN) {
            return ResponseEntity.status(403).body("Access denied");
        }

        return ResponseEntity.ok(Map.of(
                "name", admin.getName(),
                "email", admin.getEmail()
        ));
    }

    // ================= USERS BY ROLE =================
    @GetMapping("/users")
    public ResponseEntity<?> getUsers(@RequestParam String role) {

        List<User> users = userRepository.findAll()
                .stream()
                .filter(u -> u.getRole().name().equalsIgnoreCase(role))
                .toList();

        return ResponseEntity.ok(users);
    }

    // ================= DELETE USER =================
    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {

        if (!userRepository.existsById(id)) {
            return ResponseEntity.badRequest().body("User not found");
        }

        userRepository.deleteById(id);
        return ResponseEntity.ok("Deleted successfully");
    }

    // ================= STATS =================
    @GetMapping("/stats")
    public ResponseEntity<?> getStats() {

        long users = userRepository.findAll()
                .stream()
                .filter(u -> u.getRole() == Role.USER)
                .count();

        long organisers = userRepository.findAll()
                .stream()
                .filter(u -> u.getRole() == Role.ORGANISER)
                .count();

        long admins = userRepository.findAll()
                .stream()
                .filter(u -> u.getRole() == Role.ADMIN)
                .count();

        return ResponseEntity.ok(Map.of(
                "users", users,
                "organisers", organisers,
                "admins", admins
        ));
    }

    // ================= EVENTS =================
    @GetMapping("/events")
    public ResponseEntity<List<Event>> getAllEvents() {
        return ResponseEntity.ok(eventRepository.findAll());
    }

    // ================= BOOKINGS =================
    @GetMapping("/bookings")
    public ResponseEntity<List<Booking>> getAllBookings() {
        return ResponseEntity.ok(bookingRepository.findAll());
    }

    // ================= FEEDBACK =================
    @GetMapping("/feedback")
    public ResponseEntity<List<Feedback>> getAllFeedback() {
        return ResponseEntity.ok(feedbackRepository.findAll());
    }
}