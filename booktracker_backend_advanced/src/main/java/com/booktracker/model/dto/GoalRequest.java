package com.booktracker.model.dto;

public class GoalRequest {
    private int targetPages;
    private String period;

    public int getTargetPages() {
        return targetPages;
    }

    public void setTargetPages(int targetPages) {
        this.targetPages = targetPages;
    }

    public String getPeriod() {
        return period;
    }

    public void setPeriod(String period) {
        this.period = period;
    }
}
