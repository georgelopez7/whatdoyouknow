"use server";

import { IPlayer } from "@/contexts/players.context";
import { formatPlayers } from "@/utils/player.utils";

export type IPLayerRecord = {
  id: string;
  name: string;
  score: number;
  is_host: boolean;
};

export const FetchPlayersByRoomCode = async (roomCode: string) => {
  // --- SEND GET REQUEST ---
  const response = await fetch(
    `${process.env.WHATDOYOUKNOW_SERVER_URL}/api/v1/players/${roomCode}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.WHATDOYOUKNOW_SERVER_TOKEN}`,
      },
      cache: "no-cache",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch room");
  }

  // --- PARSE RESPONSE ---
  const playersResponse = await response.json();
  const playerRecords = playersResponse.players as IPLayerRecord[];

  // --- FORMAT PLAYERS ---
  const players = formatPlayers(playerRecords);
  return players;
};

export const AddPlayerToRoom = async (roomCode: string, name: string) => {
  const response = await fetch(
    `${process.env.WHATDOYOUKNOW_SERVER_URL}/api/v1/players/${roomCode}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.WHATDOYOUKNOW_SERVER_TOKEN}`,
      },
      body: JSON.stringify({
        name,
        is_host: false,
      }),
    }
  );

  if (!response.ok) {
    return {
      player: null,
      error: "this room already has the maximum number of players",
    };
  }

  // --- PARSE RESPONSE ---
  const playerResponse = await response.json();
  const playerRecord = playerResponse.player as IPLayerRecord;

  const PLAYER = {
    id: playerRecord.id,
    name: playerRecord.name,
    score: playerRecord.score,
    is_host: playerRecord.is_host,
    has_answered: false,
  } as IPlayer;

  return {
    player: PLAYER,
    error: null,
  };
};

export const RemovePlayerFromRoom = async (
  roomCode: string,
  playerID: string
) => {
  // --- SEND DELETE REQUEST ---
  const response = await fetch(
    `${process.env.WHATDOYOUKNOW_SERVER_URL}/api/v1/players/${playerID}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.WHATDOYOUKNOW_SERVER_TOKEN}`,
      },
      body: JSON.stringify({
        room_code: roomCode,
      }),
    }
  );

  if (!response.ok) {
    return {
      error: "failed to remove player from the room",
    };
  }

  return {
    error: null,
  };
};
