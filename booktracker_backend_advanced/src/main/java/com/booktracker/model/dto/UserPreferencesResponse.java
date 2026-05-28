package com.booktracker.model.dto;

import lombok.*;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserPreferencesResponse {
    private Long id;
    private List<String> preferredGenres;
    private List<String> preferredLanguages;
    private List<String> favoriteAuthors;
}