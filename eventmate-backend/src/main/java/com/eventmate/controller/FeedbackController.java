package com.eventmate.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.util.List;
import com.eventmate.entity.Event;

import com.eventmate.entity.Feedback;
import com.eventmate.repository.FeedbackRepository;
import com.eventmate.repository.EventRepository;
import com.eventmate.dto.FeedbackRequest;

@RestController
@RequestMapping("/api/feedback")
@CrossOrigin
public class FeedbackController {

    @Autowired
    private FeedbackRepository feedbackRepo;

    @Autowired
    private EventRepository eventRepo;

    @PostMapping
    public ResponseEntity<?> submitFeedback(@RequestBody FeedbackRequest request) {

        if (feedbackRepo.existsByEvent_IdAndUserEmail(request.getEventId(), request.getUserEmail())) {
            return ResponseEntity.badRequest().body("Feedback already submitted");
        }

        Event event = eventRepo.findById(request.getEventId())
                .orElseThrow(() -> new RuntimeException("Event not found"));

        Feedback feedback = new Feedback();
        feedback.setEvent(event);
        feedback.setUserEmail(request.getUserEmail());
        feedback.setRating(request.getRating());
        feedback.setDescription(request.getDescription());

        feedbackRepo.save(feedback);

        return ResponseEntity.ok("Feedback submitted successfully");
    }

    @GetMapping("/organizer")
    public List<Feedback> getOrganizerFeedback(@RequestParam String email) {
        return feedbackRepo.findByEvent_Organizer_Email(email);
    }

    @GetMapping("/user")
    public List<Feedback> getUserFeedback(@RequestParam String email) {
        return feedbackRepo.findByUserEmail(email);
    }
}
