package main

import (
	"whatdoyouknow-server/controllers"
	"whatdoyouknow-server/database"
	"whatdoyouknow-server/middlewares"
	"whatdoyouknow-server/websockets"

	"os"
	"whatdoyouknow-server/utils"

	"github.com/gin-gonic/gin"
)

func init() {
	utils.LoadEnvVariables()          // .ENV
	database.ConnectDB()              // POSTGRES
	websockets.CreateAllowedOrigins() // WEBSOCKETS
}

func main() {
	router := gin.Default()

	// --- MIDDLEWARES ---
	authenticatedRoutes := router.Group("/api/v1")
	authenticatedRoutes.Use(middlewares.CheckAuth) // ADD MIDDLEWARE TO CHECK AUTH

	// --- ROUTES ---
	authenticatedRoutes.GET("/rooms/:room-code", controllers.GetRoomByCodeHandler)
	authenticatedRoutes.POST("/rooms", controllers.AddRoomHandler)
	authenticatedRoutes.DELETE("/rooms/:room-id", controllers.DeleteRoomHandler)

	authenticatedRoutes.POST("/rooms/:room-code/actions/start-game", controllers.StartGameHandler)
	authenticatedRoutes.POST("/rooms/:room-code/actions/answer-question", controllers.AnswerQuestionHandler)
	authenticatedRoutes.POST("/rooms/:room-code/actions/show-question-answer", controllers.ShowQuestionAnswerHandler)
	authenticatedRoutes.POST("/rooms/:room-code/actions/start-next-question", controllers.StartNextQuestionHandler)
	authenticatedRoutes.POST("/rooms/:room-code/actions/show-results", controllers.ShowResultsHandler)
	authenticatedRoutes.POST("/rooms/:room-code/actions/end-game", controllers.EndGameHandler)

	authenticatedRoutes.GET("/players/:room-code", controllers.GetPlayersByRoomCodeHandler)
	authenticatedRoutes.POST("/players/:room-code", controllers.AddPlayerHandler)
	authenticatedRoutes.DELETE("/players/:player-id", controllers.RemovePlayerHandler)

	authenticatedRoutes.POST("/questions/:room-code", controllers.AddQuestionsHandler)

	// --- MOCK DATA MODE ---
	if os.Getenv("USE_MOCK_DATA") == "true" {
		authenticatedRoutes.POST("/questions/:room-code/mock", controllers.AddQuestionsHandlerDEV)
	}

	// --- WEBSOCKETS ---
	websockets.NewWebsocketConnectionManager()
	router.GET("/ws/:room-code", func(c *gin.Context) {
		roomCode := c.Param("room-code")
		websockets.HandleWebSocket(websockets.WebsocketClient, roomCode, c.Writer, c.Request)
	})

	// --- PORT ---
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	// --- RUN SERVER ---
	router.Run(":" + port)
}
