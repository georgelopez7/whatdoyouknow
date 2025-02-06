import { NextRequest, NextResponse } from "next/server";
import { CheckIfAllowedInRoom } from "./utils/middleware.utils";

export async function middleware(request: NextRequest) {
  // -- GET REQUEST INFO ---
  const { pathname } = request.nextUrl;
  const requestMethod = request.method;
  const isGETMethod = requestMethod === "GET";

  // --- CHECK FOR "MAINTENANCE" MODE ---
  if (process.env.NEXT_PUBLIC_MAINTENANCE_MODE === "true") {
    if (pathname.startsWith("/api")) {
      return new NextResponse(
        JSON.stringify({ message: "The site is down for maintenance" }),
        {
          status: 503,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
  }

  const roomPath = pathname.startsWith("/rooms");
  const exemptRoomPaths = ["/rooms/join"];
  const roomCode = pathname.split("/")[2] ?? null;
  const isExemptRoomPath = exemptRoomPaths.includes(pathname);

  if (roomPath && roomCode && isGETMethod && !isExemptRoomPath) {
    // --- CHECK IF PLAYER IS ALLOWED IN ROOM ---
    const isAllowedInRoom = await CheckIfAllowedInRoom(request, roomCode);
    if (!isAllowedInRoom) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }
}
