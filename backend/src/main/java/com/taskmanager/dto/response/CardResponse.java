package com.taskmanager.dto.response;

import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CardResponse {
    private Long id;
    private String title;
    private String description;
    private LocalDate dueDate;
    private Integer position;
    private Long listId;
    private UserSummaryResponse assignee;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Set<LabelResponse> labels;
}
