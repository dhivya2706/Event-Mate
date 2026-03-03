package com.example.demo.eventmate.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.example.demo.eventmate.model.Event;
import com.example.demo.eventmate.repository.EventRepository;

import java.util.*;
import java.util.Base64;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api")
public class EventController {

    @Autowired
    private EventRepository eventRepository;

    // GET ALL EVENTS
    @GetMapping("/events")
    public List<Map<String, Object>> getAllEvents() {
        List<Event> events = eventRepository.findAll();
        List<Map<String, Object>> response = new ArrayList<>();

        for (Event event : events) {
            Map<String, Object> eventMap = new HashMap<>();
            eventMap.put("eventId", event.getEventId());
            eventMap.put("title", event.getTitle());
            eventMap.put("venue", event.getVenue());
            eventMap.put("eventDate", event.getEventDate());
            eventMap.put("capacity", event.getCapacity());
            eventMap.put("price", event.getPrice());

            // Convert image to base64
            if (event.getImage() != null) {
                eventMap.put("image", Base64.getEncoder().encodeToString(event.getImage()));
            } else {
                eventMap.put("image", null);
            }

            response.add(eventMap);
        }
        return response;
    }
}