package com.booktracker.services;

import com.booktracker.entity.Book;
import com.booktracker.entity.ReadingStatus;
import com.booktracker.entity.User;
import com.booktracker.entity.UserBook;
import com.booktracker.repository.BookRepository;
import com.booktracker.repository.UserBookRepository;
import com.booktracker.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class UserBookService {

    private UserBookRepository repo;
    private BookRepository bookRepo;
    private UserRepository userRepo;

    public UserBook setStatus(Long userId, Long bookId, ReadingStatus status) {

        User user = userRepo.findById(userId).orElseThrow();
        Book book = bookRepo.findById(bookId).orElseThrow();

        UserBook existing = repo.findByUserAndBook(user, book).orElse(null);

        if (existing != null) {
            existing.setStatus(status);
            return repo.save(existing);
        }

        UserBook ub = new UserBook();
        ub.setUser(user);
        ub.setBook(book);
        ub.setStatus(status);

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
}
