package com.taskmanager.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class ReorderListRequest {
    @NotNull
    private Integer newPosition;
}
