package com.booktracker.entity;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
public class ReadingProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer pagesRead;

    private LocalDate date;

    private Integer readingTime;

    public void setPagesRead(Integer pagesRead) {
        this.pagesRead = pagesRead;
    }

    public Integer getReadingTime() {
        return readingTime;
    }

    public void setReadingTime(Integer readingTime) {
        this.readingTime = readingTime;
    }

    @ManyToOne
    @JoinColumn(name = "user_book_id")
    private UserBook userBook;

    public void setId(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public int getPagesRead() {
        return pagesRead;
    }

    public void setPagesRead(int pagesRead) {
        this.pagesRead = pagesRead;
    }

    public UserBook getUserBook() {
        return userBook;
    }

    public void setUserBook(UserBook userBook) {
        this.userBook = userBook;
    }
}
