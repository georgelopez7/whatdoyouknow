"use client";

import { Separator } from "@/components/ui/separator";
import React, { useEffect, useState } from "react";
import StartGameButton from "./start-game-button";
import QuestionsTopicForm from "@/components/forms/questions-topic-form";
import { BlurFade } from "@/components/ui/blur-fade";
import { GetPlayerFromCookie } from "@/utils/cookies.utils";
import { IPlayer } from "@/contexts/players.context";
import { DNA } from "react-loader-spinner";

interface IWaitingRoomViewProps {
  roomCode: string;
}

const WaitingRoomView = ({ roomCode }: IWaitingRoomViewProps) => {
  // --- STATE ---
  const [readyToStart, setReadyToStart] = useState(false);
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

  // --- CHECK FOR HOST ---
  const isHost = playerCookie.is_host;

  return (
    <div className="w-full">
      <Separator className="my-4" />
      <h1 className="text-6xl font-bold text-center">You are in the room!</h1>
      <Separator className="my-4" />
      <p className="text-center text-lg text-muted-foreground">Room Code:</p>
      <p className="text-center text-3xl font-bold">{roomCode}</p>
      <Separator className="my-8" />
      {isHost && (
        <>
          <BlurFade delay={0.25}>
            <QuestionsTopicForm
              roomCode={roomCode}
              readyToStart={readyToStart}
              setReadyToStart={setReadyToStart}
            />
          </BlurFade>
          <Separator className="my-6" />
          <BlurFade delay={0.25 * 2}>
            <div className="flex flex-col items-center justify-center gap-2">
              <StartGameButton
                roomCode={roomCode}
                readyToStart={readyToStart}
              />
            </div>
          </BlurFade>
        </>
      )}
      {!isHost && (
        <p className="text-center text-lg text-muted-foreground">
          Waiting for host to start the game...
        </p>
      )}
    </div>
  );
};

export default WaitingRoomView;
