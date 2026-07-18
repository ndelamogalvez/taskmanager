package com.taskmanager.service;

import com.taskmanager.dto.request.ReorderListRequest;
import com.taskmanager.dto.request.TaskListRequest;
import com.taskmanager.dto.response.TaskListResponse;
import com.taskmanager.exception.ResourceNotFoundException;
import com.taskmanager.exception.UnauthorizedException;
import com.taskmanager.model.Board;
import com.taskmanager.model.TaskList;
import com.taskmanager.model.User;
import com.taskmanager.repository.BoardMemberRepository;
import com.taskmanager.repository.BoardRepository;
import com.taskmanager.repository.TaskListRepository;
import com.taskmanager.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TaskListService {

    private final TaskListRepository taskListRepository;
    private final BoardRepository boardRepository;
    private final UserRepository userRepository;
    private final BoardMemberRepository boardMemberRepository;
    private final ActivityLogService activityLogService;
    private final CardService cardService;

    @Transactional
    public TaskListResponse createList(Long boardId, TaskListRequest request, Long userId) {
        Board board = findBoard(boardId);
        validateMember(board, userId);
        int position = taskListRepository.countByBoardId(boardId);
        TaskList list = TaskList.builder()
                .title(request.getTitle())
                .position(position)
                .board(board)
                .build();
        list = taskListRepository.save(list);

        activityLogService.log(board, findUser(userId), "created_list", "LIST", list.getId(),
                "Created list \"" + list.getTitle() + "\"");
        return toResponse(list);
    }

    @Transactional
    public TaskListResponse updateList(Long listId, TaskListRequest request, Long userId) {
        TaskList list = findList(listId);
        validateMember(list.getBoard(), userId);
        list.setTitle(request.getTitle());
        list = taskListRepository.save(list);

        activityLogService.log(list.getBoard(), findUser(userId), "updated_list", "LIST", listId,
                "Updated list to \"" + list.getTitle() + "\"");
        return toResponse(list);
    }

    @Transactional
    public TaskListResponse reorderList(Long listId, ReorderListRequest request, Long userId) {
        TaskList list = findList(listId);
        validateMember(list.getBoard(), userId);
        list.setPosition(request.getNewPosition());
        taskListRepository.save(list);

        activityLogService.log(list.getBoard(), findUser(userId), "reordered_list", "LIST", listId,
                "Moved list \"" + list.getTitle() + "\"");
        return toResponse(list);
    }

    @Transactional
    public void deleteList(Long listId, Long userId) {
        TaskList list = findList(listId);
        validateMember(list.getBoard(), userId);
        taskListRepository.delete(list);

        activityLogService.log(list.getBoard(), findUser(userId), "deleted_list", "LIST", listId,
                "Deleted list \"" + list.getTitle() + "\"");
    }

    public List<TaskListResponse> getBoardLists(Long boardId, Long userId) {
        Board board = findBoard(boardId);
        validateMember(board, userId);
        return taskListRepository.findByBoardIdOrderByPositionAsc(boardId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    TaskListResponse toResponse(TaskList list) {
        return TaskListResponse.builder()
                .id(list.getId())
                .title(list.getTitle())
                .position(list.getPosition())
                .createdAt(list.getCreatedAt())
                .cards(list.getCards().stream()
                        .map(cardService::toResponse)
                        .collect(Collectors.toList()))
                .build();
    }

    private Board findBoard(Long id) {
        return boardRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Board not found with id: " + id));
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
