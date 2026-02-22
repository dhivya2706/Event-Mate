package com.eventmate.controller;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
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

    private static final String UPLOAD_DIR  =
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

        File dir = new File(UPLOAD_DIR);
        if(!dir.exists()) dir.mkdirs();

        String fileName = System.currentTimeMillis()+"_"+image.getOriginalFilename();
        Path path = Paths.get(UPLOAD_DIR + fileName);
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

    @GetMapping("/organizer")
    public List<Event> getEventsByOrganizer(@RequestParam String email){
        return eventService.getEventsByOrganizer(email);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Event> getEventById(@PathVariable Long id){
        Optional<Event> eventOpt = eventService.findById(id);
        if(eventOpt.isPresent()) {
            return ResponseEntity.ok(eventOpt.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Event> updateEvent(
        @PathVariable Long id,
        @RequestBody Event updatedEvent
    ) {
        Optional<Event> eventOpt = eventService.findById(id);
        if(!eventOpt.isPresent()) return ResponseEntity.notFound().build();

        Event event = eventOpt.get();
        event.setEventName(updatedEvent.getEventName());
        event.setTotalSeats(updatedEvent.getTotalSeats());
        event.setEventDate(updatedEvent.getEventDate());
        event.setVenue(updatedEvent.getVenue());
        event.setTicketPrice(updatedEvent.getTicketPrice());

        Event saved = eventService.save(event);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{id}")
    public void deleteEvent(@PathVariable Long id){
        eventService.deleteEvent(id);
    }
}