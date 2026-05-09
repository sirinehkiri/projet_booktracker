package com.booktracker.model.dto;

import lombok.Data;
import java.util.List;

@Data
public class GroupCreateRequest {
    private String name;
    private List<Long> memberIds;
}