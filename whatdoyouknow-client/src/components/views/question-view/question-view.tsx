import { AnswerQuestion, ShowQuestionAnswer } from "@/actions/games.actions";
import { BlurFade } from "@/components/ui/blur-fade";
import { Separator } from "@/components/ui/separator";
import { IPlayer, usePlayers } from "@/contexts/players.context";
import { useQuestion } from "@/contexts/question.context";
import { GetPlayerFromCookie } from "@/utils/cookies.utils";
import React, { useEffect, useState } from "react";
import { DNA } from "react-loader-spinner";

const QuestionView = () => {
  // --- CONTEXT ---
  const { question } = useQuestion();
  const { players, hasPlayerAnswered, checkIfAllPlayersHaveAnswered } =
    usePlayers();

  // --- STATE ---
  const [playerCookie, setPlayerCookie] = useState<IPlayer | null>(null);

  // --- PLAYER COOKIE ---
  useEffect(() => {
    const player = GetPlayerFromCookie();
    setPlayerCookie(player);
  }, []);

  // --- HANDLE PLAYER'S ANSWERS ---
  const [hasAnswered, setHasAnswered] = useState<boolean>(false);
  useEffect(() => {
    if (!question || !playerCookie) return;

    // --- CHECK IF PLAYER HAS ANSWERED ---
    const hasAnswered = hasPlayerAnswered(playerCookie.id);
    setHasAnswered(hasAnswered);

    // --- CHECK IF ALL PLAYERS HAVE ANSWERED ---
    const hasAllPlayersAnswered = checkIfAllPlayersHaveAnswered();
    if (hasAllPlayersAnswered && playerCookie.is_host) {
      setTimeout(() => {
        const { id: questionID, room_code: roomCode } = question!;
        ShowQuestionAnswer(roomCode, questionID);
      }, 2000);
    }
  }, [
    players,
    question,
    playerCookie,
    hasPlayerAnswered,
    checkIfAllPlayersHaveAnswered,
  ]);

  if (!question) {
    return (
      <div className="flex justify-center">
        <DNA visible={true} height="80" width="80" />
      </div>
    );
  }

  // --- FORMAT QUESTION OPTIONS ---
  const options = JSON.parse(question.options) as string[];

  // --- HANDLE OPTION CLICK ---
  const handleOptionClick = async (value: number) => {
    // --- GET QUESTION INFO ---
    const {
      id: questionID,
      room_code: roomCode,
      correct_index: correctIndex,
    } = question;

    // --- ANSWER QUESTION ---
    const isCorrectAnswer = correctIndex === value;
    await AnswerQuestion(
      roomCode,
      questionID,
      playerCookie!.id,
      isCorrectAnswer
    );
  };

  return (
    <div className="w-full">
      <h1 className="text-2xl italic text-muted-foreground text-center">
        Question {question.question_number}
      </h1>
      <Separator className="my-4" />
      <BlurFade delay={0.25}>
        <p className="text-center text-3xl font-bold">{question.question}</p>
      </BlurFade>
      <Separator className="my-8" />
      <div className="grid grid-cols-2 mx-auto gap-4">
        {options.map((option, index) => (
          <BlurFade key={index} delay={0.25 * (index + 2)}>
            <button
              className="w-full h-full p-8 text-lg border-2 rounded-xl hover:bg-accent hover:text-accent-foreground text-center disabled:pointer-events-none disabled:opacity-50"
              disabled={hasAnswered}
              value={index}
              onClick={() => handleOptionClick(index)}
            >
              {option}
            </button>
          </BlurFade>
        ))}
      </div>
      <Separator className="my-4" />
      {hasAnswered && (
        <p className="text-center font-bold italic text-xl text-green-800">
          Waiting for all participants to answer...
        </p>
      )}
    </div>
  );
};

export default QuestionView;
