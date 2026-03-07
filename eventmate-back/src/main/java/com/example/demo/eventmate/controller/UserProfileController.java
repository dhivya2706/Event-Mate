package com.example.demo.eventmate.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/users")
public class UserProfileController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @PutMapping("/{id}/profile")
    public ResponseEntity<?> updateProfile(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {

        Integer count = jdbcTemplate.queryForObject(
            "SELECT COUNT(*) FROM users_l WHERE id = ?",
            Integer.class, id
        );

        if (count == null || count == 0) {
            return ResponseEntity.status(404).body(Map.of("error", "User not found"));
        }

        String name = body.getOrDefault("name", "").trim();
        if (name.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Name cannot be empty"));
        }

        // ✅ Only update name — no phone
        jdbcTemplate.update("UPDATE users_l SET name = ? WHERE id = ?", name, id);

        Map<String, Object> user = jdbcTemplate.queryForMap(
            "SELECT name, email FROM users_l WHERE id = ?", id
        );

        return ResponseEntity.ok(Map.of(
            "message", "Profile updated successfully",
            "name",    user.get("name"),
            "email",   user.get("email")
        ));
    }
}