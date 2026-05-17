package com.booktracker.model.dto;

import lombok.Data;

@Data
public class BookListRequest {
    private String name;
    private String description;
}