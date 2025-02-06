-- +goose Up
-- +goose StatementBegin
CREATE TABLE player_answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_id UUID NOT NULL REFERENCES questions(id),
    player_id UUID NOT NULL REFERENCES players(id),
    is_correct BOOLEAN NOT NULL
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE player_answers;
-- +goose StatementEnd

