package com.example.demo.eventmate.repository;

import com.example.demo.eventmate.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface EventRepository extends JpaRepository<Event, String> {

    // events created by organizer
    List<Event> findByOrganizerId(Long organizerId);

    // only approved events
    List<Event> findByStatus(String status);

}