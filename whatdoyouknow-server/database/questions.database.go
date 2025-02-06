package database

import (
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"
	"time"
)

type Question struct {
	Question     string   `json:"question"`
	Options      []string `json:"options"`
	CorrectIndex int      `json:"correct_index"`
}

type QuestionRecordDB struct {
	ID             string    `db:"id" json:"id"`
	RoomCode       string    `db:"room_code" json:"room_code"`
	Question       string    `db:"question" json:"question"`
	Options        string    `db:"options" json:"options"`
	CorrectIndex   int       `db:"correct_index" json:"correct_index"`
	QuestionNumber int       `db:"question_number" json:"question_number"`
	CreatedAt      time.Time `db:"created_at" json:"created_at"`
}

func AddQuestionsToDB(roomCode string, questions []Question) ([]QuestionRecordDB, error) {

	// --- PREPARE QUESTIONS FOR DATABASE ---
	questionsDB := make([]QuestionRecordDB, 0, len(questions))
	questionNumber := 1

	for _, question := range questions {
		optionsJSON, err := json.Marshal(question.Options)
		if err != nil {
			return nil, err
		}

		// --- ADD DB FIELDS TO QUESTION ---
		questionsDB = append(questionsDB, QuestionRecordDB{
			RoomCode:       roomCode,
			Question:       question.Question,
			Options:        string(optionsJSON),
			CorrectIndex:   question.CorrectIndex,
			QuestionNumber: questionNumber,
			CreatedAt:      time.Now(),
		})

		questionNumber++
	}

	// --- INSERT QUESTIONS INTO DATABASE ---
	query := `
		INSERT INTO questions (room_code, question, options, correct_index, question_number, created_at)
		VALUES (:room_code, :question, :options, :correct_index, :question_number, :created_at)
		RETURNING id, room_code, question, options, correct_index, question_number, created_at
	`

	rows, err := DBClient.NamedQuery(query, questionsDB)
	if err != nil {
		return nil, fmt.Errorf("failed to insert questions: %v", err)
	}
	defer rows.Close()

	// --- SCAN ROWS ---
	insertedQuestions := make([]QuestionRecordDB, 0, len(questions))
	for rows.Next() {
		var questionDB QuestionRecordDB
		err := rows.StructScan(&questionDB)
		if err != nil {
			return nil, fmt.Errorf("failed to scan inserted question: %v", err)
		}
		insertedQuestions = append(insertedQuestions, questionDB)
	}

	return insertedQuestions, nil
}

func FetchQuestionsByRoomCodeFromDB(roomCode string) ([]QuestionRecordDB, error) {

	questions := make([]QuestionRecordDB, 0)

	// --- QUERY DATABASE ---
	query := `
		SELECT *
		FROM questions
		WHERE room_code = $1
		ORDER BY question_number ASC
	`

	err := DBClient.Select(&questions, query, roomCode)
	if err != nil {
		fmt.Println(err)
		if errors.Is(err, sql.ErrNoRows) {
			return questions, nil
		}
		return questions, err
	}

	return questions, nil
}

func FetchQuestionByQuestionNumberAndRoomCodeFromDB(questionNumber int, roomCode string) (QuestionRecordDB, error) {
	var question QuestionRecordDB

	query := "SELECT * FROM questions WHERE question_number = $1 AND room_code = $2"

	err := DBClient.Get(&question, query, questionNumber, roomCode)
	if err != nil {
		fmt.Println(err)
		if errors.Is(err, sql.ErrNoRows) {
			return question, nil
		}
		return question, err
	}

	return question, nil
}
