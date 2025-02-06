"use client";

import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { StartGame } from "@/actions/games.actions";

import ScaleLoader from "react-spinners/ScaleLoader";
import { CirclePlay, Info } from "lucide-react";

interface IStartGameButtonProps {
  roomCode: string;
  readyToStart: boolean;
}

const StartGameButton = ({ roomCode, readyToStart }: IStartGameButtonProps) => {
  // --- STATE ---
  const [loading, setLoading] = useState(false);

  // --- HANDLE CLICK ---
  const handleStartGameClick = async () => {
    setLoading(true);
    await StartGame(roomCode);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {!readyToStart && (
        <p className="flex items-center gap-2 px-4 py-2 text-blue-800 bg-blue-200 font-bold rounded-lg text-sm">
          <Info />
          <span>
            Please enter the topic of questions you would like to play!
          </span>
        </p>
      )}
      <Button
        onClick={handleStartGameClick}
        disabled={loading || !readyToStart}
      >
        {loading ? (
          <ScaleLoader color="#fff" height={16} />
        ) : (
          <>
            <CirclePlay />
            Start Game
          </>
        )}
      </Button>
    </div>
  );
};

export default StartGameButton;
