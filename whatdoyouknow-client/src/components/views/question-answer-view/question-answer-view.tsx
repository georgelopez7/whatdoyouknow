"use client";

import { ShowResults, StartNextQuestion } from "@/actions/games.actions";
import { BlurFade } from "@/components/ui/blur-fade";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { GAME_CONFIG } from "@/config/game.config";
import { IPlayer } from "@/contexts/players.context";
import { useQuestion } from "@/contexts/question.context";
import { GetPlayerFromCookie } from "@/utils/cookies.utils";
import { CircleArrowRight, Trophy } from "lucide-react";
import React, { useEffect, useState } from "react";
import { DNA } from "react-loader-spinner";
import ScaleLoader from "react-spinners/ScaleLoader";

interface IQuestionAnswerViewProps {
  roomCode: string;
}

const QuestionAnswerView = ({ roomCode }: IQuestionAnswerViewProps) => {
  // --- CONTEXT ---
  const { question } = useQuestion();

  // --- STATE ---
  const [playerCookie, setPlayerCookie] = useState<IPlayer | null>(null);

  // --- PLAYER COOKIE ---
  useEffect(() => {
    const player = GetPlayerFromCookie();
    setPlayerCookie(player);
  }, []);

  // --- STATE ---
  const [loading, setLoading] = useState(false);

  if (!question || !playerCookie)
    return (
      <div className="flex justify-center">
        <DNA visible={true} height="80" width="80" />
      </div>
    );

  // --- QUESTION INFO ---
  const {
    question: questionText,
    options,
    correct_index: correctIndex,
    question_number: questionNumber,
  } = question;

  // --- VALIDATE QUESTION STATE ---
  const correctOption = JSON.parse(options)[correctIndex] as string;
  const isLastQuestion = questionNumber === GAME_CONFIG.NUM_QUESTIONS;

  // --- HANDLE BUTTON CLICK ---
  const handleNextQuestionClick = async () => {
    setLoading(true);
    const { question_number } = question;

    // --- CHECK IF LAST QUESTION ---
    if (isLastQuestion) {
      await ShowResults(roomCode); // SHOW LEADERBOARD RESULTS
    } else {
      await StartNextQuestion(roomCode, question_number);
    }
  };

  // --- CHECK FOR HOST ---
  const isHost = playerCookie.is_host;

  return (
    <div className="w-full">
      <h1 className="text-2xl italic text-muted-foreground text-center">
        Question {question.question_number}
      </h1>
      <Separator className="my-4" />
      <p className="text-center text-3xl font-bold">{questionText}</p>
      <Separator className="my-8" />
      <BlurFade delay={0.25}>
        <div className="flex flex-col border-2 border-black border-dashed px-16 py-4 w-fit mx-auto rounded-lg">
          <p className="text-center italic text-2xl">Answer:</p>
          <Separator className="my-2" />
          <p className="text-center text-4xl">&quot;{correctOption}&quot;</p>
        </div>
      </BlurFade>
      <Separator className="my-8" />
      {isHost && (
        <BlurFade delay={0.25 * 3}>
          <div className="flex justify-center">
            <Button onClick={handleNextQuestionClick} disabled={loading}>
              {loading ? (
                <ScaleLoader color="#fff" height={16} />
              ) : (
                <>
                  {isLastQuestion ? (
                    <>
                      <Trophy />
                      Show Results
                    </>
                  ) : (
                    <>
                      <CircleArrowRight />
                      Next Question
                    </>
                  )}
                </>
              )}
            </Button>
          </div>
        </BlurFade>
      )}
    </div>
  );
};

export default QuestionAnswerView;
