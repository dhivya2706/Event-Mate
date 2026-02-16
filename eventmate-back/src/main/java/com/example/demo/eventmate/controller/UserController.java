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

    // ✅ REGISTER
    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(@RequestBody User user) {

        Map<String, String> res = new HashMap<>();

        try {
            // check duplicate email
            if (userRepository.findByEmail(user.getEmail()).isPresent()) {
                res.put("message", "Email already exists!");
                return ResponseEntity.badRequest().body(res);
            }

            // Safe role mapping
            if (user.getRole() == null) {
                user.setRole(Role.USER);
            } else {
                try {
                    user.setRole(Role.valueOf(user.getRole().name().toUpperCase()));
                } catch (Exception e) {
                    user.setRole(Role.USER);
                }
            }

            // Encode password
            user.setPassword(encoder.encode(user.getPassword()));

            // Save user
            userRepository.save(user);

            res.put("message", "Registration successful!");
            return ResponseEntity.ok(res);

        } catch (Exception e) {
            e.printStackTrace(); // console log
            res.put("message", "Server error! Registration failed.");
            return ResponseEntity.status(500).body(res);
        }
    }

    // ✅ LOGIN
    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody User data) {

        Map<String, String> res = new HashMap<>();
        Optional<User> opt = userRepository.findByEmail(data.getEmail());

        if (opt.isEmpty()) {
            res.put("message", "Email not found!");
            return ResponseEntity.status(401).body(res);
        }

        User user = opt.get();

        if (!encoder.matches(data.getPassword(), user.getPassword())) {
            res.put("message", "Incorrect password!");
            return ResponseEntity.status(401).body(res);
        }

        res.put("message", "Login successful");
        res.put("role", user.getRole().name());
        res.put("name", user.getName());

        return ResponseEntity.ok(res);
    }

    // ✅ GET all users or organizers
    @GetMapping("/admin/users")
    public ResponseEntity<List<User>> getUsers(@RequestParam(required = false) String role) {
        List<User> users;
        if (role == null) {
            users = userRepository.findAll();
        } else {
            users = userRepository.findAll().stream()
                    .filter(u -> u.getRole().name().equalsIgnoreCase(role))
                    .toList();
        }
        return ResponseEntity.ok(users);
    }

    // ✅ DELETE user by ID
    @DeleteMapping("/admin/users/{id}")
    public ResponseEntity<Map<String, String>> deleteUser(@PathVariable Long id) {
        Map<String, String> res = new HashMap<>();
        try {
            if (!userRepository.existsById(id)) {
                res.put("message", "User not found!");
                return ResponseEntity.badRequest().body(res);
            }
            userRepository.deleteById(id);
            res.put("message", "User deleted successfully!");
            return ResponseEntity.ok(res);
        } catch (Exception e) {
            e.printStackTrace();
            res.put("message", "Server error! Could not delete.");
            return ResponseEntity.status(500).body(res);
        }
    }

    // ✅ GET counts
    @GetMapping("/admin/stats")
    public ResponseEntity<Map<String, Long>> getStats() {
        Map<String, Long> stats = new HashMap<>();
        stats.put("users", userRepository.findAll().stream().filter(u -> u.getRole() == Role.USER).count());
        stats.put("organisers", userRepository.findAll().stream().filter(u -> u.getRole() == Role.ORGANISER).count());
        stats.put("admins", userRepository.findAll().stream().filter(u -> u.getRole() == Role.ADMIN).count());
        return ResponseEntity.ok(stats);
    }
}
