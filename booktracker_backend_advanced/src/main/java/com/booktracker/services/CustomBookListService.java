package com.booktracker.services;

import com.booktracker.entity.Book;
import com.booktracker.entity.BookList;
import com.booktracker.entity.User;
import com.booktracker.model.dto.BookListRequest;
import com.booktracker.model.dto.BookListResponse;
import com.booktracker.repository.BookListRepository;
import com.booktracker.repository.BookRepository;
import com.booktracker.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class CustomBookListService {

    private final BookListRepository listRepo;
    private final UserRepository userRepo;
    private final BookRepository bookRepo;

    public void createDefaultLists(User user) {
        List<String> defaults = List.of("To Read", "To Gift", "To Re-read");
        for (int i = 0; i < defaults.size(); i++) {
            BookList list = new BookList();
            list.setUser(user);
            list.setName(defaults.get(i));
            list.setPosition(i);
            list.setIsDefault(true);
            listRepo.save(list);
        }
        System.out.println("✅ 3 default lists created for user: " + user.getId());
    }

    public void initDefaultListsIfNotExist(Long userId) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<String> defaults = List.of("To Read", "To Gift", "To Re-read");
        int created = 0;
        for (int i = 0; i < defaults.size(); i++) {
            String name = defaults.get(i);
            if (!listRepo.existsByUserIdAndNameIgnoreCase(userId, name)) {
                BookList list = new BookList();
                list.setUser(user);
                list.setName(name);
                list.setPosition(i);
                list.setIsDefault(true);
                listRepo.save(list);
                created++;
            }
        }
        System.out.println("✅ " + created + " default lists initialized for user: " + userId);
    }

    public List<BookListResponse> getUserLists(Long userId) {
        List<BookList> lists = listRepo.findByUserIdOrderByPositionAsc(userId);
        return lists.stream().map(this::toResponse).collect(Collectors.toList());
    }

    public BookListResponse createList(Long userId, BookListRequest req) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (req.getName() == null || req.getName().trim().isEmpty()) {
            throw new RuntimeException("Name is required");
        }

        if (listRepo.existsByUserIdAndNameIgnoreCase(userId, req.getName().trim())) {
            throw new RuntimeException("A list with this name already exists");
        }

        int nextPosition = listRepo.findByUserIdOrderByPositionAsc(userId).size();

        BookList list = new BookList();
        list.setUser(user);
        list.setName(req.getName().trim());
        list.setDescription(req.getDescription());
        list.setPosition(nextPosition);
        list.setIsDefault(false);

        return toResponse(listRepo.save(list));
    }

    public BookListResponse updateList(Long userId, Long listId, BookListRequest req) {
        BookList list = listRepo.findByIdAndUserId(listId, userId)
                .orElseThrow(() -> new RuntimeException("List not found"));

        if (req.getName() != null && !req.getName().trim().isEmpty()) {
            list.setName(req.getName().trim());
        }
        list.setDescription(req.getDescription());

        return toResponse(listRepo.save(list));
    }

    public void deleteList(Long listId, Long userId) {
        BookList list = listRepo.findByIdAndUserId(listId, userId)
                .orElseThrow(() -> new RuntimeException("List not found"));
        listRepo.delete(list);
    }

    public void addBookToList(Long listId, Long bookId, Long userId) {
        BookList list = listRepo.findByIdAndUserId(listId, userId)
                .orElseThrow(() -> new RuntimeException("List not found"));

        Book book = bookRepo.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Book not found"));

        if (list.getBooks().contains(book)) {
            throw new RuntimeException("This book is already in this list");
        }

        list.getBooks().add(book);
        listRepo.save(list);
        System.out.println("✅ Book " + bookId + " added to list '" + list.getName() + "'");
    }

    public void removeBookFromList(Long listId, Long bookId, Long userId) {
        BookList list = listRepo.findByIdAndUserId(listId, userId)
                .orElseThrow(() -> new RuntimeException("List not found"));

        Book book = bookRepo.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Book not found"));

        list.getBooks().remove(book);
        listRepo.save(list);
        System.out.println("✅ Book " + bookId + " removed from '" + list.getName() + "'");
    }

    public List<Map<String, Object>> getBooksInList(Long listId) {
        BookList list = listRepo.findById(listId)
                .orElseThrow(() -> new RuntimeException("List not found"));

        List<Book> books = list.getBooks();
        System.out.println("📚 GET books from list '" + list.getName() + "': " + books.size() + " books");

        List<Map<String, Object>> result = new ArrayList<>();
        for (Book book : books) {
            Map<String, Object> bookMap = new HashMap<>();
            bookMap.put("id", book.getId());
            bookMap.put("title", book.getTitle());
            bookMap.put("author", book.getAuthor());
            bookMap.put("genre", book.getGenre());
            bookMap.put("year", book.getYear());
            bookMap.put("description", book.getDescription());
            bookMap.put("pic", book.getPic());
            bookMap.put("langue", book.getLangue());
            bookMap.put("total_pages", book.getTotal_pages());
            result.add(bookMap);
        }
        return result;
    }

    public void reorderBooksInList(Long listId, Long userId, List<Long> orderedBookIds) {
        BookList list = listRepo.findByIdAndUserId(listId, userId)
                .orElseThrow(() -> new RuntimeException("List not found"));
        System.out.println("⚠️ Reorder in memory only");
    }

    private BookListResponse toResponse(BookList list) {
        return BookListResponse.builder()
                .id(list.getId())
                .name(list.getName())
                .description(list.getDescription())
                .position(list.getPosition())
                .isDefault(list.getIsDefault())
                .createdAt(list.getCreatedAt())
                .build();
    }
}