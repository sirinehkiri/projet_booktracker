package com.booktracker.services;

import com.booktracker.entity.Quote;
import com.booktracker.entity.User;
import com.booktracker.repository.QuoteRepository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class QuoteService {

    private final QuoteRepository quoteRepository;

    public QuoteService(
            QuoteRepository quoteRepository
    ) {
        this.quoteRepository = quoteRepository;
    }

    public Map<String, Object> voteQuote(
            Long quoteId,
            User user
    ) {

        Quote quote =
                quoteRepository.findById(quoteId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Quote not found"
                                ));

        boolean liked;

        if (quote.getLikedBy().contains(user)) {

            quote.getLikedBy().remove(user);

            liked = false;

        } else {

            quote.getLikedBy().add(user);

            liked = true;
        }

        quote.setLikesCount(
                quote.getLikedBy().size()
        );

        quoteRepository.save(quote);

        Map<String, Object> response =
                new HashMap<>();

        response.put("liked", liked);

        response.put(
                "likesCount",
                quote.getLikesCount()
        );

        return response;
    }
}