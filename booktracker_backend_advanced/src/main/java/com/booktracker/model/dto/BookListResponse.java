package com.booktracker.model.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookListResponse {
    private Long id;
    private String name;
    private String description;
    private Integer position;
    private Boolean isDefault;
    private LocalDateTime createdAt;
}