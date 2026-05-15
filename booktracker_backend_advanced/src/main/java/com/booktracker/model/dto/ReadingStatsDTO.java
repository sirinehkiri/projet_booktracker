package com.booktracker.model.dto;

public class ReadingStatsDTO {

    private long totalBooksRead;

    private long currentlyReading;

    private long wantToRead;

    private int totalPagesRead;

    private double totalReadingHours;

    private String favoriteGenre;

    private String favoriteAuthor;

    public long getTotalBooksRead() {
        return totalBooksRead;
    }

    public void setTotalBooksRead(long totalBooksRead) {
        this.totalBooksRead = totalBooksRead;
    }

    public long getCurrentlyReading() {
        return currentlyReading;
    }

    public void setCurrentlyReading(long currentlyReading) {
        this.currentlyReading = currentlyReading;
    }

    public long getWantToRead() {
        return wantToRead;
    }

    public void setWantToRead(long wantToRead) {
        this.wantToRead = wantToRead;
    }

    public int getTotalPagesRead() {
        return totalPagesRead;
    }

    public void setTotalPagesRead(int totalPagesRead) {
        this.totalPagesRead = totalPagesRead;
    }

    public double getTotalReadingHours() {
        return totalReadingHours;
    }

    public void setTotalReadingHours(double totalReadingHours) {
        this.totalReadingHours = totalReadingHours;
    }

    public String getFavoriteGenre() {
        return favoriteGenre;
    }

    public void setFavoriteGenre(String favoriteGenre) {
        this.favoriteGenre = favoriteGenre;
    }

    public String getFavoriteAuthor() {
        return favoriteAuthor;
    }

    public void setFavoriteAuthor(String favoriteAuthor) {
        this.favoriteAuthor = favoriteAuthor;
    }
}
