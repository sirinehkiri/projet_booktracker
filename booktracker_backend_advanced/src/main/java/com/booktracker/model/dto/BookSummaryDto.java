package com.booktracker.model.dto;

public class BookSummaryDto {
    private Long id;
    private String title;
    private String author;
    private String pic;

    // Constructors
    public BookSummaryDto() {}
    public BookSummaryDto(Long id, String title, String author, String pic) {
        this.id = id; this.title = title; this.author = author; this.pic = pic;
    }

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getAuthor() { return author; }
    public void setAuthor(String author) { this.author = author; }
    public String getPic() { return pic; }
    public void setPic(String pic) { this.pic = pic; }
}