package database

type PlayerAnswer struct {
	QuestionID string `db:"question_id" json:"question_id"`
	PlayerID   string `db:"player_id" json:"player_id"`
	IsCorrect  bool   `db:"is_correct" json:"is_correct"`
}

type PlayerAnswerRecordDB struct {
	ID         string `db:"id" json:"id"`
	QuestionID string `db:"question_id" json:"question_id"`
	PlayerID   string `db:"player_id" json:"player_id"`
	IsCorrect  bool   `db:"is_correct" json:"is_correct"`
}

func AddPlayerAnswerToDB(questionID string, playerID string, isCorrect bool) (PlayerAnswerRecordDB, error) {

	var playerAnswer PlayerAnswerRecordDB

	// --- QUERY DATABASE ---
	query := `INSERT INTO player_answers (question_id, player_id, is_correct) VALUES ($1, $2, $3) RETURNING *`
	err := DBClient.Get(&playerAnswer, query, questionID, playerID, isCorrect)
	if err != nil {
		return playerAnswer, err
	}

	return playerAnswer, nil
}

func FetchPlayerAnswersByQuestionIDFromDB(questionID string) ([]PlayerAnswerRecordDB, error) {
	var playerAnswers []PlayerAnswerRecordDB

	// --- QUERY DATABASE ---
	query := `SELECT * FROM player_answers WHERE question_id = $1`
	err := DBClient.Select(&playerAnswers, query, questionID)
	if err != nil {
		return playerAnswers, err
	}

	return playerAnswers, nil
}
