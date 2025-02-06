package middlewares

import (
	"net/http"
	"os"
	"strings"

	"github.com/gin-gonic/gin"
)

func CheckAuth(c *gin.Context) {

	// --- CHECK IF AUTHORIZATION HEADER EXISTS ---
	authHeader := c.GetHeader("Authorization")
	if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header is missing or invalid"})
		c.Abort()
		return
	}

	// --- CHECK IF TOKEN MATCHES SERVER AUTH TOKEN ---
	token := strings.TrimPrefix(authHeader, "Bearer ")
	serverAuthToken := os.Getenv("SERVER_AUTH_TOKEN")

	if token != serverAuthToken {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
		c.Abort()
		return
	}

	c.Next()
}
