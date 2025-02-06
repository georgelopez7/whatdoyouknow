"use client";

import { useGameState } from "@/contexts/game.context";
import React, { ReactElement } from "react";
import WaitingRoomView from "./waiting-room-view/waiting-room-view";
import QuestionView from "./question-view/question-view";
import QuestionAnswerView from "./question-answer-view/question-answer-view";
import ResultsView from "./results-view/results-view";
import IntermissionView from "./intermission-view/intermission-view";

import { IPlayer } from "@/contexts/players.context";
import { Separator } from "../ui/separator";
import { cn } from "@/lib/utils";
import PlayersList from "../players-list/players-list";
interface IGameViewProps {
  roomCode: string;
  players: IPlayer[];
}

const GameView = ({ roomCode, players }: IGameViewProps) => {
  const { gameState } = useGameState();

  // --- SELECT'S THE CORRECT GAME VIEW ---
  const SelectView = (): ReactElement => {
    if (gameState === "waiting_room") {
      return <WaitingRoomView roomCode={roomCode} />;
    }

    if (gameState === "playing") {
      return <QuestionView />;
    }

    if (gameState === "show_question_answer") {
      return <QuestionAnswerView roomCode={roomCode} />;
    }

    if (gameState === "show_results") {
      return <ResultsView roomCode={roomCode} />;
    }

    if (gameState === "intermission") {
      return <IntermissionView />;
    }

    return <></>;
  };

  // --- HIDE PLAYERS LIST ---
  const hidePlayers = ["intermission", "show_results"].includes(gameState);

  return (
    <>
      {SelectView()}
      <div
        className={cn(
          "w-[30vw] flex flex-col items-center justify-center mx-auto gap-2",
          hidePlayers && "hidden"
        )}
      >
        <Separator className="my-8" />
        <PlayersList players={players} roomCode={roomCode} />
      </div>
    </>
  );
};

export default GameView;
