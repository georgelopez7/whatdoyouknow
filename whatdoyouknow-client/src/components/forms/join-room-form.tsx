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
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckForValidRoomByCode } from "@/actions/rooms.actions";
import { RedirectUser } from "@/actions/redirects.actions";
import { AddPlayerToRoom } from "@/actions/players.actions";
import ScaleLoader from "react-spinners/ScaleLoader";
import { PersonStandingIcon } from "lucide-react";
import { AddPlayerToCookie } from "@/utils/cookies.utils";

const JoinRoomFormSchema = z.object({
  code: z.string().min(1, "Please enter your code!"),
  name: z
    .string()
    .min(1, "Please enter your name!")
    .max(20, "Name must be less than 20 characters"),
});

const JoinRoomForm = () => {
  // --- FORM ---
  const form = useForm<z.infer<typeof JoinRoomFormSchema>>({
    resolver: zodResolver(JoinRoomFormSchema),
    defaultValues: {
      code: "",
      name: "",
    },
  });

  // --- ERROR STATE ---
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // --- FORM SUBMIT ---
  const onSubmit = async (data: z.infer<typeof JoinRoomFormSchema>) => {
    setLoading(true);
    const { code, name } = data;

    // --- CHECK FOR VALID ROOM CODE ---
    const { room, error } = await CheckForValidRoomByCode(code);
    if (error || !room) {
      setLoading(false);
      setError(error);
      return;
    }

    // --- ADD PLAYER TO THE ROOM ---
    const roomCode = room.room_code;
    const { player, error: playerError } = await AddPlayerToRoom(
      roomCode,
      name
    );

    if (playerError) {
      setLoading(false);
      setError(playerError);
      return;
    }

    AddPlayerToCookie("player", player!);
    RedirectUser(`/rooms/${roomCode}`);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <p>Enter room code:</p>
        <Separator className="my-1" />
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Enter code here" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Separator className="my-4" />
        <p>Enter name:</p>
        <Separator className="my-1" />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Enter name here" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Separator className="my-2" />
        {error && <p className="text-center text-red-800">{error}</p>}
        <Separator className="my-2" />
        <div className="flex flex-col items-center justify-center">
          <Button type="submit" disabled={loading}>
            {loading ? (
              <ScaleLoader color="#fff" height={16} />
            ) : (
              <>
                <PersonStandingIcon />
                Join Room
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default JoinRoomForm;
