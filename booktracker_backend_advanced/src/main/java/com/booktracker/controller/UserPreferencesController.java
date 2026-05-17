package com.booktracker.controller;

import com.booktracker.entity.User;
import com.booktracker.model.dto.UserPreferencesRequest;
import com.booktracker.model.dto.UserPreferencesResponse;
import com.booktracker.repository.UserRepository;
import com.booktracker.services.UserPreferencesService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/preferences")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class UserPreferencesController {

    private final UserPreferencesService prefsService;
    private final UserRepository userRepository;

    private Long resolveUserId(String userParam) {
        try {
            return Long.parseLong(userParam);
        } catch (NumberFormatException e) {
            User user = userRepository.findByUsername(userParam)
                    .orElseThrow(() -> new RuntimeException("User not found: " + userParam));
            return user.getId();
        }
    }

    @GetMapping("/user/{userParam}")
    public ResponseEntity<UserPreferencesResponse> getPreferences(@PathVariable String userParam) {
        Long userId = resolveUserId(userParam);
        return ResponseEntity.ok(prefsService.getPreferences(userId));
    }

    @PutMapping("/user/{userParam}")
    public ResponseEntity<UserPreferencesResponse> savePreferences(
            @PathVariable String userParam,
            @RequestBody UserPreferencesRequest request) {
        Long userId = resolveUserId(userParam);
        return ResponseEntity.ok(prefsService.savePreferences(userId, request));
    }
}