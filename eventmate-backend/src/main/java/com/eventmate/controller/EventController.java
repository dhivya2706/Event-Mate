package com.eventmate.controller;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.eventmate.entity.Event;
import com.eventmate.entity.Organizer;
import com.eventmate.repository.OrganizerRepository;
import com.eventmate.service.EventService;

@RestController
@RequestMapping("/api/events")
@CrossOrigin(origins="http://localhost:3000")
public class EventController {

    @Autowired
    private EventService eventService;

    @Autowired
    private OrganizerRepository organizerRepo;

    private static final String uploadDir =
            System.getProperty("user.dir") + "/uploads/";

    @PostMapping("/add")
    public ResponseEntity<?> addEvent(
        @RequestParam String eventName,
        @RequestParam String eventDate,
        @RequestParam String venue,
        @RequestParam double ticketPrice,
        @RequestParam int totalSeats,
        @RequestParam String email,     
        @RequestParam MultipartFile image
    )throws IOException {

    Organizer org = organizerRepo.findByEmail(email)
        .orElse(null);

    if (org == null)
        return ResponseEntity.badRequest().body("Organizer not found");

    File dir = new File(uploadDir);
    if(!dir.exists()) dir.mkdirs();

    String fileName = System.currentTimeMillis()+"_"+image.getOriginalFilename();
    Path path = Paths.get(uploadDir + fileName);
    Files.write(path, image.getBytes());

    Event event = new Event();
    event.setEventName(eventName);
    event.setTicketPrice(ticketPrice);
    event.setTotalSeats(totalSeats);
    event.setEventDate(eventDate);
    event.setVenue(venue);
    event.setOrganizer(org); 
    event.setImageName(fileName);

    return ResponseEntity.ok(eventService.save(event));
}
}