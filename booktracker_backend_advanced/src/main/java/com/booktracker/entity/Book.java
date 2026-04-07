
package com.booktracker.entity;
import jakarta.persistence.*;
import java.util.*;

@Entity
public class Book {
 @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
 private Long id;
 @Column(nullable = false)
 private String title;
 @Column(nullable = false)
 private String author;
 @Column(nullable = false)
 private String genre;
 @Column(nullable = false)
 private int year;
 @Column(nullable = false)
  private String description;
 @Column(nullable = false)
  private String pic;
 @Column(nullable = false)
  private String langue;
 @Column(nullable = false)
 private int total_pages;

 public int getTotal_pages() {
  return total_pages;
 }

 public void setTotal_pages(int total_pages) {
  this.total_pages = total_pages;
 }

 public Book(Long id, String title, String author, String genre, int year, String description, String pic, String langue) {
  this.id = id;
  this.title = title;
  this.author = author;
  this.genre = genre;
  this.year = year;
  this.description = description;
  this.pic = pic;
  this.langue = langue;
 }

 public Book() {

 }

 public Long getId() {
  return id;
 }

 public void setId(Long id) {
  this.id = id;
 }

 public String getTitle() {
  return title;
 }

 public void setTitle(String title) {
  this.title = title;
 }

 public String getAuthor() {
  return author;
 }

 public void setAuthor(String author) {
  this.author = author;
 }

 public String getGenre() {
  return genre;
 }

 public void setGenre(String genre) {
  this.genre = genre;
 }

 public int getYear() {
  return year;
 }

 public void setYear(int year) {
  this.year = year;
 }

 public String getDescription() {
  return description;
 }

 public void setDescription(String description) {
  this.description = description;
 }

 public String getPic() {
  return pic;
 }

 public void setPic(String pic) {
  this.pic = pic;
 }

 public String getLangue() {
  return langue;
 }

 public void setLangue(String langue) {
  this.langue = langue;
 }

}
