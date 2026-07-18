package com.taskmanager.service;

import com.taskmanager.dto.request.BoardRequest;
import com.taskmanager.dto.response.*;
import com.taskmanager.exception.ResourceNotFoundException;
import com.taskmanager.exception.UnauthorizedException;
import com.taskmanager.model.*;
import com.taskmanager.repository.BoardMemberRepository;
import com.taskmanager.repository.BoardRepository;
import com.taskmanager.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BoardService {

    private final BoardRepository boardRepository;
    private final UserRepository userRepository;
    private final BoardMemberRepository boardMemberRepository;
    private final ActivityLogService activityLogService;
    private final CardService cardService;

    public List<BoardSummaryResponse> getUserBoards(Long userId) {
        return boardRepository.findAllByUserId(userId)
                .stream()
                .map(this::toSummary)
                .collect(Collectors.toList());
    }

    public BoardResponse getBoard(Long boardId, Long userId) {
        Board board = findBoard(boardId);
        validateMember(board, userId);
        return toResponse(board);
    }

    @Transactional
    public BoardResponse createBoard(BoardRequest request, Long userId) {
        User user = findUser(userId);
        Board board = Board.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .owner(user)
                .build();
        board = boardRepository.save(board);

        boardMemberRepository.save(BoardMember.builder()
                .board(board)
                .user(user)
                .role(BoardMember.MemberRole.OWNER)
                .build());

        activityLogService.log(board, user, "created_board", "BOARD", board.getId(),
                "Created board \"" + board.getTitle() + "\"");
        return toResponse(board);
    }

    @Transactional
    public BoardResponse updateBoard(Long boardId, BoardRequest request, Long userId) {
        Board board = findBoard(boardId);
        validateOwner(board, userId);
        board.setTitle(request.getTitle());
        board.setDescription(request.getDescription());
        board = boardRepository.save(board);

        activityLogService.log(board, findUser(userId), "updated_board", "BOARD", boardId,
                "Updated board \"" + board.getTitle() + "\"");
        return toResponse(board);
    }

    @Transactional
    public void deleteBoard(Long boardId, Long userId) {
        Board board = findBoard(boardId);
        validateOwner(board, userId);
        boardRepository.delete(board);
    }

    @Transactional
    public BoardResponse addMember(Long boardId, String email, Long userId) {
        Board board = findBoard(boardId);
        validateOwner(board, userId);

        User newMember = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        if (boardMemberRepository.existsByBoardIdAndUserId(boardId, newMember.getId())) {
            throw new IllegalStateException("User is already a member");
        }

        boardMemberRepository.save(BoardMember.builder()
                .board(board)
                .user(newMember)
                .role(BoardMember.MemberRole.MEMBER)
                .build());

        activityLogService.log(board, findUser(userId), "added_member", "USER", newMember.getId(),
                "Added " + newMember.getName() + " to board");
        return toResponse(boardRepository.findById(boardId).orElseThrow());
    }

    private Board findBoard(Long id) {
        return boardRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Board not found with id: " + id));
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

    private void validateOwner(Board board, Long userId) {
        if (!board.getOwner().getId().equals(userId)) {
            throw new UnauthorizedException("Only the board owner can perform this action");
        }
    }

    private BoardSummaryResponse toSummary(Board board) {
        int listCount = board.getLists().size();
        int cardCount = board.getLists().stream()
                .mapToInt(l -> l.getCards().size())
                .sum();
        return BoardSummaryResponse.builder()
                .id(board.getId())
                .title(board.getTitle())
                .description(board.getDescription())
                .ownerId(board.getOwner().getId())
                .ownerName(board.getOwner().getName())
                .createdAt(board.getCreatedAt())
                .updatedAt(board.getUpdatedAt())
                .listCount(listCount)
                .cardCount(cardCount)
                .build();
    }

    private BoardResponse toResponse(Board board) {
        List<TaskListResponse> lists = board.getLists().stream()
                .map(this::toListResponse)
                .collect(Collectors.toList());

        List<MemberResponse> members = boardMemberRepository.findByBoardId(board.getId())
                .stream()
                .map(m -> MemberResponse.builder()
                        .id(m.getId())
                        .userId(m.getUser().getId())
                        .name(m.getUser().getName())
                        .email(m.getUser().getEmail())
                        .role(m.getRole().name())
                        .build())
                .collect(Collectors.toList());

        List<ActivityLogResponse> logs = activityLogService.getBoardActivity(board.getId());

        return BoardResponse.builder()
                .id(board.getId())
                .title(board.getTitle())
                .description(board.getDescription())
                .ownerId(board.getOwner().getId())
                .ownerName(board.getOwner().getName())
                .createdAt(board.getCreatedAt())
                .updatedAt(board.getUpdatedAt())
                .lists(lists)
                .members(members)
                .activityLogs(logs)
                .build();
    }

    private TaskListResponse toListResponse(TaskList list) {
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
}
