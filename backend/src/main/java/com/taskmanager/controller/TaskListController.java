package com.taskmanager.controller;

import com.taskmanager.dto.request.ReorderListRequest;
import com.taskmanager.dto.request.TaskListRequest;
import com.taskmanager.dto.response.TaskListResponse;
import com.taskmanager.model.User;
import com.taskmanager.service.TaskListService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class TaskListController {

    private final TaskListService taskListService;

    @PostMapping("/boards/{boardId}/lists")
    public ResponseEntity<TaskListResponse> createList(@PathVariable Long boardId,
                                                       @Valid @RequestBody TaskListRequest request,
                                                       @AuthenticationPrincipal User user) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(taskListService.createList(boardId, request, user.getId()));
    }

    @PutMapping("/lists/{id}")
    public ResponseEntity<TaskListResponse> updateList(@PathVariable Long id,
                                                       @Valid @RequestBody TaskListRequest request,
                                                       @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(taskListService.updateList(id, request, user.getId()));
    }

    @PatchMapping("/lists/{id}/reorder")
    public ResponseEntity<TaskListResponse> reorderList(@PathVariable Long id,
                                                        @Valid @RequestBody ReorderListRequest request,
                                                        @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(taskListService.reorderList(id, request, user.getId()));
    }

    @DeleteMapping("/lists/{id}")
    public ResponseEntity<Void> deleteList(@PathVariable Long id, @AuthenticationPrincipal User user) {
        taskListService.deleteList(id, user.getId());
        return ResponseEntity.noContent().build();
    }
}
