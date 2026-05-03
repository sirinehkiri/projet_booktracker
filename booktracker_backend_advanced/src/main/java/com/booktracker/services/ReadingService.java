package com.booktracker.services;

import com.booktracker.entity.*;
import com.booktracker.model.dto.GoalRequest;
import com.booktracker.repository.ReadingGoalRepository;
import com.booktracker.repository.ReadingProgressRepository;
import com.booktracker.repository.UserBookRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import com.booktracker.model.dto.ProgressRequest;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class ReadingService {

    private final UserBookRepository userBookRepository;
    private final ReadingProgressRepository progressRepository;
    private final ReadingGoalRepository goalRepository;

    public void updateProgress(ProgressRequest req) {
        System.out.println("ID reçu = " + req.getUserBookId());
        UserBook userBook = userBookRepository.findById(req.getUserBookId())
                .orElseThrow();
        if (userBook == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "UserBook not found");
        }

        userBook.setPagesRead(userBook.getPagesRead() + req.getPagesRead());
        userBookRepository.save(userBook);

        ReadingProgress progress = new ReadingProgress();
        progress.setDate(LocalDate.now());
        progress.setPagesRead(req.getPagesRead());
        progress.setUserBook(userBook);

        progressRepository.save(progress);
    }

    public void setGoal(GoalRequest req, User user) {
        ReadingGoal goal = new ReadingGoal();
        goal.setTargetPages(req.getTargetPages());
        goal.setPeriod(PeriodType.valueOf(req.getPeriod()));
        goal.setUser(user);

        goalRepository.save(goal);
    }
}
