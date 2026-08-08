package com.taskmanager.dto.request;

import jakarta.validation.constraints.NotEmpty;
import lombok.*;
import java.util.List;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class ReorderCardsRequest {
    @NotEmpty
    private List<Long> cardIds;
}
