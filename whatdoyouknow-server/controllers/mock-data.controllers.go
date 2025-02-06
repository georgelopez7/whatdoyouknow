package controllers

import (
	"net/http"
	"os"
	"whatdoyouknow-server/database"

	"github.com/gin-gonic/gin"
)

func AddQuestionsHandlerDEV(c *gin.Context) {

	// --- CHECK ENVIRONMENT ---
	if os.Getenv("USE_MOCK_DATA") != "true" {
		c.JSON(400, gin.H{"error": "This endpoint is only available in mock data mode"})
		return
	}

	// --- ROOM CODE ---
	roomCode := c.Param("room-code")
	if roomCode == "" {
		c.JSON(400, gin.H{"error": "Room code is required"})
		return
	}

	// --- CREATE QUESTIONS ---
	questions := []database.Question{
		{
			Question:     "What is the capital of France?",
			Options:      []string{"Paris", "London", "Berlin", "Tokyo"},
			CorrectIndex: 0,
		},
		{
			Question:     "What is the capital of Germany?",
			Options:      []string{"Berlin", "London", "Paris", "Tokyo"},
			CorrectIndex: 0,
		},
		{
			Question:     "What is the capital of Italy?",
			Options:      []string{"Madrid", "Rome", "Lisbon", "Tokyo"},
			CorrectIndex: 1,
		},
		{
			Question:     "What is the capital of Spain?",
			Options:      []string{"Rome", "Lisbon", "Madrid", "Tokyo"},
			CorrectIndex: 2,
		},
		{
			Question:     "What is the capital of Portugal?",
			Options:      []string{"Lisbon", "Madrid", "Barcelona", "Tokyo"},
			CorrectIndex: 0,
		},
	}

	// --- ADD QUESTIONS TO DATABASE ---
	questionsDBRecords, err := database.AddQuestionsToDB(roomCode, questions)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add questions to the database", "details": err.Error()})
		return
	}

	c.JSON(201, gin.H{"message": "Questions added successfully", "questions": questionsDBRecords})
}
