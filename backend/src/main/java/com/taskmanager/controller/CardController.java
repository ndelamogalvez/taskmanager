package com.taskmanager.controller;

import com.taskmanager.dto.request.CardRequest;
import com.taskmanager.dto.request.MoveCardRequest;
import com.taskmanager.dto.response.CardResponse;
import com.taskmanager.model.User;
import com.taskmanager.service.CardService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class CardController {

    private final CardService cardService;

    @PostMapping("/lists/{listId}/cards")
    public ResponseEntity<CardResponse> createCard(@PathVariable Long listId,
                                                   @Valid @RequestBody CardRequest request,
                                                   @AuthenticationPrincipal User user) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(cardService.createCard(listId, request, user.getId()));
    }

    @PutMapping("/cards/{id}")
    public ResponseEntity<CardResponse> updateCard(@PathVariable Long id,
                                                   @Valid @RequestBody CardRequest request,
                                                   @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(cardService.updateCard(id, request, user.getId()));
    }

    @PatchMapping("/cards/{id}/move")
    public ResponseEntity<CardResponse> moveCard(@PathVariable Long id,
                                                 @Valid @RequestBody MoveCardRequest request,
                                                 @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(cardService.moveCard(id, request, user.getId()));
    }

    @DeleteMapping("/cards/{id}")
    public ResponseEntity<Void> deleteCard(@PathVariable Long id, @AuthenticationPrincipal User user) {
        cardService.deleteCard(id, user.getId());
        return ResponseEntity.noContent().build();
    }
}
