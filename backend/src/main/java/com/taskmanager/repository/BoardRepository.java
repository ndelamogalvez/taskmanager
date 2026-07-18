package com.taskmanager.repository;

import com.taskmanager.model.Board;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface BoardRepository extends JpaRepository<Board, Long> {

    @Query("SELECT b FROM Board b LEFT JOIN FETCH b.members m WHERE b.owner.id = :userId OR m.user.id = :userId")
    List<Board> findAllByUserId(@Param("userId") Long userId);
}
