import { IPLayerRecord } from "@/actions/players.actions";
import { IPlayer } from "@/contexts/players.context";

// -- FUNCTION TO CONVERT PLAYER DB RECORD TO PLAYER INTERFACE ---
export const formatPlayers = (playerRecords: IPLayerRecord[]) => {
  const players = playerRecords.map((player) => ({
    ...player,
    has_answered: false, // ADD "HAS_ANSWERED" TO EACH PLAYER
  })) as IPlayer[];

  return players;
};
