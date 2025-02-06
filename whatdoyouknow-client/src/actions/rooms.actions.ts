"use server";

import { IPlayer } from "@/contexts/players.context";
import { generateUniqueString } from "@/utils/utils";

export type IRoom = {
  id: string;
  room_code: string;
  is_active: boolean;
};

export const CreateNewRoom = async (name: string) => {
  // --- CREATE RANDOM 8 DIGIT CODE ---
  const roomCode = generateUniqueString();

  // --- CREATE NEW ROOM ---
  const response = await fetch(
    `${process.env.WHATDOYOUKNOW_SERVER_URL}/api/v1/rooms`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.WHATDOYOUKNOW_SERVER_TOKEN}`,
      },
      body: JSON.stringify({
        room_code: roomCode,
        host_player: {
          name: name,
          is_host: true,
        },
      }),
    }
  );

  if (!response.ok) {
    return {
      room: null,
      hostPlayer: null,
      error: "unable to create a room at this time",
    };
  }

  // --- PARSE RESPONSE ---
  const { room, host_player } = (await response.json()) as {
    room: IRoom;
    host_player: IPlayer;
  };

  return { room, hostPlayer: host_player, error: null };
};

export const FetchRoomByCode = async (roomCode: string) => {
  // --- SEND GET REQUEST ---
  const response = await fetch(
    `${process.env.WHATDOYOUKNOW_SERVER_URL}/api/v1/rooms/${roomCode}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.WHATDOYOUKNOW_SERVER_TOKEN}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch room");
  }

  const room = await response.json();

  if (!!room.room.id) {
    return room.room as IRoom;
  }

  return null;
};

export const CheckForValidRoomByCode = async (roomCode: string) => {
  // --- CHECK FOR VALID ROOM CODE ---
  const response = await fetch(
    `${process.env.WHATDOYOUKNOW_SERVER_URL}/api/v1/rooms/${roomCode}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.WHATDOYOUKNOW_SERVER_TOKEN}`,
      },
    }
  );

  if (!response.ok) {
    return {
      room: null,
      error: "failed to fetch room",
    };
  }

  const { room } = (await response.json()) as { room: IRoom };

  // --- CHECK IF ROOM IS ACTIVE ---
  if (!room.is_active) {
    return {
      room: null,
      error: "invalid room code",
    };
  }

  return {
    room,
    error: null,
  };
};
