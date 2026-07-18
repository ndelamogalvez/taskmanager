package com.taskmanager.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;
import java.time.LocalDate;
import java.util.Set;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class CardRequest {
    @NotBlank
    private String title;

    private String description;
    private LocalDate dueDate;
    private Long assigneeId;
    private Set<LabelRequest> labels;

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor
    public static class LabelRequest {
        private String name;
        private String color;
    }
}
