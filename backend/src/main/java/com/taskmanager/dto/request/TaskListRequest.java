package com.taskmanager.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class TaskListRequest {
    @NotBlank
    private String title;
}
