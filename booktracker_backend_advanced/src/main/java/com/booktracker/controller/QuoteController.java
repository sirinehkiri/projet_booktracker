package com.booktracker.controller;

import com.booktracker.entity.Book;
import com.booktracker.entity.Quote;
import com.booktracker.entity.User;
import com.booktracker.model.dto.QuoteRequest;
import com.booktracker.repository.BookRepository;
import com.booktracker.repository.QuoteRepository;
import com.booktracker.repository.UserRepository;
import com.booktracker.services.QuoteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/quotes")
@CrossOrigin(origins = "http://localhost")
public class QuoteController {

    @Autowired
    private QuoteRepository quoteRepository;

    @Autowired
    private BookRepository bookRepository;
    @Autowired
    private final UserRepository userRepository;
    private final QuoteService quoteService;

    public QuoteController(UserRepository userRepository, QuoteService quoteService) {
        this.userRepository = userRepository;
        this.quoteService = quoteService;
    }

    @PostMapping("/{bookId}")
    public Quote addQuote(@PathVariable Long bookId,
                          @RequestBody Quote quote,
                          @AuthenticationPrincipal User user){

        Book book = bookRepository.findById(bookId).orElseThrow();

        quote.setBook(book);
        quote.setUser(user);

        return quoteRepository.save(quote);
    }

    @PostMapping("/{id}/vote")
    public ResponseEntity<?> voteQuote(
            @PathVariable Long id,
            Authentication authentication
    ) {

        User user =
                userRepository
                        .findByUsername(
                                ((User) authentication.getPrincipal()).getUsername()
                        )
                        .orElseThrow();

        return ResponseEntity.ok(
                quoteService.voteQuote(id, user)
        );
    }

    @PutMapping("/{id}")
    public Quote updateQuote(
            @PathVariable Long id,
            @RequestBody QuoteRequest request,
            Authentication authentication
    ) {

        return quoteService.updateQuote(
                id,
                request,
                ((User) authentication.getPrincipal()).getUsername()
        );
    }

    @DeleteMapping("/{id}")
    public void deleteQuote(
            @PathVariable Long id,
            Authentication authentication
    ) {

        quoteService.deleteQuote(
                id,
                ((User) authentication.getPrincipal()).getUsername()
        );
    }
}
