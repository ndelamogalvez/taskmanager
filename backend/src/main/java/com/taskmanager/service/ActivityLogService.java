package com.taskmanager.service;

import com.taskmanager.dto.response.ActivityLogResponse;
import com.taskmanager.model.ActivityLog;
import com.taskmanager.model.Board;
import com.taskmanager.model.User;
import com.taskmanager.repository.ActivityLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ActivityLogService {

    private final ActivityLogRepository activityLogRepository;

    public void log(Board board, User user, String action, String entityType, Long entityId, String details) {
        ActivityLog log = ActivityLog.builder()
                .board(board)
                .user(user)
                .action(action)
                .entityType(entityType)
                .entityId(entityId)
                .details(details)
                .build();
        activityLogRepository.save(log);
    }

    public List<ActivityLogResponse> getBoardActivity(Long boardId) {
        return activityLogRepository.findByBoardIdOrderByCreatedAtDesc(boardId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    private ActivityLogResponse toResponse(ActivityLog log) {
        return ActivityLogResponse.builder()
                .id(log.getId())
                .userId(log.getUser().getId())
                .userName(log.getUser().getName())
                .action(log.getAction())
                .entityType(log.getEntityType())
                .entityId(log.getEntityId())
                .details(log.getDetails())
                .createdAt(log.getCreatedAt())
                .build();
    }
}
