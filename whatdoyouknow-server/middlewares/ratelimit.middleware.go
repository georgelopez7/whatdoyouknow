package middlewares

import (
	"net/http"
	"whatdoyouknow-server/ratelimiters"

	"github.com/gin-gonic/gin"
)

func CheckRateLimit(limiter *ratelimiters.Limiter) gin.HandlerFunc {
	return func(c *gin.Context) {

		// --- CHECK FOR API KEY ---
		api_key := c.GetHeader("X-API-KEY")
		if api_key == "" {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": "Missing API Key",
			})
			c.Abort()
			return
		}

		// --- CHECK FOR RATE LIMIT ---
		limiter_for_api_key := limiter.GetLimiterByAPIKey(api_key)
		if !limiter_for_api_key.Allow() {
			c.JSON(http.StatusTooManyRequests, gin.H{
				"error": "Too many requests",
			})
			c.Abort()
			return
		}

		c.Next()
	}
}
