package com.booktracker.controller;

import com.booktracker.model.dto.GoalRequest;
import com.booktracker.entity.ReadingGoal;
import com.booktracker.entity.User;
import com.booktracker.services.ReadingGoalService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/goals")
@CrossOrigin(origins = "http://localhost:4200")
public class ReadingGoalController {

    private final ReadingGoalService readingGoalService;

    public ReadingGoalController(ReadingGoalService readingGoalService) {
        this.readingGoalService = readingGoalService;
    }

    @PostMapping
    public ReadingGoal createGoal(
            @RequestBody GoalRequest request,
            Authentication authentication
    ) {

        User user = (User) authentication.getPrincipal();

        return readingGoalService.createGoal(user, request);
    }

    @GetMapping
    public List<ReadingGoal> getGoals(Authentication authentication) {

        User user = (User) authentication.getPrincipal();

        return readingGoalService.getGoals(user);
    }

    @DeleteMapping("/{id}")
    public void deleteGoal(@PathVariable Long id, Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        readingGoalService.deleteGoal(id, user);
    }

    @PutMapping("/{id}/progress")
    public ReadingGoal updateProgress(
            @PathVariable Long id,
            @RequestParam int pages,
            Authentication authentication
    ) {
        User user = (User) authentication.getPrincipal();
        return readingGoalService.updateProgress(id, pages, user);
    }
    @PutMapping("/progress/all")
    public void updateAllGoals(
            @RequestParam int pages,
            Authentication authentication
    ) {
        User user = (User) authentication.getPrincipal();
        readingGoalService.updateAllGoals(user, pages);
    }


}
