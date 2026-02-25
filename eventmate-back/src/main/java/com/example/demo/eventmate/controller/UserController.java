package com.example.demo.eventmate.controller;

import com.example.demo.eventmate.model.User;
import com.example.demo.eventmate.model.Role;
import com.example.demo.eventmate.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder encoder;

    // REGISTER
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

    // LOGIN
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User data) {

        Optional<User> opt = userRepository.findByEmail(data.getEmail());

        if (opt.isEmpty()) {
            return ResponseEntity.status(401).body(Map.of("message","Email not found"));
        }

        User user = opt.get();

        if (!encoder.matches(data.getPassword(), user.getPassword())) {
            return ResponseEntity.status(401).body(Map.of("message","Incorrect password"));
        }

        return ResponseEntity.ok(Map.of(
                "role", user.getRole().name(),
                "token", user.getEmail()   // email as token
        ));
    }

    // ADMIN PROFILE
    @GetMapping("/admin/profile")
    public ResponseEntity<?> getAdminProfile(
            @RequestHeader("Authorization") String header) {

        String token = header.substring(7); // remove Bearer

        Optional<User> opt = userRepository.findByEmail(token);

        if (opt.isEmpty()) {
            return ResponseEntity.status(404).body("Admin not found");
        }

        User user = opt.get();

        if (user.getRole() != Role.ADMIN) {
            return ResponseEntity.status(403).body("Access denied");
        }

        return ResponseEntity.ok(user);
    }

    // USERS BY ROLE
    @GetMapping("/admin/users")
    public ResponseEntity<?> getUsers(@RequestParam String role) {

        List<User> users = userRepository.findAll()
                .stream()
                .filter(u -> u.getRole().name().equalsIgnoreCase(role))
                .toList();

        return ResponseEntity.ok(users);
    }

    // DELETE USER
    @DeleteMapping("/admin/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {

        if (!userRepository.existsById(id)) {
            return ResponseEntity.badRequest().body("User not found");
        }

        userRepository.deleteById(id);
        return ResponseEntity.ok("Deleted successfully");
    }

    // STATS
    @GetMapping("/admin/stats")
    public ResponseEntity<?> getStats() {

        long users = userRepository.findAll().stream()
                .filter(u -> u.getRole() == Role.USER).count();

        long organisers = userRepository.findAll().stream()
                .filter(u -> u.getRole() == Role.ORGANISER).count();

        long admins = userRepository.findAll().stream()
                .filter(u -> u.getRole() == Role.ADMIN).count();

        return ResponseEntity.ok(Map.of(
                "users", users,
                "organisers", organisers,
                "admins", admins
        ));
    }
}