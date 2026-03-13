package com.eventmate.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.eventmate.entity.Admin;

public interface AdminRepository extends JpaRepository<Admin, Long> {

    Admin findByEmail(String email);
}