package com.eventmate.service;
import java.util.List;
import java.util.Optional;

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

    public Optional<Event> findById(Long id) {
    return eventRepository.findById(id);
}

    public Event save(Event event) {
      return eventRepository.save(event);
    }
    public List<Event> getEventsByOrganizer(String email){
        return eventRepository.findByOrganizerEmail(email);
    }

    public void deleteEvent(Long id){
        eventRepository.deleteById(id);
    }

    public List<Event> getAllEvents() {

    return eventRepository.findAll();

}
}