package com.booktracker.model.dto;

import lombok.Data;
import java.util.List;

@Data
public class UserPreferencesRequest {
    private List<String> preferredGenres;
    private List<String> preferredLanguages;
    private List<String> favoriteAuthors;
}