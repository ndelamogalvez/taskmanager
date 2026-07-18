package com.taskmanager.repository;

import com.taskmanager.model.Card;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface CardRepository extends JpaRepository<Card, Long> {
    List<Card> findByTaskListIdOrderByPositionAsc(Long taskListId);

    @Modifying
    @Query("UPDATE Card c SET c.position = c.position + 1 WHERE c.taskList.id = :listId AND c.position >= :position")
    void shiftPositions(@Param("listId") Long listId, @Param("position") Integer position);

    @Query("SELECT COALESCE(MAX(c.position), -1) FROM Card c WHERE c.taskList.id = :listId")
    int findMaxPositionByListId(@Param("listId") Long listId);
}
