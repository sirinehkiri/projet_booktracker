package com.booktracker.model.dto;

public class MonthlyStatsDTO {

    private String month;

    private Long total;

    public MonthlyStatsDTO() {
    }

    public MonthlyStatsDTO(String month, Long total) {
        this.month = month;
        this.total = total;
    }

    public String getMonth() {
        return month;
    }

    public void setMonth(String month) {
        this.month = month;
    }

    public Long getTotal() {
        return total;
    }

    public void setTotal(Long total) {
        this.total = total;
    }
}