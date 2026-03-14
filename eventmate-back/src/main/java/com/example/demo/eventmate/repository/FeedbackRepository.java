package com.example.demo.eventmate.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.demo.eventmate.model.Feedback;

import java.util.List;

public interface FeedbackRepository extends JpaRepository<Feedback, Long> {

    // organizer events feedback fetch panna
    List<Feedback> findByEventIdIn(List<String> eventIds);

}