package com.booktracker.model.dto;

import com.booktracker.entity.User;

import java.time.LocalDate;

public class ReviewDTO {
    public Long id;
    public int rating;
    public String comment;
    public LocalDate date;
    public User user;
    public boolean liked;
}
