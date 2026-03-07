package com.example.demo.eventmate.controller;

import com.example.demo.eventmate.model.User;
import com.example.demo.eventmate.model.Role;
import com.example.demo.eventmate.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.sql.Timestamp;
import java.util.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder encoder;

    // ================= REGISTER =================
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {

        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email already exists!");
        }

        if (user.getRole() == null) {
            user.setRole(Role.USER);
        }

        user.setPassword(encoder.encode(user.getPassword()));
        userRepository.save(user);

        return ResponseEntity.ok("Registration successful!");
    }

    // ================= LOGIN =================
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User data) {

        Optional<User> opt = userRepository.findByEmail(data.getEmail());

        if (opt.isEmpty()) {
            return ResponseEntity.status(401)
                    .body(Map.of("message", "Email not found"));
        }

        User user = opt.get();

        if (!encoder.matches(data.getPassword(), user.getPassword())) {
            return ResponseEntity.status(401)
                    .body(Map.of("message", "Incorrect password"));
        }

        // ✅ Save last login time every time user logs in
        user.setLastLogin(new Timestamp(System.currentTimeMillis()));
        userRepository.save(user);

        return ResponseEntity.ok(Map.of(
                "id",        user.getId(),
                "name",      user.getName(),
                "email",     user.getEmail(),
                "role",      user.getRole().name(),
                "token",     user.getEmail(),
                "lastLogin", user.getLastLogin().toString()
        ));
    }
}