
package com.booktracker.controller;
import org.springframework.web.bind.annotation.*;
import java.util.*;
import com.booktracker.entity.Book;
import com.booktracker.repository.BookRepository;

@RestController
@RequestMapping("/api/books")
public class BookController {
 private final BookRepository repo;
 public BookController(BookRepository repo){this.repo=repo;}

 @GetMapping
 public List<Book> getAll(){return repo.findAll();}

 @PostMapping
 public Book add(@RequestBody Book b){return repo.save(b);}
}
