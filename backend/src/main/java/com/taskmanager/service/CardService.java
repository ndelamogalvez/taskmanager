package com.taskmanager.service;

import com.taskmanager.dto.request.CardRequest;
import com.taskmanager.dto.request.MoveCardRequest;
import com.taskmanager.dto.response.CardResponse;
import com.taskmanager.dto.response.LabelResponse;
import com.taskmanager.dto.response.UserSummaryResponse;
import com.taskmanager.exception.ResourceNotFoundException;
import com.taskmanager.exception.UnauthorizedException;
import com.taskmanager.model.*;
import com.taskmanager.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CardService {

    private final CardRepository cardRepository;
    private final TaskListRepository taskListRepository;
    private final UserRepository userRepository;
    private final BoardMemberRepository boardMemberRepository;
    private final ActivityLogService activityLogService;

    @Transactional
    public CardResponse createCard(Long listId, CardRequest request, Long userId) {
        TaskList list = findList(listId);
        validateMember(list.getBoard(), userId);

        int position = cardRepository.findMaxPositionByListId(listId) + 1;

        Card card = Card.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .dueDate(request.getDueDate())
                .position(position)
                .taskList(list)
                .build();

        if (request.getAssigneeId() != null) {
            User assignee = findUser(request.getAssigneeId());
            validateMember(list.getBoard(), assignee.getId());
            card.setAssignee(assignee);
        }

        card = cardRepository.save(card);

        if (request.getLabels() != null) {
            for (CardRequest.LabelRequest lr : request.getLabels()) {
                card.getLabels().add(CardLabel.builder()
                        .name(lr.getName())
                        .color(lr.getColor())
                        .card(card)
                        .build());
            }
        }

        card = cardRepository.save(card);

        String details = "Created card \"" + card.getTitle() + "\" in list \"" + list.getTitle() + "\"";
        if (card.getAssignee() != null) {
            details += " assigned to " + card.getAssignee().getName();
        }
        activityLogService.log(list.getBoard(), findUser(userId), "created_card", "CARD", card.getId(), details);
        return toResponse(card);
    }

    @Transactional
    public CardResponse updateCard(Long cardId, CardRequest request, Long userId) {
        Card card = findCard(cardId);
        validateMember(card.getTaskList().getBoard(), userId);

        card.setTitle(request.getTitle());
        card.setDescription(request.getDescription());
        card.setDueDate(request.getDueDate());

        if (request.getAssigneeId() != null) {
            User assignee = findUser(request.getAssigneeId());
            validateMember(card.getTaskList().getBoard(), assignee.getId());
            card.setAssignee(assignee);
        } else {
            card.setAssignee(null);
        }

        card.getLabels().clear();
        if (request.getLabels() != null) {
            for (CardRequest.LabelRequest lr : request.getLabels()) {
                card.getLabels().add(CardLabel.builder()
                        .name(lr.getName())
                        .color(lr.getColor())
                        .card(card)
                        .build());
            }
        }

        card = cardRepository.save(card);

        activityLogService.log(card.getTaskList().getBoard(), findUser(userId), "updated_card", "CARD", cardId,
                "Updated card \"" + card.getTitle() + "\"");
        return toResponse(card);
    }

    @Transactional
    public CardResponse moveCard(Long cardId, MoveCardRequest request, Long userId) {
        Card card = findCard(cardId);
        validateMember(card.getTaskList().getBoard(), userId);

        TaskList targetList = findList(request.getTargetListId());
        if (!targetList.getBoard().getId().equals(card.getTaskList().getBoard().getId())) {
            throw new UnauthorizedException("Cannot move card to a list from another board");
        }

        String oldListName = card.getTaskList().getTitle();
        card.setTaskList(targetList);
        card.setPosition(request.getNewPosition() != null ? request.getNewPosition() : cardRepository.findMaxPositionByListId(request.getTargetListId()) + 1);
        card = cardRepository.save(card);

        activityLogService.log(card.getTaskList().getBoard(), findUser(userId), "moved_card", "CARD", cardId,
                "Moved card \"" + card.getTitle() + "\" from \"" + oldListName + "\" to \"" + targetList.getTitle() + "\"");
        return toResponse(card);
    }

    @Transactional
    public void deleteCard(Long cardId, Long userId) {
        Card card = findCard(cardId);
        validateMember(card.getTaskList().getBoard(), userId);
        cardRepository.delete(card);

        activityLogService.log(card.getTaskList().getBoard(), findUser(userId), "deleted_card", "CARD", cardId,
                "Deleted card \"" + card.getTitle() + "\"");
    }

    CardResponse toResponse(Card card) {
        return CardResponse.builder()
                .id(card.getId())
                .title(card.getTitle())
                .description(card.getDescription())
                .dueDate(card.getDueDate())
                .position(card.getPosition())
                .listId(card.getTaskList().getId())
                .assignee(card.getAssignee() != null ? UserSummaryResponse.builder()
                        .id(card.getAssignee().getId())
                        .name(card.getAssignee().getName())
                        .email(card.getAssignee().getEmail())
                        .build() : null)
                .createdAt(card.getCreatedAt())
                .updatedAt(card.getUpdatedAt())
                .labels(card.getLabels().stream()
                        .map(l -> LabelResponse.builder()
                                .id(l.getId())
                                .name(l.getName())
                                .color(l.getColor())
                                .build())
                        .collect(Collectors.toSet()))
                .build();
    }

    private Card findCard(Long id) {
        return cardRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Card not found with id: " + id));
    }

    private TaskList findList(Long id) {
        return taskListRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("List not found with id: " + id));
    }

    private User findUser(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }

    private void validateMember(Board board, Long userId) {
        boolean isOwner = board.getOwner().getId().equals(userId);
        if (!isOwner && !boardMemberRepository.existsByBoardIdAndUserId(board.getId(), userId)) {
            throw new UnauthorizedException("You are not a member of this board");
        }
    }
}
