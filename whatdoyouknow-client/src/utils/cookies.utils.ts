import { IPlayer } from "@/contexts/players.context";
import { parseCookies, setCookie, destroyCookie } from "nookies";

export const AddPlayerToCookie = (cookieName: string, player: IPlayer) => {
  const value = JSON.stringify(player);
  setCookie(null, cookieName, value, {
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
  });
};

export const GetPlayerFromCookie = () => {
  const cookies = parseCookies();
  const playerCookie = cookies["player"];

  if (!playerCookie) {
    return null;
  }

  return JSON.parse(playerCookie) as IPlayer;
};

export const ClearPlayerCookie = () => {
  destroyCookie(null, "player", null);
};
