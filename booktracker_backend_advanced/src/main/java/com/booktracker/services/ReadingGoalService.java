package com.booktracker.services;

import com.booktracker.model.dto.GoalRequest;
import com.booktracker.entity.GoalType;
import com.booktracker.entity.ReadingGoal;
import com.booktracker.entity.User;
import com.booktracker.repository.ReadingGoalRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class ReadingGoalService {

    private final ReadingGoalRepository goalRepository;

    public ReadingGoalService(ReadingGoalRepository goalRepository) {
        this.goalRepository = goalRepository;
    }

    public ReadingGoal createGoal(User user, GoalRequest request) {

        ReadingGoal goal = new ReadingGoal();

        goal.setUser(user);

        goal.setTargetPages(request.getTargetPages());

        goal.setCurrentPages(0);

        goal.setCompleted(false);

        GoalType period = GoalType.valueOf(request.getPeriod());

        goal.setPeriod(period);

        LocalDate today = LocalDate.now();

        goal.setStartDate(today);

        switch (period) {

            case DAILY:
                goal.setEndDate(today.plusDays(1));
                break;

            case WEEKLY:
                goal.setEndDate(today.plusWeeks(1));
                break;

            case MONTHLY:
                goal.setEndDate(today.plusMonths(1));
                break;
        }

        return goalRepository.save(goal);
    }

    public List<ReadingGoal> getGoals(User user) {
        return goalRepository.findByUser(user);
    }

    public void deleteGoal(Long id, User user) {
        ReadingGoal goal = goalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Goal not found"));

        if (!goal.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        goalRepository.delete(goal);
    }

    public ReadingGoal updateProgress(Long id, int pages,User user) {

        ReadingGoal goal = goalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Goal not found"));
        if (!goal.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }
        goal.setCurrentPages(goal.getCurrentPages() + pages);

        if (goal.getCurrentPages() >= goal.getTargetPages()) {
            goal.setCompleted(true);
        }

        return goalRepository.save(goal);
    }
}