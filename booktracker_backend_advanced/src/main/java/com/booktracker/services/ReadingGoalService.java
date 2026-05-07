package com.booktracker.services;

import com.booktracker.entity.*;
import com.booktracker.model.dto.GoalRequest;
import com.booktracker.repository.ReadingGoalRepository;
import com.booktracker.repository.UserBookRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class ReadingGoalService {

    private final ReadingGoalRepository goalRepository;
    private final UserBookRepository userBookRepository;

    public ReadingGoalService(ReadingGoalRepository goalRepository,
                              UserBookRepository userBookRepository) {
        this.goalRepository = goalRepository;
        this.userBookRepository = userBookRepository;
    }

    // =========================
    // CREATE GOAL
    // =========================
    public ReadingGoal createGoal(User user, GoalRequest request) {

        ReadingGoal goal = new ReadingGoal();

        goal.setUser(user);
        goal.setTargetValue(request.getTargetValue());
        goal.setMetric(GoalMetric.valueOf(request.getMetric()));
        goal.setCompleted(false);

        GoalType period = GoalType.valueOf(request.getPeriod());
        goal.setPeriod(period);

        LocalDate today = LocalDate.now();
        goal.setStartDate(today);

        switch (period) {
            case DAILY -> goal.setEndDate(today.plusDays(1));
            case WEEKLY -> goal.setEndDate(today.plusWeeks(1));
            case MONTHLY -> goal.setEndDate(today.plusMonths(1));
            case YEARLY -> goal.setEndDate(today.plusYears(1));
        }

        goal.setCurrentValue(0);

        return goalRepository.save(goal);
    }

    // =========================
    // GET GOALS
    // =========================
    public List<ReadingGoal> getGoals(User user) {
        return goalRepository.findByUser(user);
    }

    // =========================
    // DELETE GOAL
    // =========================
    public void deleteGoal(Long id, User user) {

        ReadingGoal goal = goalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Goal not found"));

        if (!goal.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        goalRepository.delete(goal);
    }

    // =========================
    // PAGES PROGRESS UPDATE
    // =========================
    public ReadingGoal updateProgress(Long id, int value, User user) {

        ReadingGoal goal = goalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Goal not found"));

        if (!goal.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        if (goal.getMetric() == GoalMetric.PAGES && !goal.isCompleted()) {

            int updated = goal.getCurrentValue() + value;
            goal.setCurrentValue(updated);

            if (updated >= goal.getTargetValue()) {
                goal.setCompleted(true);
            }
        }

        return goalRepository.save(goal);
    }

    // =========================
    // BOOKS AUTO UPDATE (IMPORTANT)
    // =========================
    public void updateGoalsOnBookFinished(User user, LocalDate finishedDate) {

        List<ReadingGoal> goals = goalRepository.findByUser(user);

        for (ReadingGoal goal : goals) {

            if (goal.getMetric() == GoalMetric.BOOKS
                    && !goal.isCompleted()
                    && !finishedDate.isBefore(goal.getStartDate())
                    && !finishedDate.isAfter(goal.getEndDate())) {

                int updated = goal.getCurrentValue() + 1;
                goal.setCurrentValue(updated);

                if (updated >= goal.getTargetValue()) {
                    goal.setCompleted(true);
                }
            }
        }

        goalRepository.saveAll(goals);
    }

    // =========================
    // PROGRESS PERCENTAGE
    // =========================
    public double getProgress(ReadingGoal goal, User user) {

        if (goal.getTargetValue() == 0) return 0;

        return (double) goal.getCurrentValue() / goal.getTargetValue() * 100;
    }

    // =========================
    // DAILY CHECK (notifications only)
    // =========================
    @Scheduled(cron = "0 10 2 * * ?")
    public void checkGoals() {

        List<ReadingGoal> goals = goalRepository.findAll();

        for (ReadingGoal goal : goals) {

            double progress = getProgress(goal, goal.getUser());

            if (progress < 50) {
                goal.setLastNotification("⚠️ You are behind!");
            } else if (progress >= 100) {
                goal.setLastNotification("🎉 Goal achieved!");
            } else {
                goal.setLastNotification("💪 Keep going!");
            }
        }

        goalRepository.saveAll(goals);
    }

    public void updateAllGoals(User user, int pages) {

        List<ReadingGoal> goals = goalRepository.findByUser(user);

        for (ReadingGoal goal : goals) {

            // seulement objectifs PAGES
            if (goal.getMetric() == GoalMetric.PAGES
                    && !goal.isCompleted()) {

                int updated = goal.getCurrentValue() + pages;

                goal.setCurrentValue(updated);

                if (updated >= goal.getTargetValue()) {
                    goal.setCompleted(true);
                }
            }
        }

        goalRepository.saveAll(goals);
    }
}