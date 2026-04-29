package com.booktracker.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;

@Entity
public class Review {

 @Id
 @GeneratedValue(strategy = GenerationType.IDENTITY)
 private Long id;

 private Integer rating;

 private String comment;

 private LocalDate date;

 @Transient
 private boolean liked;

 public boolean isLiked() {
  return liked;
 }

 public void setLiked(boolean liked) {
  this.liked = liked;
 }

 public LocalDate getDate() {
  return date;
 }

 public void setDate(LocalDate date) {
  this.date = date;
 }

 @ManyToOne
 @JoinColumn(name = "book_id")
 @JsonBackReference
 private Book book;

 @ManyToOne
 @JoinColumn(name="user_id")
 private User user;

 @OneToMany(mappedBy = "review", cascade = CascadeType.ALL, orphanRemoval = true)
 private List<ReviewVote> votes;
 public Long getId() {
  return id;
 }

 public void setId(Long id) {
  this.id = id;
 }

 public Integer getRating() {
  return rating;
 }

 public void setRating(int rating) {
  this.rating = rating;
 }

 public String getComment() {
  return comment;
 }

 public void setComment(String comment) {
  this.comment = comment;
 }

 public User getUser() {
  return user;
 }

 public void setUser(User user) {
  this.user = user;
 }

 public Book getBook() {
  return book;
 }

 public void setBook(Book book) {
  this.book = book;
 }
}