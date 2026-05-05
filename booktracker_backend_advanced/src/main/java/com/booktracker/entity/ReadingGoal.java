package com.booktracker.entity;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
public class ReadingGoal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int targetPages;

    private int currentPages;

    private LocalDate startDate;

    private LocalDate endDate;

    private boolean completed;

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

    public int getTargetPages() {
        return targetPages;
    }

    public void setTargetPages(int targetPages) {
        this.targetPages = targetPages;
    }

    public int getCurrentPages() {
        return currentPages;
    }

    public void setCurrentPages(int currentPages) {
        this.currentPages = currentPages;
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