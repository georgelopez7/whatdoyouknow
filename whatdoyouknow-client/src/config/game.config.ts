export const GAME_CONFIG = {
  MAX_NUM_PLAYERS: 6,
  NUM_QUESTIONS: 5,
  TIMEOUT: 10,

  LLM: {
    MODEL: "gpt-4o",
    PROMPT:
      "Create {{ num_of_questions }} multiple-choice questions about the following topic '{{ topic }}'. Each question should have 4 answer options, with one correct answer. Return the output in the following JSON format: {'questions':[{'question':'<the-question>','options':['option 1','option 2','option 3','option 4'],'correct_index':<index of the correct answer in the array>}]}. Make sure the questions are diverse and cover various aspects of the topic.",
  },
};
