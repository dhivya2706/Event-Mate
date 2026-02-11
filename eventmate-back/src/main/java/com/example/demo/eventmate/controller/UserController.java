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

        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            res.put("message", "Email already exists!");
            return ResponseEntity.badRequest().body(res);
        }

        if (user.getRole() == null) {
            user.setRole(Role.USER);
        }

        user.setPassword(encoder.encode(user.getPassword()));
        userRepository.save(user);

        res.put("message", "Registration successful!");
        return ResponseEntity.ok(res);
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
}
