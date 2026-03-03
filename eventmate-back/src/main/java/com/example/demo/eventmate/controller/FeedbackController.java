package com.example.demo.eventmate.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.*;

import com.example.demo.eventmate.model.Feedback;
import com.example.demo.eventmate.repository.FeedbackRepository;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/feedback")
@CrossOrigin(origins = "http://localhost:3000")
public class FeedbackController {

    @Autowired
    private FeedbackRepository feedbackRepository;

    @Autowired
    private JavaMailSender mailSender;

    @PostMapping
    public ResponseEntity<?> submitFeedback(@RequestBody Feedback feedback) {

        try {

            Feedback saved = feedbackRepository.save(feedback);

            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("pandisathi812@gmail.com");
            message.setTo("pandisathi812@gmail.com");
            message.setSubject("🎉 New Feedback - EventMate");

            message.setText(
                    "New Feedback Received\n\n" +
                    "Booking ID : " + feedback.getBookingId() + "\n" +
                    "User ID    : " + feedback.getUserId() + "\n" +
                    "Event ID   : " + feedback.getEventId() + "\n" +
                    "Rating     : ⭐ " + feedback.getRating() + "\n" +
                    "Comment    : " + feedback.getComment()
            );

            mailSender.send(message);

            Map<String, Object> response = new HashMap<>();
            response.put("status", "SUCCESS");
            response.put("feedbackId", saved.getId());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500)
                    .body("Error saving feedback: " + e.getMessage());
        }
    }
}