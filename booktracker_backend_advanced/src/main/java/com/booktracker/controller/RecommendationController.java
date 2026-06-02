package com.booktracker.controller;

import com.booktracker.entity.Book;
import com.booktracker.entity.User;
import com.booktracker.repository.UserRepository;
import com.booktracker.services.RecommendationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/books/recommendations")
@CrossOrigin(origins = "http://localhost")
public class RecommendationController {

    private final RecommendationService recommendationService;
    private final UserRepository userRepository;

    public RecommendationController(
            RecommendationService recommendationService,
            UserRepository userRepository
    ) {
        this.recommendationService = recommendationService;
        this.userRepository = userRepository;
    }

    private Long resolveUserId(String userParam) {
        try {
            return Long.parseLong(userParam);
        } catch (NumberFormatException e) {
            User user = userRepository.findByUsername(userParam)
                    .orElseThrow(() -> new RuntimeException("User not found: " + userParam));
            return user.getId();
        }
    }

    // ANCIEN endpoint (Authentication)
    @GetMapping
    public ResponseEntity<List<Book>> getRecommendations(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        return ResponseEntity.ok(recommendationService.getRecommendations(user));
    }

    // 🆕 Recommandations personnalisées
    @GetMapping("/user/{userParam}/personalized")
    public ResponseEntity<List<Map<String, Object>>> getPersonalizedRecommendations(
            @PathVariable String userParam) {
        Long userId = resolveUserId(userParam);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Book> books = recommendationService.getRecommendations(user);

        List<Map<String, Object>> result = books.stream().map(book -> {
            Map<String, Object> bookMap = new HashMap<>();
            bookMap.put("id", book.getId());
            bookMap.put("title", book.getTitle());
            bookMap.put("author", book.getAuthor());
            bookMap.put("genre", book.getGenre());
            bookMap.put("year", book.getYear());
            bookMap.put("description", book.getDescription());
            bookMap.put("pic", book.getPic());
            bookMap.put("langue", book.getLangue());
            bookMap.put("total_pages", book.getTotal_pages());
            bookMap.put("averageRating", book.getAverageRating());
            bookMap.put("reasons", List.of("📚 " + book.getGenre(), "✍️ " + book.getAuthor()));
            return bookMap;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(result);
    }

    // 🆕 Recommandations sociales
    @GetMapping("/user/{userParam}/social")
    public ResponseEntity<List<Map<String, Object>>> getSocialRecommendations(
            @PathVariable String userParam) {
        Long userId = resolveUserId(userParam);
        return ResponseEntity.ok(recommendationService.getSocialRecommendations(userId));
    }

    // ✨ SMART recommendations (Preferences + Social) - For You
    @GetMapping("/smart")
    public ResponseEntity<List<Map<String, Object>>> getSmartFromAuth(
            Authentication authentication
    ) {
        User user = (User) authentication.getPrincipal();
        System.out.println("✨ Smart recommendations for: " + user.getUsername());
        return ResponseEntity.ok(
                recommendationService.getSmartRecommendations(user.getId())
        );
    }
}