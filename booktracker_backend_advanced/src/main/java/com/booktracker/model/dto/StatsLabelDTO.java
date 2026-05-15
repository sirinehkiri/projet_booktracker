package com.booktracker.model.dto;


public class StatsLabelDTO{

    private String label;

    private Long total;

    public StatsLabelDTO() {
    }

    public StatsLabelDTO(String label, Long total) {
        this.label = label;
        this.total = total;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public Long getTotal() {
        return total;
    }

    public void setTotal(Long total) {
        this.total = total;
    }
}
