-- +goose Up
-- +goose StatementBegin
ALTER TABLE questions
ADD COLUMN question_number INT NOT NULL;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE questions
DROP COLUMN question_number;
-- +goose StatementEnd

