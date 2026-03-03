package com.eventmate.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

import com.eventmate.entity.Feedback;

public interface FeedbackRepository extends JpaRepository<Feedback, Long> {

    boolean existsByEvent_IdAndUserEmail(Long eventId, String userEmail);

    List<Feedback> findByEvent_Organizer_Email(String email);

    List<Feedback> findByUserEmail(String userEmail);
}
