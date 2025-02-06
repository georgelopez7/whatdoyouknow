"use client";

import React, { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { IPlayer, usePlayers } from "@/contexts/players.context";
import { CrownIcon, ThumbsUp, X } from "lucide-react";
import { GAME_CONFIG } from "@/config/game.config";
import { useGameState } from "@/contexts/game.context";
import { RemovePlayerFromRoom } from "@/actions/players.actions";
import { GetPlayerFromCookie } from "@/utils/cookies.utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";

interface IPlayersListProps {
  players: IPlayer[];
  roomCode: string;
}

const MAX_NUM_PLAYERS = GAME_CONFIG.MAX_NUM_PLAYERS;

const PlayersList = ({ players, roomCode }: IPlayersListProps) => {
  // --- CONTEXT ---
  const { players: playersState, setPlayers } = usePlayers();
  const { gameState } = useGameState();

  // --- STATE ---
  const [loading, setLoading] = useState(true);
  const [playerCookie, setPlayerCookie] = useState<IPlayer | null>(null);

  useEffect(() => {
    setPlayers(players);
    setLoading(false);
  }, [players, setPlayers]);

  // --- PLAYER COOKIE ---
  useEffect(() => {
    const player = GetPlayerFromCookie();
    setPlayerCookie(player);
  }, []);

  const handleKickPlayer = async (player_id: string) => {
    await RemovePlayerFromRoom(roomCode, player_id);
  };

  if (loading || !playerCookie) {
    return (
      <div className="flex justify-center gap-2">
        <Skeleton className="h-20 w-40" />
        <Skeleton className="h-20 w-40" />
        <Skeleton className="h-20 w-40" />
      </div>
    );
  }

  // --- CHECK FOR HOST ---
  const isHost = playerCookie.is_host;

  return (
    <div>
      <p className="text-center font-bold text-2xl">
        Players {playersState.length}/{MAX_NUM_PLAYERS}
      </p>
      <Separator className="my-4" />
      <div className="flex flex-wrap items-center justify-center gap-4">
        {playersState.map((player, index) => (
          <div
            key={index}
            className="text-center border px-8 py-2 rounded-lg relative"
          >
            <p className="text-lg italic font-bold">
              {player.name}: {player.score}
            </p>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className="absolute -top-4 -left-4">
                  {player.is_host && (
                    <div className="p-1 rounded-full border-2 border-black bg-yellow-100">
                      <CrownIcon />
                    </div>
                  )}
                </TooltipTrigger>
                <TooltipContent>
                  <p>Host</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className="absolute -top-4 -right-4">
                  {player.has_answered && (
                    <div className="p-1 rounded-full border-2 border-black bg-green-100">
                      <ThumbsUp />
                    </div>
                  )}
                </TooltipTrigger>
                <TooltipContent>
                  <p>Answered</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {isHost && gameState === "waiting_room" && !player.is_host && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className="absolute -top-4 -right-4">
                    <button
                      onClick={() => handleKickPlayer(player.id)}
                      className="p-1 rounded-full border-2 border-black bg-red-100 hover:bg-red-200"
                    >
                      <X />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Kick</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        ))}
      </div>
      <Separator className="my-8" />
    </div>
  );
};

export default PlayersList;
