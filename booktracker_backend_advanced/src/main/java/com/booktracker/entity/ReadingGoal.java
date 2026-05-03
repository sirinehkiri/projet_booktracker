package com.booktracker.entity;

import jakarta.persistence.*;

@Entity
public class ReadingGoal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int targetPages;

    @Enumerated(EnumType.STRING)
    private PeriodType period;

    @ManyToOne
    private User user;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public int getTargetPages() {
        return targetPages;
    }

    public void setTargetPages(int targetPages) {
        this.targetPages = targetPages;
    }

    public PeriodType getPeriod() {
        return period;
    }

    public void setPeriod(PeriodType period) {
        this.period = period;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
