"use client";

import React, { createContext, useContext, useState } from "react";

export type IPlayer = {
  id: string;
  name: string;
  score: number;
  is_host: boolean;
  has_answered: boolean;
};

interface PlayersContextType {
  players: IPlayer[];
  setPlayers: React.Dispatch<React.SetStateAction<IPlayer[]>>;
  addPlayer: (player: IPlayer) => void;
  removePlayer: (id: string) => void;
  clearPlayers: () => void;
  hasPlayerAnswered: (player_id: string) => boolean;
  setPlayerToAnswered: (player_id: string) => void;
  checkIfAllPlayersHaveAnswered: () => boolean;
}

interface PlayersProviderProps {
  children: React.ReactNode;
}

const PlayersContext = createContext<PlayersContextType | undefined>(undefined);

export const PlayersProvider = ({ children }: PlayersProviderProps) => {
  // --- STATE TO STORE PLAYERS ---
  const [players, setPlayers] = useState<IPlayer[]>([]);

  // --- [FUNCTION] TO ADD PLAYER ---
  const addPlayer = (player: IPlayer) => {
    setPlayers((prevPlayers) => [...prevPlayers, player]);
  };

  // --- [FUNCTION] TO REMOVE PLAYER ---
  const removePlayer = (player_id: string) => {
    setPlayers((prevPlayers) =>
      prevPlayers.filter((player) => player.id !== player_id)
    );
  };

  // --- [FUNCTION] TO CLEAR PLAYERS ---
  const clearPlayers = () => {
    setPlayers([]);
  };

  // --- [FUNCTION] TO CHECK IF PLAYER HAS ANSWERED ---
  const hasPlayerAnswered = (player_id: string) => {
    const has_answered = !!players.filter(
      (player) => player.id === player_id && player.has_answered
    ).length;
    return has_answered;
  };

  // --- [FUNCTION] TO SET PLAYER TO ANSWERED ---
  const setPlayerToAnswered = (player_id: string) => {
    setPlayers((prevPlayers) =>
      prevPlayers.map((player) =>
        player.id === player_id ? { ...player, has_answered: true } : player
      )
    );
  };

  // --- [FUNCTION] CHECK IF ALL PLAYERS HAVE ANSWERED ---
  const checkIfAllPlayersHaveAnswered = () => {
    const all_answered =
      players.filter((player) => player.has_answered).length === players.length;
    return !!all_answered;
  };

  return (
    <PlayersContext.Provider
      value={{
        players,
        setPlayers,
        addPlayer,
        removePlayer,
        clearPlayers,
        hasPlayerAnswered,
        setPlayerToAnswered,
        checkIfAllPlayersHaveAnswered,
      }}
    >
      {children}
    </PlayersContext.Provider>
  );
};

// --- HOOK TO INTERACT WITH PLAYERS STATE ---
export const usePlayers = (): PlayersContextType => {
  const context = useContext(PlayersContext);
  if (!context) {
    throw new Error("usePlayers must be used within a PlayersProvider");
  }
  return context;
};
