package com.taskmanager.controller;

import com.taskmanager.dto.request.BoardRequest;
import com.taskmanager.dto.response.BoardResponse;
import com.taskmanager.dto.response.BoardSummaryResponse;
import com.taskmanager.model.User;
import com.taskmanager.service.BoardService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/boards")
@RequiredArgsConstructor
public class BoardController {

    private final BoardService boardService;

    @GetMapping
    public ResponseEntity<List<BoardSummaryResponse>> getUserBoards(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(boardService.getUserBoards(user.getId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<BoardResponse> getBoard(@PathVariable Long id, @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(boardService.getBoard(id, user.getId()));
    }

    @PostMapping
    public ResponseEntity<BoardResponse> createBoard(@Valid @RequestBody BoardRequest request,
                                                     @AuthenticationPrincipal User user) {
        return ResponseEntity.status(HttpStatus.CREATED).body(boardService.createBoard(request, user.getId()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<BoardResponse> updateBoard(@PathVariable Long id,
                                                     @Valid @RequestBody BoardRequest request,
                                                     @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(boardService.updateBoard(id, request, user.getId()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBoard(@PathVariable Long id, @AuthenticationPrincipal User user) {
        boardService.deleteBoard(id, user.getId());
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/members")
    public ResponseEntity<BoardResponse> addMember(@PathVariable Long id,
                                                   @RequestBody String email,
                                                   @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(boardService.addMember(id, email.replace("\"", ""), user.getId()));
    }
}
