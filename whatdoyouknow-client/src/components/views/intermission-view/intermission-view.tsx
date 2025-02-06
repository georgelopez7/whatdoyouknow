"use client";

import { Separator } from "@/components/ui/separator";
import { TypingAnimation } from "@/components/ui/typing-animation";
import { useGameState } from "@/contexts/game.context";
import { DNA } from "react-loader-spinner";
import React from "react";

const IntermissionView = () => {
  const { intermissionText } = useGameState();

  return (
    <div>
      <Separator className="my-4" />
      <div className="flex flex-col justify-center items-center">
        <TypingAnimation duration={50} className="min-h-[80px] text-center">
          {intermissionText}
        </TypingAnimation>
        <DNA visible={true} height="80" width="80" />
      </div>
    </div>
  );
};

export default IntermissionView;
