package com.taskmanager.repository;

import com.taskmanager.model.ActivityLog;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ActivityLogRepository extends JpaRepository<ActivityLog, Long> {
    List<ActivityLog> findByBoardIdOrderByCreatedAtDesc(Long boardId);
}
