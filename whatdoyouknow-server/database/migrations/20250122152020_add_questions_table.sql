-- +goose Up
-- +goose StatementBegin
CREATE TABLE questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_code VARCHAR(255) NOT NULL,
    question VARCHAR(255) NOT NULL,
    options TEXT NOT NULL,
    correct_index INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY (room_code) REFERENCES rooms(room_code) ON DELETE CASCADE
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS questions;
-- +goose StatementEnd
