
package com.booktracker.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import com.booktracker.entity.Book;

public interface BookRepository extends JpaRepository<Book, Long> {}
