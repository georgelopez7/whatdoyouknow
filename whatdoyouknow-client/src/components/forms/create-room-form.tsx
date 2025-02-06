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
import { PlusIcon } from "lucide-react";
import { CreateNewRoom } from "@/actions/rooms.actions";
import { RedirectUser } from "@/actions/redirects.actions";
import ScaleLoader from "react-spinners/ScaleLoader";
import { AddPlayerToCookie } from "@/utils/cookies.utils";

const CreateRoomFormSchema = z.object({
  name: z
    .string()
    .min(1, "Please enter a name!")
    .max(20, "Name must be less than 20 characters"),
});

const CreateRoomForm = () => {
  // --- FORM ---
  const form = useForm<z.infer<typeof CreateRoomFormSchema>>({
    resolver: zodResolver(CreateRoomFormSchema),
    defaultValues: {
      name: "",
    },
  });

  // --- STATE ---
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // --- FORM SUBMIT ---
  const onSubmit = async (data: z.infer<typeof CreateRoomFormSchema>) => {
    setLoading(true);
    const { name } = data;
    const { room, hostPlayer, error } = await CreateNewRoom(name);

    if (error) {
      setLoading(false);
      setError(error);
      return;
    }

    AddPlayerToCookie("player", hostPlayer!);
    RedirectUser(`/rooms/${room?.room_code}`);
  };

  return (
    <Form {...form}>
      <p>Enter your name:</p>
      <Separator className="my-2" />
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
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
                <PlusIcon />
                Create Room
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CreateRoomForm;
