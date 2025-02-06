import JoinRoomForm from "@/components/forms/join-room-form";
import PageLayout from "@/components/page-layout/page-layout";
import { Separator } from "@/components/ui/separator";
import React from "react";

export const metadata = {
  title: "Join Room",
  description:
    "Get a room code from the host and join the room to start playing!",
};

const Page = () => {
  return (
    <PageLayout>
      <Separator className="my-8" />
      <h1 className="text-6xl font-bold text-center">Join Room</h1>
      <Separator className="my-2" />
      <p className="text-center text-lg text-muted-foreground">
        Add code supplied by host
      </p>
      <Separator className="my-8" />
      <div className="w-full md:w-[40vw] lg:w-[20vw] flex flex-col items-center justify-center mx-auto">
        <JoinRoomForm />
      </div>
    </PageLayout>
  );
};

export default Page;
