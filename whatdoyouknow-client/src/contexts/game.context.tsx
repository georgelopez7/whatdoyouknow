"use client";

import React, { createContext, useContext, useState } from "react";

export type IGameState =
  | "waiting_room"
  | "intermission"
  | "playing"
  | "show_question_answer"
  | "show_results";

interface GameStateContextType {
  gameState: IGameState;
  setGameState: React.Dispatch<React.SetStateAction<IGameState>>;
  intermissionText: string;
  setIntermissionText: React.Dispatch<React.SetStateAction<string>>;
}

interface GameStateProviderProps {
  children: React.ReactNode;
}

const GameStateContext = createContext<GameStateContextType | undefined>(
  undefined
);

export const GameStateProvider = ({ children }: GameStateProviderProps) => {
  // --- STATE TO STORE GAME STATE ---
  const [gameState, setGameState] = useState<IGameState>("waiting_room");
  const [intermissionText, setIntermissionText] = useState<string>(
    "Waiting for next question..."
  );

  return (
    <GameStateContext.Provider
      value={{ gameState, setGameState, intermissionText, setIntermissionText }}
    >
      {children}
    </GameStateContext.Provider>
  );
};

// --- HOOK TO INTERACT WITH PLAYERS STATE ---
export const useGameState = (): GameStateContextType => {
  const context = useContext(GameStateContext);
  if (!context) {
    throw new Error("usePlayers must be used within a PlayersProvider");
  }
  return context;
};
