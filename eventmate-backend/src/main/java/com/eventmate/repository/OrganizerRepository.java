package com.eventmate.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.eventmate.entity.Organizer;

import java.util.Optional;

public interface OrganizerRepository extends JpaRepository<Organizer, Long> {

    Optional<Organizer> findByEmail(String email);
}