"use client";

import { IQuestion } from "@/actions/questions.actions";
import React, { createContext, useContext, useState } from "react";

interface QuestionContextType {
  question: IQuestion | null;
  setQuestion: React.Dispatch<React.SetStateAction<IQuestion | null>>;
}

interface QuestionProviderProps {
  children: React.ReactNode;
}

const QuestionContext = createContext<QuestionContextType | undefined>(
  undefined
);

export const QuestionProvider = ({ children }: QuestionProviderProps) => {
  // --- STATE TO STORE QUESTION STATE ---
  const [question, setQuestion] = useState<IQuestion | null>(null);

  return (
    <QuestionContext.Provider value={{ question, setQuestion }}>
      {children}
    </QuestionContext.Provider>
  );
};

// --- HOOK TO INTERACT WITH QUESTION STATE ---
export const useQuestion = (): QuestionContextType => {
  const context = useContext(QuestionContext);
  if (!context) {
    throw new Error("useQuestion must be used within a QuestionProvider");
  }
  return context;
};
