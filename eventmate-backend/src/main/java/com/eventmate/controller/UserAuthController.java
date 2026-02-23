package com.eventmate.controller;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
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
public Map<String, String> login(@Valid @RequestBody User user) {

    User existing =
        userService.login(user.getEmail(), user.getPassword());

    Map<String, String> res = new HashMap<>();

    if(existing != null) {

        res.put("message","Login successful");
        res.put("name",existing.getName());
        res.put("email",existing.getEmail());
        res.put("role","USER");

    } else {

        res.put("message","Invalid credentials");
    }

    return res;
}
}