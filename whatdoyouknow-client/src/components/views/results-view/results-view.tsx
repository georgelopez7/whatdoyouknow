"use client";

import { EndGame } from "@/actions/games.actions";
import { RedirectUser } from "@/actions/redirects.actions";
import { BlurFade } from "@/components/ui/blur-fade";
import { Button } from "@/components/ui/button";
import Confetti from "@/components/ui/confetti";
import { Separator } from "@/components/ui/separator";
import { IPlayer, usePlayers } from "@/contexts/players.context";
import { GetPlayerFromCookie } from "@/utils/cookies.utils";
import { getLeaderboardEmoji } from "@/utils/utils";
import { CircleX } from "lucide-react";
import React, { useEffect, useState } from "react";
import { DNA } from "react-loader-spinner";

interface IResultsViewProps {
  roomCode: string;
}

const ResultsView = ({ roomCode }: IResultsViewProps) => {
  // --- CONTEXT ---
  const { players } = usePlayers();

  // --- STATE ---
  const [playerCookie, setPlayerCookie] = useState<IPlayer | null>(null);

  // --- PLAYER COOKIE ---
  useEffect(() => {
    const player = GetPlayerFromCookie();
    setPlayerCookie(player);
  }, []);

  if (!playerCookie) {
    return (
      <div className="flex flex-col items-center justify-center">
        <DNA visible={true} height="80" width="80" />
      </div>
    );
  }

  // --- SORT PLAYERS BY SCORE (HIGHEST TO LOWEST) ---
  const sortedPlayers = players.sort((a, b) => b.score - a.score);
  const numOfPlayers = players.length;

  // --- CHECK FOR HOST ---
  const isHost = playerCookie.is_host;

  // --- ENDS THE GAME ---
  const handleEndGameClick = async () => {
    await EndGame(roomCode);
  };

  return (
    <div className="w-full">
      <h1 className="text-6xl font-bold text-center">Results</h1>
      <Separator className="my-8" />
      <div className="flex flex-col md:w-4/5 lg:w-2/5 mx-auto space-y-4">
        {sortedPlayers.map((player, index) => (
          <BlurFade key={index} delay={0.5 * (numOfPlayers - index)}>
            <div className="flex items-center justify-between text-2xl gap-8">
              <div className="flex items-center gap-2">
                {getLeaderboardEmoji(index + 1)}
                <p>{player.name}:</p>
              </div>
              <p>{player.score}</p>
            </div>
          </BlurFade>
        ))}
      </div>
      <Separator className="my-8" />
      <p className="text-xl font-bold text-center">Thank you for playing!</p>
      <Separator className="my-8" />
      {isHost && (
        <div className="flex justify-center">
          <Button onClick={handleEndGameClick}>
            <CircleX /> End Game
          </Button>
        </div>
      )}
      {!isHost && (
        <div className="flex justify-center">
          <Button onClick={() => RedirectUser("/")}>
            <CircleX /> Leave Game
          </Button>
        </div>
      )}
      <Confetti />
    </div>
  );
};

export default ResultsView;
