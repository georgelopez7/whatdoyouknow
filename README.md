# whatdoyouknow

This repository contains the code for **whatdoyouknow** project, a real-time multiplayer quiz game. Players supply the topic and AI creates the questions. The app uses WebSockets to provide instant updates and a smooth gameplay experience—all without requiring user logins.

## 🐋 Run locally with Docker

Follow these steps to set up and run the project using Docker.

#### 📂 1. Clone the Repository

```sh
git clone https://github.com/georgelopez7/whatdoyouknow.git
cd whatdoyouknow
```

#### 🔑 2. Create `.env.local` inside `whatdoyouknow-client`

Inside the `whatdoyouknow-client` folder create a `.env.local` with the following variables:

```bash
NEXT_PUBLIC_MAINTENANCE_MODE=false
NEXT_PUBLIC_HOST=http://localhost:3000
NEXT_PUBLIC_WHATDOYOUKNOW_WEBSOCKET_URL=ws://localhost:8080
NEXT_PUBLIC_USE_MOCK_DATA=true
```

#### 🚀 3. Start the Containers

Run the docker up command:

```sh
docker compose up --build
```

#### 🏗️ 4. Services Started

Running the above command will spin up the following instances:

- **_whatdoyouknow-client_** → Available at `localhost:3000`
- **_whatdoyouknow-server_** → Available at `localhost:8080`
- **_PostgreSQL Database_**

_**NOTE**: This will spin up the project in **mock data mode**, preventing any calls to ChatGPT. Read below on how you can turn this off!_

## 🧪 Mock Data Mode

This project by default is set to **mock data mode** to prevent calls being made to ChatGPT.

### 🚫 Disabling Mock Data Mode

Follow the steps below to turn mock data mode off & begin using ChatGPT to generate topic-specific questions:

#### 🔑 1. Update `.env.local` inside `whatdoyouknow-client`:

Inside the `whatdoyouknow-client` folder set the `NEXT_PUBLIC_USE_MOCK_DATA` to `false`:

```bash
NEXT_PUBLIC_MAINTENANCE_MODE=false
NEXT_PUBLIC_HOST=http://localhost:3000
NEXT_PUBLIC_WHATDOYOUKNOW_WEBSOCKET_URL=ws://localhost:8080
NEXT_PUBLIC_USE_MOCK_DATA=false <---- change to false
```

#### 🚀 2. Update `env` variables inside the `docker.compose.yml` file at the root of the repository:

First, update the `OPENAI_API_KEY` & `USE_MOCK_DATA` inside the **whatdoyouknow-server** service

```sh
whatdoyouknow-server:
    build: ./whatdoyouknow-server
    ports:
      - "8080:8080"
    environment:
      SERVER_ENVIRONMENT: "development"
      SERVER_AUTH_TOKEN: "12345"
      POSTGRES_DB_URL: "postgresql://myuser..."
      ALLOWED_ORIGINS: "http://localhost:3000,..."

      OPENAI_API_KEY: "<your-openai-api-key>" <---- add api key here
      NEXT_PUBLIC_USE_MOCK_DATA: "false" <---- change to false
    depends_on:
      postgres:
        condition: service_healthy
```

Next, update the & `USE_MOCK_DATA` inside the **whatdoyouknow-server** service

```sh
whatdoyouknow-client:
    build: ./whatdoyouknow-client
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: "development"
      NEXT_PUBLIC_MAINTENANCE_MODE: "false"
      NEXT_PUBLIC_HOST: "https://localh..."
      WHATDOYOUKNOW_SERVER_URL: "http://whatdo..."
      WHATDOYOUKNOW_SERVER_TOKEN: "12345"
      NEXT_PUBLIC_WHATDOYOUKNOW_WEBSOCKET_URL: "ws://whatdoy..."
      USE_MOCK_DATA: "false" <---- change to false
    depends_on:
      postgres:
        condition: service_healthy
```

#### ✨ 4. That's it! Run the containers!

Rebuild and run the docker containers again!

```bash
docker compose up --build
```

#### 🏗️ 4. AGAIN... the same services started

Running the above command will spin up the following instances:

- **_whatdoyouknow-client_** → Available at `localhost:3000`
- **_whatdoyouknow-server_** → Available at `localhost:8080`
- **_PostgreSQL Database_**
