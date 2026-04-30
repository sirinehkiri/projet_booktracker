package com.booktracker.controller;

import com.booktracker.entity.ReadingStatus;
import com.booktracker.entity.User;
import com.booktracker.entity.UserBook;
import com.booktracker.repository.UserRepository;
import com.booktracker.services.UserBookService;
import lombok.AllArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/userbooks")
@AllArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class UserBookController {

    private UserBookService service;
    private UserRepository userRepository;

    @PostMapping("/status")
    public UserBook setStatus(@RequestParam Long bookId,
                              @RequestParam ReadingStatus status,
                              @AuthenticationPrincipal User user) {

        return service.setStatus(user.getId(), bookId, status);
    }

    @GetMapping("/{userId}")
    public List<UserBook> getUserBooks(@PathVariable Long userId) {
        return service.getUserBooks(userId);
    }

    @GetMapping("/status")
    public ReadingStatus getStatus(@RequestParam Long bookId,
                                   @AuthenticationPrincipal User user) {

        return service.getStatus(user.getId(), bookId);
    }
}
