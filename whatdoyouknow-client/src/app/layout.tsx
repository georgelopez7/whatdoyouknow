import type { Metadata } from "next";
import "./globals.css";
import { Poppins } from "next/font/google";
import { PlayersProvider } from "@/contexts/players.context";
import { GameStateProvider } from "@/contexts/game.context";
import { QuestionProvider } from "@/contexts/question.context";
import { Toaster } from "@/components/ui/sonner";
import Maintenance from "@/components/maintenance/maintenance";

const poppins = Poppins({
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_HOST!),
  title: {
    default:
      "what do you know? | Challenge your friends with AI-generated quiz questions!",
    template: "%s | what do you know?",
  },
  description: "Challenge your friends with AI-generated quiz questions!",
  twitter: {
    card: "summary_large_image",
  },
};

// --- MAINTENANCE MODE ---
const maintenanceMode = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === "true";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <GameStateProvider>
          <QuestionProvider>
            <PlayersProvider>
              {maintenanceMode ? <Maintenance /> : children}
              <Toaster richColors position="top-center" />
            </PlayersProvider>
          </QuestionProvider>
        </GameStateProvider>
      </body>
    </html>
  );
}
