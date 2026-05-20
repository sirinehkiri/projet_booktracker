package com.booktracker.services;

import com.booktracker.entity.Reply;
import com.booktracker.entity.Review;
import com.booktracker.entity.User;
import com.booktracker.model.dto.ReplyRequest;
import com.booktracker.repository.ReplyRepository;
import com.booktracker.repository.ReviewRepository;
import com.booktracker.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ReplyService {

    private final ReplyRepository replyRepository;
    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;

    // =========================
    // ADD REPLY
    // =========================

    public Reply addReply(
            Long reviewId,
            ReplyRequest request,
            String username
    ) {

        User user = userRepository
                .findByUsername(username)
                .orElseThrow();

        Review review = reviewRepository
                .findById(reviewId)
                .orElseThrow();

        Reply reply = new Reply();

        reply.setContent(request.getContent());

        reply.setCreatedAt(LocalDateTime.now());

        reply.setUser(user);

        reply.setReview(review);

        return replyRepository.save(reply);
    }

    // =========================
    // DELETE
    // =========================

    public void deleteReply(
            Long id,
            String username
    ) {

        Reply reply = replyRepository
                .findById(id)
                .orElseThrow();

        if (!reply.getUser()
                .getUsername()
                .equals(username)) {

            throw new RuntimeException(
                    "Unauthorized"
            );
        }

        replyRepository.delete(reply);
    }
}