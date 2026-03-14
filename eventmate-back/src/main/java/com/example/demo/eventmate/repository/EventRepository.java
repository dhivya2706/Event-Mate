package com.example.demo.eventmate.repository;

import com.example.demo.eventmate.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface EventRepository extends JpaRepository<Event, String> {

    List<Event> findByOrganizerId(Long organizerId);

    List<Event> findByStatus(String status);
}