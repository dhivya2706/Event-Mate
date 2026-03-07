package com.example.demo.eventmate.model;

import jakarta.persistence.*;
import java.sql.Timestamp;

@Entity
@Table(name = "users_l")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role = Role.USER;

    @Column(name = "created_at", nullable = false)
    private Timestamp createdAt;

    // ✅ Track last login time
    @Column(name = "last_login")
    private Timestamp lastLogin;

    @PrePersist
    public void onCreate() {
        this.createdAt = new Timestamp(System.currentTimeMillis());
    }

    public User() {}

    // Getters & Setters
    public Long getId()                        { return id; }
    public void setId(Long id)                 { this.id = id; }

    public String getName()                    { return name; }
    public void setName(String name)           { this.name = name; }

    public String getEmail()                   { return email; }
    public void setEmail(String email)         { this.email = email; }

    public String getPassword()                { return password; }
    public void setPassword(String password)   { this.password = password; }

    public Role getRole()                      { return role; }
    public void setRole(Role role)             { this.role = role; }

    public Timestamp getCreatedAt()            { return createdAt; }
    public void setCreatedAt(Timestamp t)      { this.createdAt = t; }

    public Timestamp getLastLogin()            { return lastLogin; }
    public void setLastLogin(Timestamp t)      { this.lastLogin = t; }
}