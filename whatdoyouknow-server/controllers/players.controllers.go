package controllers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"whatdoyouknow-server/database"
	"whatdoyouknow-server/websockets"

	"github.com/gin-gonic/gin"
)

func GetPlayersByRoomCodeHandler(c *gin.Context) {

	roomCode := c.Param("room-code")

	players, err := database.FetchPlayersByRoomCodeFromDB(roomCode)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "there was an error our side! please try again later"})
		return
	}

	c.JSON(200, gin.H{"message": "Players retrieved successfully", "players": players})
}

func AddPlayerHandler(c *gin.Context) {

	const maxPlayers = 6

	roomCode := c.Param("room-code")
	if roomCode == "" {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Room code is required"})
		return
	}

	type AddPlayerRequest struct {
		Name   string `json:"name" binding:"required"`
		IsHost bool   `json:"is_host" default:"false"`
	}

	// --- PARSE REQUEST BODY ---
	var addPlayerRequest AddPlayerRequest
	if err := c.ShouldBindJSON(&addPlayerRequest); err != nil {
		fmt.Println(err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "there was an error in the request body! please try again later"})
		return
	}

	// --- CHECK IF MAX PLAYERS REACHED ---
	players, err := database.FetchPlayersByRoomCodeFromDB(roomCode)
	if err != nil {
		fmt.Println(err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "there was an error our side! please try again later"})
		return
	}

	if len(players) == maxPlayers {
		c.JSON(http.StatusBadRequest, gin.H{"error": "max players reached"})
		return
	}

	// --- ADD PLAYER TO DATABASE ---
	player, err := database.AddPlayerToDB(addPlayerRequest.Name, roomCode, addPlayerRequest.IsHost)
	if err != nil {
		fmt.Println(err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "there was an error our side! please try again later"})
		return
	}

	// --- PREPARE WEBSOCKET MESSAGE ---
	playerWebsocketMessage := struct {
		EventType string                  `json:"event_type"`
		Player    database.PlayerRecordDB `json:"player"`
	}{
		EventType: "add_player",
		Player:    player,
	}

	messageJSON, err := json.Marshal(playerWebsocketMessage)
	if err != nil {
		fmt.Println(err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to prepare websocket message."})
		return
	}

	// --- SEND NEW PLAYER TO WEBSOCKET CONNECTIONS ---
	websockets.WebsocketClient.BroadcastMessageToRoom(roomCode, messageJSON)

	c.JSON(200, gin.H{"message": "Player added successfully", "player": player})
}

func RemovePlayerHandler(c *gin.Context) {

	playerID := c.Param("player-id")
	if playerID == "" {
		c.JSON(400, gin.H{"message": "missing player_id parameter"})
		return
	}

	type DeletePlayerRequest struct {
		RoomCode string `json:"room_code" binding:"required"`
	}

	// --- PARSE REQUEST BODY ---
	var deletePlayerRequest DeletePlayerRequest
	if err := c.ShouldBindJSON(&deletePlayerRequest); err != nil {
		fmt.Println(err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "there was an error in the request body! please try again later"})
		return
	}

	// --- DELETE PLAYER FROM DATABASE ---
	err := database.DeletePlayerFromDB(playerID)
	if err != nil {
		c.JSON(500, gin.H{"message": "Error deleting player from database"})
		return
	}

	// --- PREPARE WEBSOCKET MESSAGE ---
	removePlayerWebsocketMessage := struct {
		EventType string `json:"event_type"`
		PlayerID  string `json:"player_id"`
	}{
		EventType: "remove_player",
		PlayerID:  playerID,
	}

	messageJSON, err := json.Marshal(removePlayerWebsocketMessage)
	if err != nil {
		fmt.Println(err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to prepare websocket message."})
		return
	}

	// --- SEND NEW PLAYER TO WEBSOCKET CONNECTIONS ---
	websockets.WebsocketClient.BroadcastMessageToRoom(deletePlayerRequest.RoomCode, messageJSON)

	c.JSON(200, gin.H{"message": "Player removed successfully!"})
}
