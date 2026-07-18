package com.taskmanager.dto.response;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AuthResponse {
    private String token;
    @Builder.Default private String type = "Bearer";
    private Long id;
    private String name;
    private String email;

    public AuthResponse(String token, Long id, String name, String email) {
        this.token = token;
        this.type = "Bearer";
        this.id = id;
        this.name = name;
        this.email = email;
    }
}
