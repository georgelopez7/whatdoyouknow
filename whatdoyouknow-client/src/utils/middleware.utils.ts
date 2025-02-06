import { FetchPlayersByRoomCode } from "@/actions/players.actions";
import { IPlayer } from "@/contexts/players.context";
import { NextRequest } from "next/server";

export const CheckIfAllowedInRoom = async (
  request: NextRequest,
  roomCode: string
) => {
  // --- GET PLAYER COOKIE ---
  const cookies = request.cookies;
  const playerCookieStr = cookies.get("player")?.value as string | undefined;

  if (!playerCookieStr) {
    return false;
  }

  // --- CHECK IF PLAYER IS ALLOWED IN ROOM ---
  const playerCookie = JSON.parse(playerCookieStr) as IPlayer;
  const players = await FetchPlayersByRoomCode(roomCode);

  const isAllowedInRoom = players.some(
    (player) => player.id === playerCookie.id
  );

  if (!isAllowedInRoom) {
    return false;
  }

  return true;
};
