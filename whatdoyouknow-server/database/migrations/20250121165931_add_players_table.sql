-- +goose Up
-- +goose StatementBegin
CREATE TABLE players (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    score INT NOT NULL DEFAULT 0,
    room_code VARCHAR(255) NOT NULL,
    FOREIGN KEY (room_code) REFERENCES rooms(room_code) ON DELETE CASCADE
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS players;
-- +goose StatementEnd
