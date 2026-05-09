package com.booktracker.model.dto;
import java.util.List;

public class UserProfileResponse {
    private Long id;
    private String username;
    private String email;

    // Stats
    private long followersCount;
    private long followingCount;
    private long readBooksCount;

    // Lists
    private List<BookSummaryDto> readBooks;
    private List<ReviewSummaryDto> reviews;
    private List<BookSummaryDto> friendRecommendations;

    public UserProfileResponse() {}

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public long getFollowersCount() { return followersCount; }
    public void setFollowersCount(long followersCount) { this.followersCount = followersCount; }
    public long getFollowingCount() { return followingCount; }
    public void setFollowingCount(long followingCount) { this.followingCount = followingCount; }
    public long getReadBooksCount() { return readBooksCount; }
    public void setReadBooksCount(long readBooksCount) { this.readBooksCount = readBooksCount; }
    public List<BookSummaryDto> getReadBooks() { return readBooks; }
    public void setReadBooks(List<BookSummaryDto> readBooks) { this.readBooks = readBooks; }
    public List<ReviewSummaryDto> getReviews() { return reviews; }
    public void setReviews(List<ReviewSummaryDto> reviews) { this.reviews = reviews; }
    public List<BookSummaryDto> getFriendRecommendations() { return friendRecommendations; }
    public void setFriendRecommendations(List<BookSummaryDto> friendRecommendations) { this.friendRecommendations = friendRecommendations; }
}