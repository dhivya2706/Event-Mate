package com.eventmate.eventbackend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.eventmate.eventbackend.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByEmail(String email);
}