package com.taskmanager.dto.response;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class MemberResponse {
    private Long id;
    private Long userId;
    private String name;
    private String email;
    private String role;
}
