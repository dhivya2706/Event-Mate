package com.eventmate.controller;
import jakarta.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.eventmate.entity.Event;
import com.eventmate.entity.Organizer;
import com.eventmate.service.EventService;
import com.eventmate.service.OrganizerService;

@RestController
@RequestMapping("/api/organizer")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private OrganizerService organizerService;

    @Autowired
    private EventService eventService;

   @PostMapping("/register")
public Map<String, String> register(@Valid @RequestBody Organizer organizer) {
        String message = organizerService.register(organizer);
        Map<String, String> response = new HashMap<>();
        response.put("message", message);
        return response;
    }

    @GetMapping("/profile")
    public Organizer getProfile(@RequestParam String email) {

        System.out.println("REQUESTED EMAIL = " + email);

        return organizerService.findByEmail(email);
    }

   
    @PutMapping("/profile")
    public Organizer updateProfile(@RequestBody Organizer organizer) {
        return organizerService.updateOrganizer(organizer);
    }

    @GetMapping("/events")
    public List<Event> getOrganizerEvents(@RequestParam String email) {
        Organizer organizer = organizerService.findByEmail(email);
        if (organizer != null) {
            return eventService.findByOrganizer(organizer);
        }
        return List.of(); 
    }

    @PostMapping("/login")
    public Map<String, String> login(@Valid @RequestBody Organizer organizer) {
        Organizer existing =
                organizerService.login(organizer.getEmail(), organizer.getPassword());

        Map<String, String> response = new HashMap<>();

        if (existing != null) {
            response.put("message", "Login successful");
            response.put("id", String.valueOf(existing.getId()));
            response.put("name", existing.getName());
            response.put("email", existing.getEmail());
            response.put("role", "ORGANISER");
        } else {
            response.put("message", "Invalid credentials");
        }

        return response;
    }
}