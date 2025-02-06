"use server";

export const StartGame = async (roomCode: string) => {
  // --- SEND POST REQUEST ---
  const response = await fetch(
    `${process.env.WHATDOYOUKNOW_SERVER_URL}/api/v1/rooms/${roomCode}/actions/start-game`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.WHATDOYOUKNOW_SERVER_TOKEN}`,
      },
      body: JSON.stringify({}),
    }
  );

  if (!response.ok) {
    return {
      error: "Failed to start game",
    };
  }

  return { error: null };
};

export const AnswerQuestion = async (
  roomCode: string,
  questionID: string,
  playerID: string,
  isCorrect: boolean
) => {
  // --- SEND POST REQUEST ---
  const response = await fetch(
    `${process.env.WHATDOYOUKNOW_SERVER_URL}/api/v1/rooms/${roomCode}/actions/answer-question`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.WHATDOYOUKNOW_SERVER_TOKEN}`,
      },
      body: JSON.stringify({
        question_id: questionID,
        player_id: playerID,
        is_correct: isCorrect,
      }),
    }
  );

  if (!response.ok) {
    return {
      error: "Failed to answer question",
    };
  }

  return { error: null };
};

export const ShowQuestionAnswer = async (
  roomCode: string,
  questionID: string
) => {
  // --- SEND POST REQUEST ---
  const response = await fetch(
    `${process.env.WHATDOYOUKNOW_SERVER_URL}/api/v1/rooms/${roomCode}/actions/show-question-answer`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.WHATDOYOUKNOW_SERVER_TOKEN}`,
      },
      body: JSON.stringify({
        question_id: questionID,
      }),
    }
  );

  if (!response.ok) {
    return {
      error: "Failed to show question answer",
    };
  }

  return { error: null };
};

export const StartNextQuestion = async (
  roomCode: string,
  questionNumberCurrent: number
) => {
  // --- SEND POST REQUEST ---
  const response = await fetch(
    `${process.env.WHATDOYOUKNOW_SERVER_URL}/api/v1/rooms/${roomCode}/actions/start-next-question`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.WHATDOYOUKNOW_SERVER_TOKEN}`,
      },
      body: JSON.stringify({
        question_number_current: questionNumberCurrent,
      }),
    }
  );

  if (!response.ok) {
    return {
      error: "Failed to show question answer",
    };
  }

  return { error: null };
};

export const ShowResults = async (roomCode: string) => {
  // --- SEND POST REQUEST ---
  const response = await fetch(
    `${process.env.WHATDOYOUKNOW_SERVER_URL}/api/v1/rooms/${roomCode}/actions/show-results`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.WHATDOYOUKNOW_SERVER_TOKEN}`,
      },
      body: JSON.stringify({}),
    }
  );

  if (!response.ok) {
    return {
      error: "Failed to show results",
    };
  }

  return { error: null };
};

export const EndGame = async (roomCode: string) => {
  // --- SEND POST REQUEST ---
  const response = await fetch(
    `${process.env.WHATDOYOUKNOW_SERVER_URL}/api/v1/rooms/${roomCode}/actions/end-game`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.WHATDOYOUKNOW_SERVER_TOKEN}`,
      },
      body: JSON.stringify({}),
    }
  );

  if (!response.ok) {
    return {
      error: "Failed to end game",
    };
  }

  return { error: null };
};
