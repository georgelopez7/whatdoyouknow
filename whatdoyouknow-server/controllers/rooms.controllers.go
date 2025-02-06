package controllers

import (
	"net/http"
	"whatdoyouknow-server/database"
	"whatdoyouknow-server/websockets"

	"github.com/gin-gonic/gin"
)

func GetRoomByCodeHandler(c *gin.Context) {
	roomCode := c.Param("room-code")

	room, err := database.FetchRoomByRoomCodeFromDB(roomCode)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "there was an error our side! please try again later"})
		return
	}

	c.JSON(200, gin.H{"message": "Room retrieved successfully", "room": room})
}

func AddRoomHandler(c *gin.Context) {

	type AddRoomRequest struct {
		RoomCode   string `json:"room_code" binding:"required"`
		HostPlayer struct {
			Name   string `json:"name" binding:"required"`
			IsHost bool   `json:"is_host" binding:"required"`
		} `json:"host_player" binding:"required"`
	}

	// --- PARSE REQUEST BODY ---
	var addRoomRequest AddRoomRequest
	if err := c.ShouldBindJSON(&addRoomRequest); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "there was an error in the request body! please try again later"})
		return
	}

	// --- ADD ROOM TO DATABASE ---
	isActive := true
	room, err := database.AddRoomToDB(addRoomRequest.RoomCode, isActive)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "there was an error our side! please try again later"})
		return
	}

	// --- ADD PLAYER TO ROOM ---
	player, err := database.AddPlayerToDB(addRoomRequest.HostPlayer.Name, addRoomRequest.RoomCode, addRoomRequest.HostPlayer.IsHost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "there was an error our side! please try again later"})
		return
	}

	// --- ADD ROOM TO WEBSOCKET CONNECTIONS ---
	websockets.WebsocketClient.AddRoom(addRoomRequest.RoomCode)

	c.JSON(200, gin.H{"message": "Room added successfully", "room": room, "host_player": player})
}

func DeleteRoomHandler(c *gin.Context) {

	roomID := c.Param("room-id")
	if roomID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "id of user is required"})
		return
	}

	// --- DELETE USER FROM DATABASE ---
	err := database.DeleteRoomFromDB(roomID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "there was an error our side! please try again later"})
		return
	}

	c.JSON(200, gin.H{"message": "Room deleted successfully"})
}
