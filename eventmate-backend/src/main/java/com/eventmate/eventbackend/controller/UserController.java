package com.eventmate.eventbackend.controller;

import org.springframework.web.bind.annotation.*;
import com.eventmate.eventbackend.entity.User;
import com.eventmate.eventbackend.service.UserService;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // LOGIN
    @PostMapping("/login")
    public Map<String, String> loginUser(@RequestBody User user) {
        User existingUser = userService.findByEmail(user.getEmail());
        Map<String, String> response = new HashMap<>();

        if (existingUser != null &&
                existingUser.getPassword().equals(user.getPassword()) &&
                existingUser.getRole().equals(user.getRole())) {

            response.put("status", "success");
            response.put("role", existingUser.getRole());
        } else {
            response.put("status", "fail");
        }

        return response;
    }
    @GetMapping("/{email}")
    public User getUserByEmail(@PathVariable String email) {
        return userService.findByEmail(email);
    }
    @PutMapping("/update")
    public User updateUser(@RequestBody User user) {
        return userService.updateUser(user);
    }
    @PostMapping("/signup")
    public Map<String, String> signupUser(@RequestBody User user) {

        Map<String, String> response = new HashMap<>();
        String password = user.getPassword();
        if (!password.matches("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&]).{8,}$")) {
            response.put("status", "fail");
            response.put("message", "Password must be at least 8 characters, include uppercase, lowercase, number, and special character.");
            return response;
        }

        User existingUser = userService.findByEmail(user.getEmail());
        if (existingUser != null) {
            response.put("status", "fail");
            response.put("message", "User already exists");
            return response;
        }

        userService.saveUser(user);
        response.put("status", "success");
        return response;
    }
}
