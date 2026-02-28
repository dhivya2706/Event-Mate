package com.eventmate.controller;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.eventmate.entity.User;
import com.eventmate.service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "http://localhost:3000")
public class UserAuthController {

    @Autowired
    private UserService userService;

   @PostMapping("/register")
public Map<String, String> register(@Valid @RequestBody User user) {

    String msg = userService.register(user);

    Map<String, String> res = new HashMap<>();
    res.put("message", msg);

    return res;
}

@PostMapping("/login")
public Map<String, Object> login(@RequestBody User user) {

    User existing =
        userService.login(user.getEmail(), user.getPassword());

    Map<String, Object> res = new HashMap<>();

    if (existing != null) {

        res.put("message", "Login successful");


        res.put("user", existing);

    } else {

        res.put("message", "Invalid credentials");
    }

    return res;
}

@GetMapping("/profile")
public User getProfile(@RequestParam String email){
    return userService.getProfile(email);
}


@PutMapping("/profile")
public User updateProfile(@RequestBody User user){
    return userService.updateProfile(user);
}
}