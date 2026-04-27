package com.booktracker.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.util.*;

@Entity
@Table(name = "users")
public class User {

 @Id
 @GeneratedValue(strategy = GenerationType.IDENTITY)
 private Long id;

 @Column(unique = true, nullable = false)
 private String username;

 @Column(nullable = false)
 private String password;

 private String role; // USER / ADMIN

 @Column(unique = true, nullable = false)
 private String email;

 private boolean emailVerified = false;

 @OneToMany(mappedBy = "user")
 @JsonIgnore
 private List<Review> reviews;

 // ✅ Constructeur vide obligatoire
 public User() {}

 public User(Long id, String username, String password, String role, String email) {
  this.id = id;
  this.username = username;
  this.password = password;
  this.role = role;
  this.email = email;
 }

 // Getters & Setters

 public Long getId() { return id; }

 public void setId(Long id) { this.id = id; }

 public String getUsername() { return username; }

 public void setUsername(String username) { this.username = username; }

 public String getPassword() { return password; }

 public void setPassword(String password) { this.password = password; }

 public String getRole() { return role; }

 public void setRole(String role) { this.role = role; }

 public String getEmail() { return email; }

 public void setEmail(String email) { this.email = email; }

 public boolean isEmailVerified() { return emailVerified; }

 public void setEmailVerified(boolean emailVerified) {
  this.emailVerified = emailVerified;
 }

 public List<Review> getReviews() { return reviews; }

 public void setReviews(List<Review> reviews) {
  this.reviews = reviews;
 }
}