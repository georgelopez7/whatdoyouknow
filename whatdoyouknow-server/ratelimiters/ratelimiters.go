package ratelimiters

import (
	"sync"

	"golang.org/x/time/rate"
)

type Limiter struct {
	mu       sync.Mutex
	limiters map[string]*rate.Limiter
	rate     rate.Limit
	burst    int
}

func NewLimiter(r rate.Limit, b int) *Limiter {
	return &Limiter{
		limiters: make(map[string]*rate.Limiter),
		rate:     r,
		burst:    b,
	}
}

func (l *Limiter) GetLimiterByAPIKey(api_key string) *rate.Limiter {
	l.mu.Lock()
	defer l.mu.Unlock()

	limiter, exists := l.limiters[api_key]
	if !exists {
		limiter = rate.NewLimiter(l.rate, l.burst)
		l.limiters[api_key] = limiter
	}

	return limiter
}
