package com.example.demo.eventmate.controller;

import com.example.demo.eventmate.model.Event;
import com.example.demo.eventmate.model.Booking;
import com.example.demo.eventmate.repository.EventRepository;
import com.example.demo.eventmate.repository.BookingRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/organizer")
@CrossOrigin(origins = "http://localhost:3000")
public class OrganizerController {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private EventRepository eventRepository;

    // ================= BOOKINGS =================
    @GetMapping("/bookings")
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    // ================= ADD EVENT =================
    @PostMapping("/add-event")
    public ResponseEntity<?> addEvent(
            @RequestParam String title,
            @RequestParam String venue,
            @RequestParam String event_date,
            @RequestParam int capacity,
            @RequestParam double price,
            @RequestParam MultipartFile image
    ) throws IOException {
        Event event = new Event();
        event.setEventId(UUID.randomUUID().toString());
        event.setTitle(title);
        event.setVenue(venue);
        event.setEventDate(LocalDateTime.parse(event_date + "T00:00:00"));
        event.setCapacity(capacity);
        event.setPrice(price);
        event.setImage(image.getBytes());

        eventRepository.save(event);
        return ResponseEntity.ok("Event Added Successfully");
    }

    // ================= GET ALL EVENTS =================
    @GetMapping("/events")
    public List<Event> getAllEvents() {
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

        if (image != null && !image.isEmpty()) {
            event.setImage(image.getBytes());
        }

        eventRepository.save(event);
        return ResponseEntity.ok("Event updated successfully");
    }
}