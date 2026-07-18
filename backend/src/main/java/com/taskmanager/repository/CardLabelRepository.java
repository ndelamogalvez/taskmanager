package com.taskmanager.repository;

import com.taskmanager.model.CardLabel;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CardLabelRepository extends JpaRepository<CardLabel, Long> {
    void deleteByCardId(Long cardId);
}
