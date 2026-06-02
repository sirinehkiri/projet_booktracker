package com.booktracker.controller;

import com.booktracker.entity.Reply;
import com.booktracker.entity.User;
import com.booktracker.model.dto.ReplyRequest;
import com.booktracker.services.ReplyService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/replies")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost")
public class ReplyController {

    private final ReplyService replyService;

    // =========================
    // ADD
    // =========================

    @PostMapping("/{reviewId}")
    public Reply addReply(
            @PathVariable Long reviewId,
            @RequestBody ReplyRequest request,
            Authentication authentication
    ) {

        return replyService.addReply(
                reviewId,
                request,
                ((User) authentication.getPrincipal()).getUsername()
        );
    }

    // =========================
    // DELETE
    // =========================

    @DeleteMapping("/{id}")
    public void deleteReply(
            @PathVariable Long id,
            Authentication authentication
    ) {

        replyService.deleteReply(
                id,
                ((User) authentication.getPrincipal()).getUsername()
        );
    }
}