-- +goose Up
-- +goose StatementBegin
CREATE TABLE rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_code VARCHAR(255) NOT NULL UNIQUE            
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS rooms;
-- +goose StatementEnd
