package com.example.demo.eventmate.controller;

import com.example.demo.eventmate.model.*;
import com.example.demo.eventmate.repository.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.sql.Timestamp;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminController {

    @Autowired private EventRepository    eventRepository;
    @Autowired private BookingRepository  bookingRepository;
    @Autowired private FeedbackRepository feedbackRepository;
    @Autowired private UserRepository     userRepository;

    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    // ================= ADMIN PROFILE =================
    @GetMapping("/profile")
    public ResponseEntity<?> getAdminProfile(@RequestParam String email) {
        Optional<User> opt = userRepository.findByEmail(email);
        if (opt.isEmpty()) return ResponseEntity.badRequest().body("Admin not found");
        User admin = opt.get();
        if (admin.getRole() != Role.ADMIN) return ResponseEntity.status(403).body("Access denied");
        return ResponseEntity.ok(Map.of(
            "id",    admin.getId(),
            "name",  admin.getName(),
            "email", admin.getEmail()
        ));
    }

    // ================= UPDATE PROFILE =================
    @PutMapping("/profile/{id}")
    public ResponseEntity<?> updateAdminProfile(@PathVariable Long id, @RequestBody Map<String, String> body) {
        Optional<User> opt = userRepository.findById(id);
        if (opt.isEmpty()) return ResponseEntity.badRequest().body("Admin not found");
        User admin = opt.get();
        if (admin.getRole() != Role.ADMIN) return ResponseEntity.status(403).body("Access denied");
        if (body.containsKey("name")     && !body.get("name").isBlank())     admin.setName(body.get("name"));
        if (body.containsKey("email")    && !body.get("email").isBlank())    admin.setEmail(body.get("email"));
        if (body.containsKey("password") && !body.get("password").isBlank()) admin.setPassword(passwordEncoder.encode(body.get("password")));
        userRepository.save(admin);
        return ResponseEntity.ok("Profile updated successfully");
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
        if (!userRepository.existsById(id)) return ResponseEntity.badRequest().body("User not found");
        userRepository.deleteById(id);
        return ResponseEntity.ok("Deleted successfully");
    }

    // ✅ ================= GET INACTIVE USERS (10+ days no login) =================
    @GetMapping("/users/inactive")
    public ResponseEntity<?> getInactiveUsers(@RequestParam String role) {

        // cutoff = 10 days ago
        long cutoffMillis = System.currentTimeMillis() - (10L * 24 * 60 * 60 * 1000);
        Timestamp cutoff  = new Timestamp(cutoffMillis);

        List<Map<String, Object>> inactive = userRepository.findAll()
            .stream()
            .filter(u -> u.getRole().name().equalsIgnoreCase(role))
            .filter(u -> u.getLastLogin() == null || u.getLastLogin().before(cutoff))
            .map(u -> {
                Map<String, Object> map = new LinkedHashMap<>();
                map.put("id",        u.getId());
                map.put("name",      u.getName());
                map.put("email",     u.getEmail());
                map.put("role",      u.getRole().name());
                map.put("lastLogin", u.getLastLogin() != null ? u.getLastLogin().toString() : null);
                map.put("createdAt", u.getCreatedAt() != null ? u.getCreatedAt().toString() : null);

                // Days since last login
                long daysSince = u.getLastLogin() == null
                    ? -1
                    : (System.currentTimeMillis() - u.getLastLogin().getTime()) / (1000 * 60 * 60 * 24);
                map.put("daysSinceLogin", daysSince);

                return map;
            })
            .collect(Collectors.toList());

        return ResponseEntity.ok(inactive);
    }

    // ✅ ================= DELETE ALL INACTIVE (bulk) =================
    @DeleteMapping("/users/inactive")
    public ResponseEntity<?> deleteInactiveUsers(@RequestParam String role) {

        long cutoffMillis = System.currentTimeMillis() - (10L * 24 * 60 * 60 * 1000);
        Timestamp cutoff  = new Timestamp(cutoffMillis);

        List<User> inactive = userRepository.findAll()
            .stream()
            .filter(u -> u.getRole().name().equalsIgnoreCase(role))
            .filter(u -> u.getLastLogin() == null || u.getLastLogin().before(cutoff))
            .collect(Collectors.toList());

        userRepository.deleteAll(inactive);

        return ResponseEntity.ok(Map.of(
            "deleted", inactive.size(),
            "message", inactive.size() + " inactive " + role + "(s) deleted"
        ));
    }

    // ================= DASHBOARD STATS =================
    @GetMapping("/stats")
    public ResponseEntity<?> getStats() {
        long users      = userRepository.findAll().stream().filter(u -> u.getRole() == Role.USER).count();
        long organisers = userRepository.findAll().stream().filter(u -> u.getRole() == Role.ORGANISER).count();
        long admins     = userRepository.findAll().stream().filter(u -> u.getRole() == Role.ADMIN).count();
        return ResponseEntity.ok(Map.of("users", users, "organisers", organisers, "admins", admins));
    }

    // ================= GET ALL EVENTS =================
    @GetMapping("/events")
    public ResponseEntity<List<Event>> getAllEvents() {
        return ResponseEntity.ok(eventRepository.findAll());
    }

    // ================= APPROVE EVENT =================
    @PutMapping("/events/{id}/approve")
    public ResponseEntity<?> approveEvent(@PathVariable String id) {
        Event event = eventRepository.findById(id).orElse(null);
        if (event == null) return ResponseEntity.badRequest().body("Event not found");
        event.setStatus("APPROVED");
        eventRepository.save(event);
        return ResponseEntity.ok("Event approved");
    }

    // ================= DECLINE EVENT =================
    @PutMapping("/events/{id}/decline")
    public ResponseEntity<?> declineEvent(@PathVariable String id) {
        Event event = eventRepository.findById(id).orElse(null);
        if (event == null) return ResponseEntity.badRequest().body("Event not found");
        event.setStatus("DECLINED");
        eventRepository.save(event);
        return ResponseEntity.ok("Event declined");
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