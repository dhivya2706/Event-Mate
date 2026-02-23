package com.eventmate.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

@Entity
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message="Name cannot be empty")
    @Pattern(
        regexp="^[A-Za-z ]{3,30}$",
        message="Name must be 3-30 letters only"
    )
    private String name;

    @NotBlank(message="Email cannot be empty")
    @Email(message="Invalid email format")
    @Column(unique=true)
    private String email;

    @NotBlank(message="Phone cannot be empty")
    @Pattern(
        regexp="^[6-9]\\d{9}$",
        message="Invalid Indian phone number"
    )
    private String phone;

    @NotBlank(message="Password cannot be empty")
    @Pattern(
        regexp="^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[@#$%^&+=]).{8,}$",
        message="Min 8 chars, 1 Upper, 1 Lower, 1 Number, 1 Special"
    )
    private String password;

    // GETTERS & SETTERS
    public Long getId() { return id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}