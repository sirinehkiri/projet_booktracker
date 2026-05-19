package com.booktracker.model.dto;

public class ProgressRequest {
    private Long userBookId;
    private int pagesRead;
    private Integer readingTime;

    public Integer getReadingTime() {
        return readingTime;
    }

    public void setReadingTime(Integer readingTime) {
        this.readingTime = readingTime;
    }

    public Long getUserBookId() {
        return userBookId;
    }

    public void setUserBookId(Long userBookId) {
        this.userBookId = userBookId;
    }

    public int getPagesRead() {
        return pagesRead;
    }

    public void setPagesRead(int pagesRead) {
        this.pagesRead = pagesRead;
    }
}
