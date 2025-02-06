import { FetchPlayersByRoomCode } from "@/actions/players.actions";
import { FetchRoomByCode } from "@/actions/rooms.actions";
import PageLayout from "@/components/page-layout/page-layout";
import { Separator } from "@/components/ui/separator";
import GameView from "@/components/views/game-view";
import WebsocketManager from "@/components/websocket-manager/websocket-manager";
import { IPlayer } from "@/contexts/players.context";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import React from "react";

interface IRoomPageProps {
  params: { code: string };
}

// --- METADATA ---
export function generateMetadata({ params }: IRoomPageProps): Metadata {
  const roomCode = params.code;
  return {
    title: `Room ${roomCode}`,
    description: `Challenge your friends with AI-generated quiz questions! We hope you're enjoying the game!`,
  };
}

const Page = async ({ params }: IRoomPageProps) => {
  const roomCode = params.code;

  // --- FETCH ROOM INFO ---
  const room = await FetchRoomByCode(roomCode);
  if (!room || !room.is_active) {
    redirect(`/`);
  }

  // --- FETCH PLAYERS ---
  const players: IPlayer[] = await FetchPlayersByRoomCode(roomCode);

  return (
    <PageLayout>
      <WebsocketManager roomCode={roomCode} />
      <Separator className="my-4" />
      <GameView roomCode={roomCode} players={players} />
      <Separator className="my-8" />
    </PageLayout>
  );
};

export default Page;
