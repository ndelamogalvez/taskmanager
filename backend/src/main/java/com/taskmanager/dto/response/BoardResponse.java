package com.taskmanager.dto.response;

import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class BoardResponse {
    private Long id;
    private String title;
    private String description;
    private Long ownerId;
    private String ownerName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<TaskListResponse> lists;
    private List<MemberResponse> members;
    private List<ActivityLogResponse> activityLogs;
}
