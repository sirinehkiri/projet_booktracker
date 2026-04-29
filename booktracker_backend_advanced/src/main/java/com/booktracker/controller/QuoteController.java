package com.booktracker.controller;

import com.booktracker.entity.Book;
import com.booktracker.entity.Quote;
import com.booktracker.entity.User;
import com.booktracker.repository.BookRepository;
import com.booktracker.repository.QuoteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/quotes")
@CrossOrigin(origins = "http://localhost:4200")
public class QuoteController {

    @Autowired
    private QuoteRepository quoteRepository;

    @Autowired
    private BookRepository bookRepository;

    @PostMapping("/{bookId}")
    public Quote addQuote(@PathVariable Long bookId,
                          @RequestBody Quote quote,
                          @AuthenticationPrincipal User user){

        Book book = bookRepository.findById(bookId).orElseThrow();

        quote.setBook(book);
        quote.setUser(user);

        return quoteRepository.save(quote);
    }
}
