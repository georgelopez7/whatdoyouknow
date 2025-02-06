package controllers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"whatdoyouknow-server/database"
	"whatdoyouknow-server/websockets"

	"github.com/gin-gonic/gin"
)

func StartGameHandler(c *gin.Context) {
	roomCode := c.Param("room-code")
	if roomCode == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "code of room is required"})
		return
	}

	// --- GET QUESTIONS FOR THE ROOM ---
	questions, err := database.FetchQuestionsByRoomCodeFromDB(roomCode)
	if err != nil {
		fmt.Println(err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to start the game."})
		return
	}

	// --- SET ROOM TO INACTIVE ---
	isActive := false
	_, err = database.UpdateRoomStatus(roomCode, isActive)
	if err != nil {
		fmt.Println(err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to set room to inactive"})
		return
	}

	// --- PREPARE WEBSOCKET MESSAGE ---
	firstQuestion := questions[0]
	playerWebsocketMessage := struct {
		EventType string                    `json:"event_type"`
		Question  database.QuestionRecordDB `json:"question"`
	}{
		EventType: "start_game",
		Question:  firstQuestion,
	}

	messageJSON, err := json.Marshal(playerWebsocketMessage)
	if err != nil {
		fmt.Println(err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to prepare websocket message."})
		return
	}

	// --- SEND NEW QUESTION TO WEBSOCKET CONNECTIONS ---
	websockets.WebsocketClient.BroadcastMessageToRoom(roomCode, messageJSON)

	c.JSON(201, gin.H{"message": "Game started successfully!"})
}

func AnswerQuestionHandler(c *gin.Context) {
	roomCode := c.Param("room-code")
	if roomCode == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "code of room is required"})
		return
	}

	type AddPlayerAnswerRequest struct {
		QuestionID string `json:"question_id" binding:"required"`
		PlayerID   string `json:"player_id" binding:"required"`
		IsCorrect  bool   `json:"is_correct"`
	}

	var addPlayerAnswerRequest AddPlayerAnswerRequest
	if err := c.ShouldBindJSON(&addPlayerAnswerRequest); err != nil {
		fmt.Println(err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "there was an error in the request body! please try again later"})
		return
	}

	// --- ADD PLAYER ANSWER TO DATABASE ---
	_, err := database.AddPlayerAnswerToDB(addPlayerAnswerRequest.QuestionID, addPlayerAnswerRequest.PlayerID, addPlayerAnswerRequest.IsCorrect)
	if err != nil {
		fmt.Println(err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to add player answer"})
		return
	}

	// --- PREPARE WEBSOCKET MESSAGE ---
	playerAnswerWebsocketMessage := struct {
		EventType string `json:"event_type"`
		PlayerID  string `json:"player_id"`
	}{
		EventType: "player_answer",
		PlayerID:  addPlayerAnswerRequest.PlayerID,
	}

	messageJSON, err := json.Marshal(playerAnswerWebsocketMessage)
	if err != nil {
		fmt.Println(err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to prepare websocket message."})
		return
	}

	// --- SEND NEW QUESTION TO WEBSOCKET CONNECTIONS ---
	websockets.WebsocketClient.BroadcastMessageToRoom(roomCode, messageJSON)

	c.JSON(201, gin.H{"message": "Game started successfully!"})
}

func ShowQuestionAnswerHandler(c *gin.Context) {
	roomCode := c.Param("room-code")
	if roomCode == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "code of room is required"})
		return
	}

	type ShowQuestionAnswerRequest struct {
		QuestionID string `json:"question_id" binding:"required"`
	}

	var showQuestionAnswerRequest ShowQuestionAnswerRequest
	if err := c.ShouldBindJSON(&showQuestionAnswerRequest); err != nil {
		fmt.Println(err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "there was an error in the request body! please try again later"})
		return
	}

	playerAnswers, err := database.FetchPlayerAnswersByQuestionIDFromDB(showQuestionAnswerRequest.QuestionID)
	if err != nil {
		fmt.Println(err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch player answers from database"})
		return
	}

	// --- UPDATE SCORES OF PLAYERS ---
	for _, playerAnswer := range playerAnswers {
		if playerAnswer.IsCorrect {
			_, err := database.IncrementPlayerScoreByID(playerAnswer.PlayerID, 1)
			if err != nil {
				fmt.Println(err)
				c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to increment player score"})
				return
			}
		}
	}

	// --- FETCH PLAYERS FROM DATABASE ---
	players, err := database.FetchPlayersByRoomCodeFromDB(roomCode)
	if err != nil {
		fmt.Println(err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch players from database"})
		return
	}

	// --- PREPARE WEBSOCKET MESSAGES [SHOW QUESTION ANSWER] ---
	showQuestionAnswerMessage := struct {
		EventType string `json:"event_type"`
	}{
		EventType: "show_question_answer",
	}

	messageJSON, err := json.Marshal(showQuestionAnswerMessage)
	if err != nil {
		fmt.Println(err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to prepare websocket message."})
		return
	}
	websockets.WebsocketClient.BroadcastMessageToRoom(roomCode, messageJSON)

	// --- PREPARE WEBSOCKET MESSAGES [UPDATE PLAYER SCORES] ---
	updatePlayerScoresMessage := struct {
		EventType string                    `json:"event_type"`
		Players   []database.PlayerRecordDB `json:"players"`
	}{
		EventType: "update_player_scores",
		Players:   players,
	}

	messageJSON, err = json.Marshal(updatePlayerScoresMessage)
	if err != nil {
		fmt.Println(err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to prepare websocket message."})
		return
	}
	websockets.WebsocketClient.BroadcastMessageToRoom(roomCode, messageJSON)

	c.JSON(201, gin.H{"message": "Showing question answer successful!"})
}

func StartNextQuestionHandler(c *gin.Context) {
	roomCode := c.Param("room-code")
	if roomCode == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "code of room is required"})
		return
	}

	type StartNextQuestionRequest struct {
		QuestionNumberCurrent int `json:"question_number_current" binding:"required"`
	}

	var startNextQuestionRequest StartNextQuestionRequest
	if err := c.ShouldBindJSON(&startNextQuestionRequest); err != nil {
		fmt.Println(err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "there was an error in the request body! please try again later"})
		return
	}

	nextQuestionIndex := startNextQuestionRequest.QuestionNumberCurrent + 1

	// --- FETCH QUESTION FROM DATABASE ---
	question, err := database.FetchQuestionByQuestionNumberAndRoomCodeFromDB(nextQuestionIndex, roomCode)
	if err != nil {
		fmt.Println(err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch questions from database"})
		return
	}

	// --- PREPARE WEBSOCKET MESSAGE ---
	playerWebsocketMessage := struct {
		EventType string                    `json:"event_type"`
		Question  database.QuestionRecordDB `json:"question"`
	}{
		EventType: "next_question",
		Question:  question,
	}

	messageJSON, err := json.Marshal(playerWebsocketMessage)
	if err != nil {
		fmt.Println(err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to prepare websocket message."})
		return
	}

	// --- SEND NEW QUESTION TO WEBSOCKET CONNECTIONS ---
	websockets.WebsocketClient.BroadcastMessageToRoom(roomCode, messageJSON)

	c.JSON(201, gin.H{"message": "Game started successfully!"})
}

func ShowResultsHandler(c *gin.Context) {
	roomCode := c.Param("room-code")
	if roomCode == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "code of room is required"})
		return
	}

	// --- PREPARE WEBSOCKET MESSAGES [SHOW RESULTS] ---
	showResultsMessage := struct {
		EventType string `json:"event_type"`
	}{
		EventType: "show_results",
	}

	messageJSON, err := json.Marshal(showResultsMessage)
	if err != nil {
		fmt.Println(err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to prepare websocket message."})
		return
	}
	websockets.WebsocketClient.BroadcastMessageToRoom(roomCode, messageJSON)

	c.JSON(201, gin.H{"message": "Showing results successful!"})
}

func EndGameHandler(c *gin.Context) {
	roomCode := c.Param("room-code")
	if roomCode == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "code of room is required"})
		return
	}

	// --- SET ROOM TO INACTIVE ---
	_, err := database.UpdateRoomStatus(roomCode, false)
	if err != nil {
		fmt.Println(err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to set room to inactive"})
		return
	}

	// --- PREPARE WEBSOCKET MESSAGES [SHOW RESULTS] ---
	endGameMessage := struct {
		EventType string `json:"event_type"`
	}{
		EventType: "end_game",
	}

	messageJSON, err := json.Marshal(endGameMessage)
	if err != nil {
		fmt.Println(err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to prepare websocket message."})
		return
	}
	websockets.WebsocketClient.BroadcastMessageToRoom(roomCode, messageJSON)

	c.JSON(201, gin.H{"message": "Game ended successfully!"})
}
