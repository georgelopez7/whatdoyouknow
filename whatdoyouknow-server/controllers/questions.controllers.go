package controllers

import (
	"net/http"
	"os"
	"whatdoyouknow-server/database"
	"whatdoyouknow-server/services/llm"
	"whatdoyouknow-server/utils"

	"github.com/gin-gonic/gin"
)

func AddQuestionsHandler(c *gin.Context) {

	// --- ROOM CODE ---
	roomCode := c.Param("room-code")
	if roomCode == "" {
		c.JSON(400, gin.H{"error": "Room code is required"})
		return
	}

	// --- REQUEST BODY ---
	type AddQuestionsRequest struct {
		Model    string `json:"model" binding:"required"`
		Prompt   string `json:"prompt" binding:"required"`
		JSONMode bool   `json:"json_mode"`
	}

	var addQuestionsRequest AddQuestionsRequest
	if err := c.ShouldBindJSON(&addQuestionsRequest); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// --- CREATE QUESTIONS WITH CHATGPT ---
	apiKey := os.Getenv("OPENAI_API_KEY")
	llmMessages := []llm.LLMMessage{
		{Role: "user", Content: addQuestionsRequest.Prompt},
	}

	// --- PROMPT OPENAI ---
	response, err := llm.PromptOpenAILLM(llmMessages, addQuestionsRequest.Model, apiKey, true)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// --- PARSE QUESTIONS RESPONSE ---
	questions, err := utils.ParseJSONQuestions(response.Content)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// --- ADD QUESTIONS TO DATABASE ---
	questionsDBRecords, err := database.AddQuestionsToDB(roomCode, questions.Questions)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add questions to the database", "details": err.Error()})
		return
	}

	c.JSON(201, gin.H{"message": "Questions added successfully", "questions": questionsDBRecords})
}
