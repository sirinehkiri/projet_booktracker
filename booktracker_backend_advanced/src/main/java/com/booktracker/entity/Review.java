package com.booktracker.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

@Entity
public class Review {

 @Id
 @GeneratedValue(strategy = GenerationType.IDENTITY)
 private Long id;

 private int rating;

 private String comment;

 @ManyToOne
 @JoinColumn(name = "book_id")
 @JsonBackReference
 private Book book;

 @ManyToOne
 @JoinColumn(name="user_id")
 private User user;
 public Long getId() {
  return id;
 }

 public void setId(Long id) {
  this.id = id;
 }

 public int getRating() {
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