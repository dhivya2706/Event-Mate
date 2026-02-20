package com.eventmate.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.eventmate.entity.Event;
import com.eventmate.entity.Organizer;

public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByOrganizer(Organizer organizer);
}