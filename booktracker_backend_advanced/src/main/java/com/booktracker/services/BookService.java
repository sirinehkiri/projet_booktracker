package com.booktracker.services;

import com.booktracker.entity.Book;
import com.booktracker.repository.BookRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookService {

    private final BookRepository bookRepository;

    public BookService(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    // GET all books
    public List<Book> getAllBooks(String username) {
        return bookRepository.findAll();
    }

    // GET book by ID
    public Book getBookById(Long id, String username) {

        return bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Book not found"));
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