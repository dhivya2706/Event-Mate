package com.eventmate.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.eventmate.entity.Event;
import com.eventmate.entity.Organizer;
import com.eventmate.repository.EventRepository;

@Service
public class EventService {

    @Autowired
    private EventRepository eventRepository;

    public List<Event> findByOrganizer(Organizer organizer) {
        return eventRepository.findByOrganizer(organizer);
    }

    public Event save(Event event) {
      return eventRepository.save(event);
    }
}