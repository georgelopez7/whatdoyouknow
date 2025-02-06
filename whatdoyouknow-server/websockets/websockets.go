package websockets

import (
	"log"
	"net/http"
	"os"
	"strings"
	"sync"

	"github.com/gorilla/websocket"
)

type WebsocketConnectionManager struct {
	rooms map[string]map[*websocket.Conn]bool
	mu    sync.Mutex
}

var WebsocketClient *WebsocketConnectionManager
var AllowedOrigins map[string]bool

func CreateAllowedOrigins() {
	allowedOrigins := make(map[string]bool)

	origins := os.Getenv("ALLOWED_ORIGINS")
	if origins == "" {
		log.Fatalln("No ALLOWED_ORIGINS set in environment!")
	}

	// --- SETUP ALLOWED ORIGINS FOR WEBSOCKETS ---
	for _, origin := range strings.Split(origins, ",") {
		trimmedOrigin := strings.TrimSpace(origin)
		if trimmedOrigin != "" {
			allowedOrigins[trimmedOrigin] = true
		}
	}

	AllowedOrigins = allowedOrigins
}

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		origin := strings.TrimSuffix(r.Header.Get("Origin"), "/")
		return AllowedOrigins[origin]
	},
}

func NewWebsocketConnectionManager() {
	WebsocketClient = &WebsocketConnectionManager{
		rooms: make(map[string]map[*websocket.Conn]bool),
	}
}

func (cm *WebsocketConnectionManager) AddRoom(roomCode string) {
	cm.mu.Lock()
	defer cm.mu.Unlock()
	if _, exists := cm.rooms[roomCode]; !exists {
		cm.rooms[roomCode] = make(map[*websocket.Conn]bool)
	}
}

func (cm *WebsocketConnectionManager) RemoveRoom(roomCode string) {
	cm.mu.Lock()
	defer cm.mu.Unlock()
	if clients, exists := cm.rooms[roomCode]; exists {
		for conn := range clients {
			conn.Close()
		}
		delete(cm.rooms, roomCode)
	}
}

func (cm *WebsocketConnectionManager) AddClientToRoom(roomCode string, conn *websocket.Conn) {
	cm.mu.Lock()
	defer cm.mu.Unlock()
	if _, exists := cm.rooms[roomCode]; !exists {
		cm.rooms[roomCode] = make(map[*websocket.Conn]bool)
	}
	cm.rooms[roomCode][conn] = true
}

func (cm *WebsocketConnectionManager) RemoveClientFromRoom(roomCode string, conn *websocket.Conn) {
	cm.mu.Lock()
	defer cm.mu.Unlock()
	if clients, exists := cm.rooms[roomCode]; exists {
		delete(clients, conn)
		conn.Close()
		if len(clients) == 0 {
			delete(cm.rooms, roomCode)
		}
	}
}

func (cm *WebsocketConnectionManager) BroadcastMessageToRoom(roomCode string, message []byte) {
	cm.mu.Lock()
	defer cm.mu.Unlock()
	if clients, exists := cm.rooms[roomCode]; exists {
		for conn := range clients {
			if err := conn.WriteMessage(websocket.TextMessage, message); err != nil {
				cm.RemoveClientFromRoom(roomCode, conn)
			}
		}
	}
}

func HandleWebSocket(cm *WebsocketConnectionManager, roomCode string, w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("Failed to upgrade to WebSocket:", err)
		return
	}

	// --- ADD CLIENT TO THE ROOM ---
	cm.AddClientToRoom(roomCode, conn)

	for {
		_, _, err := conn.ReadMessage()
		if err != nil {
			break
		}
	}

	// --- REMOVE CLIENT FROM THE ROOM ---
	cm.RemoveClientFromRoom(roomCode, conn)
}
