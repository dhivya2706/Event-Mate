package com.eventmate.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.eventmate.entity.User;
import com.eventmate.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository repo;

    public String register(User user) {

        if(repo.findByEmail(user.getEmail()) != null) {
            return "Email already exists";
        }

        repo.save(user);
        return "Registration successful";
    }

    public User login(String email, String password) {

        return repo.findByEmailAndPassword(email, password);
    }

    public User getProfile(String email){
    return repo.findByEmail(email);
}

public User updateProfile(User user){

    User existing = repo.findByEmail(user.getEmail());

    if(existing == null){
        return null;
    }

    existing.setName(user.getName());
    existing.setPhone(user.getPhone());

    return repo.save(existing);
}
}