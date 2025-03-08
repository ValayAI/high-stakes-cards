
import React from "react";
import { Button } from "@/components/ui/button";
import { useGame } from "@/contexts/GameContext";

const GameControls: React.FC = () => {
  const { state, hit, stand, resetGame, doubleDown } = useGame();
  const { status, player } = state;
  
  if (status === "betting") {
    return null;
  }
  
  const isPlaying = status === "playing";
  const isGameOver = status === "gameOver" || status === "dealerTurn";
  
  return (
    <div className="bg-black/40 p-4 rounded-xl shadow-xl">
      <div className="flex flex-wrap justify-center gap-3">
        {isPlaying && (
          <>
            <Button 
              variant="default" 
              className="bg-red-600 hover:bg-red-700 px-8"
              onClick={hit}
            >
              Hit
            </Button>
            
            <Button 
              variant="default" 
              className="bg-blue-600 hover:bg-blue-700 px-6"
              onClick={stand}
            >
              Stand
            </Button>
            
            <Button 
              variant="default" 
              className="bg-purple-600 hover:bg-purple-700"
              onClick={doubleDown}
              disabled={player.hand.length > 2 || player.bet > player.chips}
            >
              Double Down
            </Button>
          </>
        )}
        
        {isGameOver && (
          <Button 
            variant="default" 
            className="bg-green-600 hover:bg-green-700 px-8"
            onClick={resetGame}
          >
            New Game
          </Button>
        )}
      </div>
    </div>
  );
};

export default GameControls;
