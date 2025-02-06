"use server";

import { GAME_CONFIG } from "@/config/game.config";

export type IQuestion = {
  id: string;
  room_code: string;
  question: string;
  question_number: number;
  options: string;
  correct_index: number;
  created_at: Date;
};

const model = GAME_CONFIG.LLM.MODEL;
const numOfQuestions = GAME_CONFIG.NUM_QUESTIONS;

export const CreateQuestions = async (roomCode: string, topic: string) => {
  // --- CREATE PROMPT ---
  const prompt = GAME_CONFIG.LLM.PROMPT.replace("{{ topic }}", topic).replace(
    "{{ num_of_questions }}",
    numOfQuestions.toString()
  );

  // --- CHECK FOR MOCK DATA MODE ---
  const useMockData = process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true";

  // --- CREATE ENDPOINT ---
  let endpoint = `${process.env.WHATDOYOUKNOW_SERVER_URL}/api/v1/questions/${roomCode}`;
  if (useMockData) {
    endpoint = endpoint + "/mock"; // MOCKS CHATGPT RESPONSE
  }

  // --- SEND POST REQUEST --
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.WHATDOYOUKNOW_SERVER_TOKEN}`,
    },
    body: JSON.stringify({
      model: model,
      prompt: prompt,
    }),
  });

  if (!response.ok) {
    return {
      questions: null,
      error: "Failed to create questions",
    };
  }

  // --- PARSE RESPONSE ---
  const { questions } = (await response.json()) as { questions: IQuestion[] };
  return { questions, error: null };
};
