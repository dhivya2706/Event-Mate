package com.example.demo.eventmate.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.demo.eventmate.model.Event;
import com.example.demo.eventmate.repository.EventRepository;

import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.Base64;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api")
public class EventController {

    @Autowired
    private EventRepository eventRepository;

    private static final DateTimeFormatter DATE_FORMATTER =
            DateTimeFormatter.ofPattern("yyyy-MM-dd");

    // ================= GET APPROVED EVENTS =================
    @GetMapping("/events")
    public List<Map<String, Object>> getAllEvents() {

        List<Event> events = eventRepository.findByStatus("APPROVED");

        List<Map<String, Object>> response = new ArrayList<>();

        for (Event event : events) {

            Map<String, Object> eventMap = new HashMap<>();

            eventMap.put("eventId", event.getEventId());
            eventMap.put("title", event.getTitle());
            eventMap.put("venue", event.getVenue());

            eventMap.put("eventDate",
                    event.getEventDate() != null
                            ? event.getEventDate().format(DATE_FORMATTER)
                            : null
            );

            eventMap.put("capacity", event.getCapacity());
            eventMap.put("price", event.getPrice());

            if (event.getImage() != null) {
                eventMap.put("image",
                        Base64.getEncoder().encodeToString(event.getImage()));
            } else {
                eventMap.put("image", null);
            }

            response.add(eventMap);
        }

        return response;
    }
}