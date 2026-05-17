package com.booktracker.controller;

import com.booktracker.entity.User;
import com.booktracker.model.dto.BookListRequest;
import com.booktracker.model.dto.BookListResponse;
import com.booktracker.repository.UserRepository;
import com.booktracker.services.CustomBookListService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/book-lists")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class CustomBookListController {

    private final CustomBookListService listService;
    private final UserRepository userRepository;

    private Long resolveUserId(String userParam) {
        try {
            return Long.parseLong(userParam);
        } catch (NumberFormatException e) {
            User user = userRepository.findByUsername(userParam)
                    .orElseThrow(() -> new RuntimeException("User not found: " + userParam));
            return user.getId();
        }
    }

    @PostMapping("/init-defaults/user/{userParam}")
    public ResponseEntity<String> initDefaults(@PathVariable String userParam) {
        Long userId = resolveUserId(userParam);
        listService.initDefaultListsIfNotExist(userId);
        return ResponseEntity.ok("Default lists created");
    }

    @PostMapping("/user/{userParam}")
    public ResponseEntity<BookListResponse> createList(
            @PathVariable String userParam,
            @RequestBody BookListRequest request) {
        Long userId = resolveUserId(userParam);
        return ResponseEntity.ok(listService.createList(userId, request));
    }

    @GetMapping("/user/{userParam}")
    public ResponseEntity<List<BookListResponse>> getUserLists(@PathVariable String userParam) {
        Long userId = resolveUserId(userParam);
        return ResponseEntity.ok(listService.getUserLists(userId));
    }

    @PutMapping("/{listId}/user/{userParam}")
    public ResponseEntity<BookListResponse> updateList(
            @PathVariable Long listId,
            @PathVariable String userParam,
            @RequestBody BookListRequest request) {
        Long userId = resolveUserId(userParam);
        return ResponseEntity.ok(listService.updateList(userId, listId, request));
    }

    @DeleteMapping("/{listId}/user/{userParam}")
    public ResponseEntity<String> deleteList(
            @PathVariable Long listId,
            @PathVariable String userParam) {
        Long userId = resolveUserId(userParam);
        listService.deleteList(listId, userId);
        return ResponseEntity.ok("List deleted");
    }

    @PostMapping("/{listId}/books/{bookId}/user/{userParam}")
    public ResponseEntity<String> addBookToList(
            @PathVariable Long listId,
            @PathVariable Long bookId,
            @PathVariable String userParam) {
        Long userId = resolveUserId(userParam);
        listService.addBookToList(listId, bookId, userId);
        return ResponseEntity.ok("Book added");
    }

    @DeleteMapping("/{listId}/books/{bookId}/user/{userParam}")
    public ResponseEntity<String> removeBookFromList(
            @PathVariable Long listId,
            @PathVariable Long bookId,
            @PathVariable String userParam) {
        Long userId = resolveUserId(userParam);
        listService.removeBookFromList(listId, bookId, userId);
        return ResponseEntity.ok("Book removed");
    }

    @GetMapping("/{listId}/books")
    public ResponseEntity<List<Map<String, Object>>> getBooksInList(@PathVariable Long listId) {
        return ResponseEntity.ok(listService.getBooksInList(listId));
    }

    @PutMapping("/{listId}/reorder/user/{userParam}")
    public ResponseEntity<String> reorderBooks(
            @PathVariable Long listId,
            @PathVariable String userParam,
            @RequestBody List<Long> orderedBookIds) {
        Long userId = resolveUserId(userParam);
        listService.reorderBooksInList(listId, userId, orderedBookIds);
        return ResponseEntity.ok("Order updated");
    }
}