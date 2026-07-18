package com.taskmanager.dto.response;

import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class TaskListResponse {
    private Long id;
    private String title;
    private Integer position;
    private LocalDateTime createdAt;
    private List<CardResponse> cards;
}
