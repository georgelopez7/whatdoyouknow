-- +goose Up
-- +goose StatementBegin
ALTER TABLE players ADD COLUMN is_host BOOLEAN DEFAULT FALSE NOT NULL;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE players DROP COLUMN is_host;
-- +goose StatementEnd