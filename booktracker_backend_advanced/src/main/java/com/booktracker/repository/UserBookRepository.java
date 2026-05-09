package com.booktracker.repository;

import com.booktracker.entity.Book;
import com.booktracker.entity.ReadingStatus;
import com.booktracker.entity.User;
import com.booktracker.entity.UserBook;
import org.springframework.data.jpa.repository.JpaRepository;
<<<<<<< HEAD
import com.booktracker.entity.ReadingStatus;
=======
import org.springframework.data.jpa.repository.Query;

>>>>>>> 19c1aec3bb7fa54a78838a09dcd580e9a579aa2f
import java.util.List;
import java.util.Optional;

public interface UserBookRepository extends JpaRepository<UserBook, Long> {

    Optional<UserBook> findByUserAndBook(User user, Book book);

    List<UserBook> findByUser(User user);

    Optional<UserBook> findByUserIdAndBookId(Long userId, Long bookId);
<<<<<<< HEAD

    List<UserBook> findByUserIdAndStatus(Long userId, ReadingStatus status);
    long countByUserIdAndStatus(Long userId, ReadingStatus status);

=======
    @Query("SELECT COUNT(ub) FROM UserBook ub WHERE ub.user = :user AND ub.status = 'READ' AND YEAR(ub.finishDate) = :year")
    int countBooksReadThisYear(User user, int year);
>>>>>>> 19c1aec3bb7fa54a78838a09dcd580e9a579aa2f
}
