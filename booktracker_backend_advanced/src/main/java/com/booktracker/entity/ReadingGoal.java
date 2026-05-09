package com.booktracker.entity;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
public class ReadingGoal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int currentValue;
    private String lastNotification;

    private LocalDate startDate;

    private LocalDate endDate;

    private boolean completed;

    private int targetValue; // ex: 30 (livres ou pages)
    @Enumerated(EnumType.STRING)
    private GoalMetric metric; // PAGES ou BOOKS

    @Enumerated(EnumType.STRING)
    private GoalType period;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    public ReadingGoal() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public int getTargetValue() {
        return targetValue;
    }

    public void setTargetValue(int targetValue) {
        this.targetValue = targetValue;
    }

    public GoalMetric getMetric() {
        return metric;
    }

    public void setMetric(GoalMetric metric) {
        this.metric = metric;
    }

    public int getCurrentValue() {
        return currentValue;
    }

    public void setCurrentValue(int currentValue) {
        this.currentValue = currentValue;
    }

    public String getLastNotification() {
        return lastNotification;
    }

    public void setLastNotification(String lastNotification) {
        this.lastNotification = lastNotification;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public boolean isCompleted() {
        return completed;
    }

    public void setCompleted(boolean completed) {
        this.completed = completed;
    }

    public GoalType getPeriod() {
        return period;
    }

    public void setPeriod(GoalType period) {
        this.period = period;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}