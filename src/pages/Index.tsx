
import React from "react";
import GameBoard from "@/components/game/GameBoard";
import { GameProvider } from "@/contexts/GameContext";

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-900 to-green-950 p-4">
      <GameProvider>
        <GameBoard />
      </GameProvider>
    </div>
  );
};

export default Index;
