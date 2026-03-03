package com.example.demo.eventmate.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.demo.eventmate.model.Feedback;

public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
}