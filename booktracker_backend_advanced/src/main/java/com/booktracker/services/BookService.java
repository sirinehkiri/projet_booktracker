package com.booktracker.services;

import com.booktracker.entity.Book;
import com.booktracker.entity.Review;
import com.booktracker.entity.User;
import com.booktracker.repository.BookRepository;
import com.booktracker.repository.ReviewVoteRepository;
import com.booktracker.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookService {

    private final BookRepository bookRepository;
    private final UserRepository userRepository;
    private final ReviewVoteRepository reviewVoteRepository;


    public BookService(BookRepository bookRepository, UserRepository userRepository, ReviewVoteRepository reviewVoteRepository) {
        this.bookRepository = bookRepository;
        this.userRepository = userRepository;
        this.reviewVoteRepository = reviewVoteRepository;
    }

    // GET all books
    public List<Book> getAllBooks(String username) {
        return bookRepository.findAll();
    }

    // GET book by ID
    public Book getBookById(Long id, String username) {

        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Book not found: " + id));

        if (username == null) {
            throw new RuntimeException("Username is null (user not authenticated)");
        }

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));

        List<Long> likedIds = reviewVoteRepository.findLikedReviewIds(user);

        for (Review r : book.getReviews()) {
            r.setLiked(likedIds.contains(r.getId()));
        }

        return book;
    }
    // CREATE book
    public Book createBook(Book book, String username) {

        return bookRepository.save(book);
    }

    // UPDATE book
    public Book updateBook(Long id, Book updatedBook, String username) {

        return bookRepository.findById(id)
                .map(book -> {

                    book.setTitle(updatedBook.getTitle());
                    book.setAuthor(updatedBook.getAuthor());
                    book.setGenre(updatedBook.getGenre());
                    book.setYear(updatedBook.getYear());
                    book.setDescription(updatedBook.getDescription());
                    book.setPic(updatedBook.getPic());
                    book.setLangue(updatedBook.getLangue());
                    book.setTotal_pages(updatedBook.getTotal_pages());

                    return bookRepository.save(book);

                }).orElseThrow(() -> new RuntimeException("Book not found with id " + id));
    }

    // DELETE book
    public void deleteBook(Long id, String username) {

        if (!bookRepository.existsById(id)) {
            throw new RuntimeException("Book not found with id " + id);
        }

        bookRepository.deleteById(id);
    }
}