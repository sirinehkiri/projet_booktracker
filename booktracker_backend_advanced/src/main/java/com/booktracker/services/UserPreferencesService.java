package com.booktracker.services;

import com.booktracker.entity.User;
import com.booktracker.entity.UserPreferences;
import com.booktracker.model.dto.UserPreferencesRequest;
import com.booktracker.model.dto.UserPreferencesResponse;
import com.booktracker.repository.UserPreferencesRepository;
import com.booktracker.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;

@Service
@RequiredArgsConstructor
@Transactional
public class UserPreferencesService {

    private final UserPreferencesRepository prefsRepo;
    private final UserRepository userRepo;

    public UserPreferencesResponse getPreferences(Long userId) {
        UserPreferences prefs = prefsRepo.findByUserId(userId)
                .orElseGet(() -> createDefaultPreferences(userId));
        return toResponse(prefs);
    }

    public UserPreferencesResponse savePreferences(Long userId, UserPreferencesRequest request) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserPreferences prefs = prefsRepo.findByUserId(userId)
                .orElseGet(() -> {
                    UserPreferences newPrefs = new UserPreferences();
                    newPrefs.setUser(user);
                    return newPrefs;
                });

        if (request.getPreferredGenres() != null) {
            prefs.setPreferredGenres(request.getPreferredGenres());
        }
        if (request.getPreferredLanguages() != null) {
            prefs.setPreferredLanguages(request.getPreferredLanguages());
        }
        if (request.getFavoriteAuthors() != null) {
            prefs.setFavoriteAuthors(request.getFavoriteAuthors());
        }
        if (request.getMonthlyReadingGoal() != null) {
            prefs.setMonthlyReadingGoal(request.getMonthlyReadingGoal());
        }
        if (request.getSocialRecommendations() != null) {
            prefs.setSocialRecommendations(request.getSocialRecommendations());
        }

        prefs.setUpdatedAt(LocalDateTime.now());

        UserPreferences saved = prefsRepo.save(prefs);
        System.out.println("✅ Preferences saved for user: " + userId);

        return toResponse(saved);
    }

    private UserPreferences createDefaultPreferences(Long userId) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserPreferences prefs = new UserPreferences();
        prefs.setUser(user);
        prefs.setPreferredGenres(new ArrayList<>());
        prefs.setPreferredLanguages(new ArrayList<>());
        prefs.setFavoriteAuthors(new ArrayList<>());
        prefs.setMonthlyReadingGoal(0);
        prefs.setSocialRecommendations(false);

        return prefsRepo.save(prefs);
    }

    private UserPreferencesResponse toResponse(UserPreferences prefs) {
        return UserPreferencesResponse.builder()
                .id(prefs.getId())
                .preferredGenres(prefs.getPreferredGenres())
                .preferredLanguages(prefs.getPreferredLanguages())
                .favoriteAuthors(prefs.getFavoriteAuthors())
                .monthlyReadingGoal(prefs.getMonthlyReadingGoal())
                .socialRecommendations(prefs.getSocialRecommendations())
                .build();
    }
}