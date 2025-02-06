"use client";

import * as z from "zod";
import React, { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ScaleLoader from "react-spinners/ScaleLoader";
import { CircleCheck, Newspaper, TriangleAlert } from "lucide-react";
import { CreateQuestions } from "@/actions/questions.actions";
import { Textarea } from "../ui/textarea";

const QuestionsTopicFormSchema = z.object({
  topic: z
    .string()
    .min(1, "Please enter a topic")
    .max(100, "Topic must be less than 100 characters"),
});

interface IQuestionsTopicForm {
  roomCode: string;
  readyToStart: boolean;
  setReadyToStart: React.Dispatch<React.SetStateAction<boolean>>;
}

const QuestionsTopicForm = ({
  roomCode,
  readyToStart,
  setReadyToStart,
}: IQuestionsTopicForm) => {
  // --- FORM ---
  const form = useForm<z.infer<typeof QuestionsTopicFormSchema>>({
    resolver: zodResolver(QuestionsTopicFormSchema),
    defaultValues: {
      topic: "",
    },
  });

  // --- ERROR STATE ---
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // --- FORM SUBMIT ---
  const onSubmit = async (data: z.infer<typeof QuestionsTopicFormSchema>) => {
    setError(null);
    setLoading(true);
    const { topic } = data;

    const { error } = await CreateQuestions(roomCode, topic);
    if (error) {
      setLoading(false);
      setError(error);
      return;
    }

    setLoading(false);
    setReadyToStart(true);
  };

  // --- CHECK MOCK DATA MODE ---
  const isMockDataMode = process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true";

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mx-auto w-full lg:w-3/5"
      >
        <div className="flex justify-between flex-wrap items-center">
          {isMockDataMode && (
            <div className="flex items-center gap-2 px-4 py-2 text-yellow-800 bg-yellow-200 font-bold rounded-lg text-sm">
              <TriangleAlert />
              <p>
                Currently in mock data mode: Using default questions - no calls
                to chatgpt will be made.
              </p>
            </div>
          )}
          <Separator className="my-2" />
          <p className="text-center">Enter topic of questions:</p>
          <p className="text-center text-sm text-muted-foreground italic">
            Max 100 characters
          </p>
        </div>
        <Separator className="my-1" />
        <FormField
          control={form.control}
          name="topic"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  className="  min-h-[100px]"
                  disabled={readyToStart}
                  placeholder="Enter questions topic here"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Separator className="my-1" />
        <p className="text-center text-xs">
          Example:{" "}
          <span className="font-bold italic">
            &quot;football teams around the world&quot;
          </span>
        </p>
        <Separator className="my-2" />
        {error && <p className="text-center text-red-800">{error}</p>}
        <Separator className="my-2" />
        <div className="flex flex-col items-center justify-center">
          <Button type="submit" disabled={loading || readyToStart}>
            {loading ? (
              <ScaleLoader color="#fff" height={16} />
            ) : (
              <>
                <Newspaper />
                Create Questions
              </>
            )}
          </Button>
          <Separator className="my-4" />
          {readyToStart && (
            <p className="flex items-center gap-2 px-4 py-2 text-green-800 bg-green-200 font-bold rounded-lg text-sm">
              <CircleCheck />
              <span>Ready to start!</span>
            </p>
          )}
        </div>
      </form>
    </Form>
  );
};

export default QuestionsTopicForm;
