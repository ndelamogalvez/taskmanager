package com.taskmanager;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.taskmanager.dto.request.LoginRequest;
import com.taskmanager.dto.request.RegisterRequest;
import com.taskmanager.dto.response.AuthResponse;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AuthIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void registerAndLogin() throws Exception {
        RegisterRequest register = new RegisterRequest("Alice", "alice@test.com", "secret1");

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(register)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists())
                .andExpect(jsonPath("$.email").value("alice@test.com"));

        LoginRequest login = new LoginRequest("alice@test.com", "secret1");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(login)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists());
    }

    @Test
    void loginWithInvalidCredentialsReturns401() throws Exception {
        LoginRequest login = new LoginRequest("nobody@test.com", "wrong");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(login)))
                .andExpect(status().isUnauthorized());
    }
}

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class BoardSecurityTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private String registerAndGetToken(String name, String email) throws Exception {
        RegisterRequest register = new RegisterRequest(name, email, "secret1");
        MvcResult result = mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(register)))
                .andExpect(status().isOk())
                .andReturn();
        AuthResponse auth = objectMapper.readValue(result.getResponse().getContentAsString(), AuthResponse.class);
        return auth.getToken();
    }

    @Test
    void userCannotAccessAnotherUsersBoard() throws Exception {
        String ownerToken = registerAndGetToken("Owner", "owner@test.com");
        String otherToken = registerAndGetToken("Other", "other@test.com");

        MvcResult createResult = mockMvc.perform(post("/api/boards")
                        .header("Authorization", "Bearer " + ownerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"title\":\"Private Board\"}"))
                .andExpect(status().isCreated())
                .andReturn();

        Long boardId = objectMapper.readTree(createResult.getResponse().getContentAsString()).get("id").asLong();

        mockMvc.perform(get("/api/boards/" + boardId)
                        .header("Authorization", "Bearer " + otherToken))
                .andExpect(status().isForbidden());
    }
}
