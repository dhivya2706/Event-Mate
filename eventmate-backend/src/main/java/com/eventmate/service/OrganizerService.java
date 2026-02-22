package com.eventmate.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.eventmate.entity.Organizer;
import com.eventmate.repository.OrganizerRepository;

@Service
public class OrganizerService {

    @Autowired
    private OrganizerRepository organizerRepository;

    public String register(Organizer organizer) {

        if (organizerRepository.findByEmail(organizer.getEmail()).isPresent()) {
            return "Email already exists!";
        }

        organizerRepository.save(organizer);
        return "Organizer registered successfully!";
    }

    public Organizer findByEmail(String email) {
        return organizerRepository.findByEmail(email).orElse(null);
    }

    public Organizer updateOrganizer(Organizer organizer) {
    return organizerRepository.findById(organizer.getId())
            .map(existing -> {
                existing.setName(organizer.getName());
                existing.setPhone(organizer.getPhone());
                existing.setCompanyName(organizer.getCompanyName());
                existing.setEmail(organizer.getEmail()); // optional
                existing.setPassword(organizer.getPassword()); // optional
                return organizerRepository.save(existing);
            })
            .orElse(null);
    }

    public Organizer login(String email, String password) {

        Optional<Organizer> organizer = organizerRepository.findByEmail(email);

        if (organizer.isPresent() &&
                organizer.get().getPassword().equals(password)) {

            return organizer.get();
        }

        return null;
    }
}