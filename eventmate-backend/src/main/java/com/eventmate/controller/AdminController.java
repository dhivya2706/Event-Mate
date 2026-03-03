package com.eventmate.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.eventmate.entity.Admin;
import com.eventmate.entity.User;
import com.eventmate.entity.Event;
import com.eventmate.entity.Booking;
import com.eventmate.entity.Organizer;

import com.eventmate.repository.UserRepository;
import com.eventmate.repository.EventRepository;
import com.eventmate.repository.OrganizerRepository;
import com.eventmate.repository.BookingRepository;

import com.eventmate.service.AdminService;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OrganizerRepository organizerRepository;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Admin admin) {

        Admin existing =
                adminService.login(admin.getEmail(), admin.getPassword());

        Map<String, Object> response = new HashMap<>();

        if (existing != null) {
            response.put("message", "Login successful");
            response.put("user", existing);
        } else {
            response.put("message", "Invalid credentials");
        }

        return response;
    }

@GetMapping("/counts")
public Map<String, Long> getCounts() {

    Map<String, Long> counts = new HashMap<>();

    counts.put("users", userRepository.count());
    counts.put("organizers", organizerRepository.count());
    counts.put("events", eventRepository.count());
    counts.put("bookings", bookingRepository.count());

    return counts;
}

    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @DeleteMapping("/users/{id}")
    public String deleteUser(@PathVariable Long id) {
        userRepository.deleteById(id);
        return "User Deleted Successfully";
    }

    @GetMapping("/organizers")
    public List<Organizer> getAllOrganizers() {
        return organizerRepository.findAll();
    }

    @DeleteMapping("/organizers/{id}")
    public String deleteOrganizer(@PathVariable Long id) {
        organizerRepository.deleteById(id);
        return "Organizer Deleted Successfully";
    }

    @GetMapping("/events")
    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    @DeleteMapping("/events/{id}")
    public String deleteEvent(@PathVariable Long id) {
        eventRepository.deleteById(id);
        return "Event Deleted Successfully";
    }

    @GetMapping("/bookings")
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    @DeleteMapping("/bookings/{id}")
    public String deleteBooking(@PathVariable Long id) {
        bookingRepository.deleteById(id);
        return "Booking Deleted Successfully";
    }
}