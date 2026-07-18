package com.taskmanager.dto.response;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class UserSummaryResponse {
    private Long id;
    private String name;
    private String email;
}
