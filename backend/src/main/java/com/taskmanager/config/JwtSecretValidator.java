package com.taskmanager.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;
import jakarta.annotation.PostConstruct;

@Component
@Profile("prod")
public class JwtSecretValidator {

    @Value("${app.jwt.secret:}")
    private String secret;

    @PostConstruct
    void validate() {
        if (secret == null || secret.isBlank()) {
            throw new IllegalStateException("JWT_SECRET environment variable must be set in production");
        }
    }
}
