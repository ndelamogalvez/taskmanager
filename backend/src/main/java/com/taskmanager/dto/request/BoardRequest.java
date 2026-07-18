package com.taskmanager.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class BoardRequest {
    @NotBlank
    private String title;

    private String description;
}
