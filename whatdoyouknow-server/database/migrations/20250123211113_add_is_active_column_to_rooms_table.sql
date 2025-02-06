-- +goose Up
-- +goose StatementBegin
ALTER TABLE rooms
ADD COLUMN is_active BOOLEAN NOT NULL DEFAULT TRUE;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE rooms
DROP COLUMN is_active;
-- +goose StatementEnd

