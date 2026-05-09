package com.booktracker.model.dto;
import java.time.LocalDate;

public class ReviewSummaryDto {
    private Long id;
    private Long bookId;
    private String bookTitle;
    private String bookPic;
    private Integer rating;
    private String comment;
    private LocalDate date;

    public ReviewSummaryDto() {}

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getBookId() { return bookId; }
    public void setBookId(Long bookId) { this.bookId = bookId; }
    public String getBookTitle() { return bookTitle; }
    public void setBookTitle(String bookTitle) { this.bookTitle = bookTitle; }
    public String getBookPic() { return bookPic; }
    public void setBookPic(String bookPic) { this.bookPic = bookPic; }
    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }
    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }
    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }
}