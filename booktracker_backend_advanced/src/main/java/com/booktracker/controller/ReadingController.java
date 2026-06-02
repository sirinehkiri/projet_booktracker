package com.booktracker.controller;

import com.booktracker.entity.User;
import com.booktracker.model.dto.GoalRequest;
import com.booktracker.model.dto.ProgressRequest;
import com.booktracker.services.ReadingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/reading")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost")
public class ReadingController {

    private final ReadingService readingservice;

    @PostMapping("/progress")
    public ResponseEntity<?> updateProgress(@RequestBody ProgressRequest req) {
        readingservice.updateProgress(req);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/goal")
    public ResponseEntity<?> setGoal(@RequestBody GoalRequest req,
                                     @AuthenticationPrincipal User user) {
        readingservice.setGoal(req, user);
        return ResponseEntity.ok().build();
    }
}
