package com.booktracker.services;

import com.booktracker.entity.*;
import com.booktracker.repository.BookRepository;
import com.booktracker.repository.UserBookRepository;
import com.booktracker.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@AllArgsConstructor
public class UserBookService {

    private final UserBookRepository repo;
    private final BookRepository bookRepo;
    private final UserRepository userRepo;
    private final ReadingGoalService readingGoalService; // 🔥 AJOUT

    public UserBook setStatus(Long userId, Long bookId, ReadingStatus status) {

        User user = userRepo.findById(userId).orElseThrow();
        Book book = bookRepo.findById(bookId).orElseThrow();

        UserBook existing = repo.findByUserAndBook(user, book).orElse(null);

        LocalDate now = LocalDate.now();

        if (existing != null) {

            ReadingStatus oldStatus = existing.getStatus(); // 🔥 important

            existing.setStatus(status);

            if (status == ReadingStatus.READ) {
                existing.setFinishDate(now);

                // 🔥 mise à jour automatique des goals
                if (oldStatus != ReadingStatus.READ) {
                    readingGoalService.updateGoalsOnBookFinished(user, now);
                }

            } else {
                existing.setFinishDate(null);
            }

            return repo.save(existing);
        }

        UserBook ub = new UserBook();
        ub.setUser(user);
        ub.setBook(book);
        ub.setStatus(status);
        ub.setTotalPages(book.getTotal_pages());

        if (status == ReadingStatus.READ) {
            ub.setFinishDate(now);

            // 🔥 update goals immédiat
            readingGoalService.updateGoalsOnBookFinished(user, now);
        }

        return repo.save(ub);
    }

    public List<UserBook> getUserBooks(Long userId) {
        User user = userRepo.findById(userId).orElseThrow();
        return repo.findByUser(user);
    }

    public ReadingStatus getStatus(Long userId, Long bookId) {
        return repo.findByUserIdAndBookId(userId, bookId)
                .map(UserBook::getStatus)
                .orElse(ReadingStatus.WANT_TO_READ);
    }

    public UserBook getUserBook(Long userId, Long bookId) {
        return repo.findByUserIdAndBookId(userId, bookId)
                .orElse(null);
    }

    public void deleteBook(Long id) {

        UserBook book = repo.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Book not found"));

        repo.delete(book);
    }
}