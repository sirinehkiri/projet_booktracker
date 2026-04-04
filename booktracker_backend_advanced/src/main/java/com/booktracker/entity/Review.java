
package com.booktracker.entity;
import jakarta.persistence.*;

@Entity
public class Review {
 @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
 private Long id;
 private int rating;
 private String comment;

 @ManyToOne
 private User user;

 @ManyToOne
 private Book book;
}
