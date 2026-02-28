package com.eventmate.eventbackend.service;

import org.springframework.stereotype.Service;
import com.eventmate.eventbackend.entity.User;
import com.eventmate.eventbackend.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public User saveUser(User user) {
        return userRepository.save(user);
    }
    public User updateUser(User user) {

        User existingUser = userRepository.findByEmail(user.getEmail());

        if (existingUser != null) {

            existingUser.setFirstName(user.getFirstName());
            existingUser.setLastName(user.getLastName());
            existingUser.setGender(user.getGender());
            existingUser.setDob(user.getDob());
            existingUser.setAddress(user.getAddress());

            return userRepository.save(existingUser);
        }

        return null;
    }
}
