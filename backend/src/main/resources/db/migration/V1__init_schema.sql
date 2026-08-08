CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at DATETIME(6) NOT NULL
);

CREATE TABLE boards (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    owner_id BIGINT NOT NULL,
    created_at DATETIME(6) NOT NULL,
    updated_at DATETIME(6),
    CONSTRAINT fk_boards_owner FOREIGN KEY (owner_id) REFERENCES users(id)
);

CREATE TABLE board_members (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    board_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    role VARCHAR(50) NOT NULL,
    CONSTRAINT fk_board_members_board FOREIGN KEY (board_id) REFERENCES boards(id),
    CONSTRAINT fk_board_members_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT uk_board_members_board_user UNIQUE (board_id, user_id)
);

CREATE TABLE task_lists (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    position INT NOT NULL,
    board_id BIGINT NOT NULL,
    created_at DATETIME(6) NOT NULL,
    CONSTRAINT fk_task_lists_board FOREIGN KEY (board_id) REFERENCES boards(id)
);

CREATE TABLE cards (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    due_date DATE,
    position INT NOT NULL,
    list_id BIGINT NOT NULL,
    assignee_id BIGINT,
    created_at DATETIME(6) NOT NULL,
    updated_at DATETIME(6),
    CONSTRAINT fk_cards_list FOREIGN KEY (list_id) REFERENCES task_lists(id),
    CONSTRAINT fk_cards_assignee FOREIGN KEY (assignee_id) REFERENCES users(id)
);

CREATE TABLE card_labels (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    color VARCHAR(50) NOT NULL,
    card_id BIGINT NOT NULL,
    CONSTRAINT fk_card_labels_card FOREIGN KEY (card_id) REFERENCES cards(id)
);

CREATE TABLE activity_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    board_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    action VARCHAR(255) NOT NULL,
    entity_type VARCHAR(50),
    entity_id BIGINT,
    details TEXT,
    created_at DATETIME(6) NOT NULL,
    CONSTRAINT fk_activity_logs_board FOREIGN KEY (board_id) REFERENCES boards(id),
    CONSTRAINT fk_activity_logs_user FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX idx_boards_owner ON boards(owner_id);
CREATE INDEX idx_task_lists_board ON task_lists(board_id);
CREATE INDEX idx_cards_list ON cards(list_id);
CREATE INDEX idx_activity_logs_board ON activity_logs(board_id);
