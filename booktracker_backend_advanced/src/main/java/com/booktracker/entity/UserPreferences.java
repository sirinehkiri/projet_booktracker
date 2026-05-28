package com.booktracker.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "user_preferences")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserPreferences {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(
            name = "user_preferred_genres",
            joinColumns = @JoinColumn(name = "preferences_id")
    )
    @Column(name = "genre")
    private List<String> preferredGenres = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(
            name = "user_preferred_languages",
            joinColumns = @JoinColumn(name = "preferences_id")
    )
    @Column(name = "language")
    private List<String> preferredLanguages = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(
            name = "user_favorite_authors",
            joinColumns = @JoinColumn(name = "preferences_id")
    )
    @Column(name = "author")
    private List<String> favoriteAuthors = new ArrayList<>();

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime updatedAt = LocalDateTime.now();
}