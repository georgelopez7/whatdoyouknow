package utils

import (
	"encoding/json"
	"whatdoyouknow-server/database"
)

type ParsedQuestions struct {
	Questions []database.Question `json:"questions"`
}

func ParseJSONQuestions(jsonQuestions string) (ParsedQuestions, error) {
	var questions ParsedQuestions

	err := json.Unmarshal([]byte(jsonQuestions), &questions)
	if err != nil {
		return ParsedQuestions{}, err
	}

	return questions, nil
}
