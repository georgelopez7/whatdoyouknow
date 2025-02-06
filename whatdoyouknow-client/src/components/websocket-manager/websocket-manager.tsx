"use client";

import { EndGame } from "@/actions/games.actions";
import { IPLayerRecord, RemovePlayerFromRoom } from "@/actions/players.actions";
import { IQuestion } from "@/actions/questions.actions";
import { RedirectUser } from "@/actions/redirects.actions";
import { useGameState } from "@/contexts/game.context";
import { IPlayer, usePlayers } from "@/contexts/players.context";
import { useQuestion } from "@/contexts/question.context";
import { cn } from "@/lib/utils";
import { ClearPlayerCookie, GetPlayerFromCookie } from "@/utils/cookies.utils";
import { formatPlayers } from "@/utils/player.utils";
import { sleep } from "@/utils/utils";
import { Plug } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

export type IWebsocketEvent =
  | "add_player"
  | "start_game"
  | "player_answer"
  | "remove_player"
  | "update_player_scores"
  | "show_question_answer"
  | "next_question"
  | "show_results"
  | "end_game";
interface IWebsocketManagerProps {
  roomCode: string;
}

const WebsocketManager = ({ roomCode }: IWebsocketManagerProps) => {
  // --- CONTEXT STATES ---
  const { addPlayer, removePlayer, setPlayers, setPlayerToAnswered } =
    usePlayers();
  const { setQuestion } = useQuestion();
  const { setGameState, setIntermissionText } = useGameState();

  // --- STATE ---
  const [connected, setConnected] = useState(false);
  const socket = useRef<WebSocket | null>(null);

  // --- GAME STATE ---
  useEffect(() => {
    // --- PLAYER COOKIE ---
    const playerCookie = GetPlayerFromCookie() as IPlayer;
    const isHost = playerCookie.is_host;
    const playerCookieID = playerCookie.id;

    // --- FUNCTION TO CREATE SOCKET CONNECTION ---
    const createSocketConnection = () => {
      // --- WEBSOCKET SERVER URL ---
      const websocketServerURL =
        process.env.NEXT_PUBLIC_WHATDOYOUKNOW_WEBSOCKET_URL;

      // --- CONNECT WEBSOCKET ---
      socket.current = new WebSocket(`${websocketServerURL}/ws/${roomCode}`);

      // --- OPEN SOCKET CONNECTION ---
      socket.current.onopen = () => {
        setConnected(true);
      };

      // --- CLOSE SOCKET CONNECTION ---
      socket.current.onclose = () => {
        setConnected(false);
        cleanUpSocketConnection(playerCookieID, isHost);
      };

      // --- RECEIVING MESSAGES FROM SERVER ---
      socket.current.onmessage = async (event) => {
        const eventType = JSON.parse(event.data)[
          "event_type"
        ] as IWebsocketEvent;

        // --- [EVENT] ADD PLAYER ---
        if (eventType === "add_player") {
          const player = JSON.parse(event.data)["player"] as IPlayer;
          addPlayer(player);
        }

        // --- [EVENT] REMOVE PLAYER ---
        if (eventType === "remove_player") {
          const playerID = JSON.parse(event.data)["player_id"] as string;
          removePlayer(playerID); // REMOVE PLAYER FROM STATE

          const isYou = playerID === playerCookieID;
          if (isYou) {
            const kickedMessage = "host kicked you from the room";
            RedirectUser(`/?message=${kickedMessage}`);
          }
        }

        // --- [EVENT] START GAME ---
        if (eventType === "start_game") {
          const question = JSON.parse(event.data)["question"] as IQuestion;
          setQuestion(question);

          setIntermissionText("Time to start! Who's going to win?!");
          setGameState("intermission");
          await sleep(3000);

          setGameState("playing");
        }

        // --- [EVENT] PLAYER ANSWER ---
        if (eventType === "player_answer") {
          const playerID = JSON.parse(event.data)["player_id"] as string;
          setPlayerToAnswered(playerID);
        }

        // --- [EVENT] UPDATE PLAYER SCORES ---
        if (eventType === "update_player_scores") {
          const playerRecords = JSON.parse(event.data)[
            "players"
          ] as IPLayerRecord[];
          const players = formatPlayers(playerRecords);
          setPlayers(players);
        }

        // --- [EVENT] SHOW QUESTION ANSWER ---
        if (eventType === "show_question_answer") {
          setGameState("show_question_answer");
        }

        // --- [EVENT] SHOW NEXT QUESTION ---
        if (eventType === "next_question") {
          const question = JSON.parse(event.data)["question"] as IQuestion;
          setQuestion(question);
          setIntermissionText(
            `Who's ready for question ${question.question_number}?!`
          );
          setGameState("intermission");
          await sleep(3000);

          setGameState("playing");
        }

        // --- [EVENT] SHOW RESULTS ---
        if (eventType === "show_results") {
          setIntermissionText("Preparing the results!");
          setGameState("intermission");
          await sleep(3000);

          setGameState("show_results");
        }

        // --- [EVENT] END GAME ---
        if (eventType === "end_game") {
          ClearPlayerCookie();
          const endMessage = "host ended the game";
          RedirectUser(`/?message=${endMessage}`);
        }
      };
    };

    // --- CREATE SOCKET CONNECTION ---
    if (!socket.current) {
      createSocketConnection();
    }

    // --- CLEAN UP SOCKET CONNECTION ON UNMOUNT ---
    return () => {
      if (!socket.current) return;
      socket.current.close();
    };

    /* eslint-disable-next-line */
  }, []);

  // --- CLEAN UP SOCKET CONNECTION ---
  const cleanUpSocketConnection = async (playerID: string, isHost: boolean) => {
    // --- CHECK IF HOST [END GAME FOR EVERYONE] ---
    if (isHost) {
      await EndGame(roomCode);
    }

    // --- REMOVE PLAYER & CLOSE SOCKET ---
    await RemovePlayerFromRoom(roomCode, playerID);
    await sleep(1000);
    setGameState("waiting_room"); // RESET GAME STATE
    ClearPlayerCookie(); // CLEAR PLAYER COOKIE
    setConnected(false);
  };

  // --- DEBUG MODE ---
  const isDebugMode = false;

  return (
    <>
      {isDebugMode && (
        <div
          className={cn(
            connected
              ? "bg-green-200 text-green-800"
              : "bg-red-200 text-red-800",
            "flex items-center gap-2 w-fit mx-auto text-center text-sm px-4 py-2 rounded-lg font-bold"
          )}
        >
          <Plug />
          {connected ? <p>Connected</p> : <p>Not connected</p>}
        </div>
      )}
    </>
  );
};

export default WebsocketManager;
