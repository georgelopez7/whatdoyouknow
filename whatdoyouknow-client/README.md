# whatdoyouknow-client

This repository contains the frontend code for the **whatdoyouknow** project, a real-time multiplayer quiz game. It handles the user interface, connects to the backend via WebSockets for live game updates, and provides a seamless experience **without** requiring user logins.

## 🛠️ Tech Stack

The project is built with the following tools & frameworks.

### ⚡ Frontend

- **Next.js 14** – Handles server-side rendering (SSR) and optimized client-side performance.
- **Server Actions** – Enables seamless backend interactions without API routes.
- **ShadCN** – Provides beautifully styled and customizable UI components.
- **Tailwind CSS** – Ensures a sleek and responsive design with utility-first styling.

### 🔗 Real-Time Communication

- **WebSockets** – Powers real-time interactions, keeping all players in sync during the game.

## 🍪 Cookies

To keep the project lightweight and eliminate the need for user logins, we utilize **cookies** to store essential player information. This ensures a seamless and efficient quiz experience.

### 🏷️ Player Cookie (`player`)

The `"player"` cookie is used to **maintain player session data without requiring authentication**. It stores key details such as:

- **Room Information** – The `roomCode` of the game session the player has joined.
- **Host Status** – Whether the player is the host of the quiz.

### 📌 Cookie Behavior

- The cookie is set when a player joins a quiz session.
- It expires automatically after the game ends or after a predefined duration.
- No sensitive or personally identifiable information is stored.

This approach allows players to participate smoothly without the friction of creating an account.

## ⚡ WebSocket Event Handling

Our project uses a **WebSocket Manager** to handle real-time events and synchronize the game state for all players. This ensures a smooth and interactive quiz experience.

### 🎯 Event-Based Communication

The WebSocket Manager listens for incoming events based on their `event_type` and processes them accordingly. Key event types include:

- **`add_player`** – Registers a new player into the game session.
- **`start_game`** – Initiates the quiz, signaling all players to begin.
- **`next_question`** – Sends the next question to all participants simultaneously.
- **`show_results`** – Shows the leaderboard.
- **and more...**

### 🔄 Real-Time Synchronization

Each event updates the game state and **ensures all players see the same view** at the same time. This prevents desynchronization and keeps the experience consistent across all clients.
