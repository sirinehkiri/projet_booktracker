package com.booktracker.services;

import com.booktracker.entity.*;
import com.booktracker.model.dto.GoalRequest;
import com.booktracker.repository.ReadingGoalRepository;
import com.booktracker.repository.UserBookRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import com.booktracker.entity.Notification;
import com.booktracker.repository.NotificationRepository;

import java.time.LocalDate;
import java.util.List;

@Service
public class ReadingGoalService {

    private final ReadingGoalRepository goalRepository;
    private final UserBookRepository userBookRepository;
    private final NotificationRepository notificationRepository;

    public ReadingGoalService(ReadingGoalRepository goalRepository,
                              UserBookRepository userBookRepository, NotificationRepository notificationRepository) {
        this.goalRepository = goalRepository;
        this.userBookRepository = userBookRepository;
        this.notificationRepository = notificationRepository;
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

                createNotification(
                        user,
                        "🎉 Congratulations! Goal achieved!"
                );

            } else {

                double percent =
                        (double) updated / goal.getTargetValue() * 100;

                if (percent >= 75) {

                    createNotification(
                            user,
                            "🔥 You are almost there! " +
                                    (int) percent + "% completed"
                    );

                } else if (percent >= 50) {

                    createNotification(
                            user,
                            "💪 Great progress! Keep reading!"
                    );

                } else if (percent >= 25) {

                    createNotification(
                            user,
                            "📚 Nice start on your reading goal!"
                    );
                }
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
    // DAILY CHECK (notifications only)

    @Scheduled(cron = "0 9 23 * * ?") // chaque jour à 20h
    public void sendDailyMotivation() {

        List<ReadingGoal> goals = goalRepository.findAll();

        LocalDate today = LocalDate.now();

        for (ReadingGoal goal : goals) {

            if (goal.isCompleted()) continue;

            double progress =
                    (double) goal.getCurrentValue()
                            / goal.getTargetValue()
                            * 100;

            int daysLeft =
                    (int) (goal.getEndDate().toEpochDay()
                            - today.toEpochDay());

            // =====================================
            // 1. RAPPEL SI PAS ASSEZ ACTIF
            // =====================================
            if (progress == 0) {

                createNotification(goal.getUser(),
                        "📖 N’oublie pas de commencer ton objectif de lecture !");
            }

            else if (progress < 20 && daysLeft <= 3) {

                createNotification(goal.getUser(),
                        "⏳ Tu dois accélérer ton rythme de lecture !");
            }

            // =====================================
            // 2. ENCOURAGEMENTS
            // =====================================
            else if (progress >= 20 && progress < 50) {

                createNotification(goal.getUser(),
                        "💪 Bon début ! Continue comme ça !");
            }

            else if (progress >= 50 && progress < 80) {

                createNotification(goal.getUser(),
                        "🔥 Tu es à mi-chemin de ton objectif !");
            }

            // =====================================
            // 3. MOTIVATION FINALE
            // =====================================
            else if (progress >= 80 && progress < 100) {

                createNotification(goal.getUser(),
                        "🚀 Plus que quelques pages pour réussir !");
            }

            // =====================================
            // 4. OBJECTIF PRESQUE TERMINÉ
            // =====================================
            if (progress >= 90) {

                createNotification(goal.getUser(),
                        "🏁 Tu es tout proche de ton objectif !");
            }
        }
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


    private void createNotification(User user, String message) {

        boolean exists =
                notificationRepository
                        .existsByUserAndMessage(user, message);

        if (!exists) {

            Notification notification = new Notification();

            notification.setUser(user);
            notification.setMessage(message);

            notificationRepository.save(notification);
        }
    }
}