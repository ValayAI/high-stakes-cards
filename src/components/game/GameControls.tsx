
import React from "react";
import { Button } from "@/components/ui/button";
import { useGame } from "@/contexts/GameContext";
import { X, ChevronsUp, Building2, RefreshCw, Split, CornerRightDown } from "lucide-react";

const GameControls: React.FC = () => {
  const { state, hit, stand, resetGame, doubleDown } = useGame();
  const { status, player } = state;
  
  if (status === "betting") {
    return null;
  }
  
  const isPlaying = status === "playing";
  const isGameOver = status === "gameOver" || status === "dealerTurn";
  
  const GameButton = ({ icon, label, onClick, disabled = false, color = "bg-gray-800" }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${color} hover:bg-opacity-90 text-amber-100 p-4 rounded-full flex flex-col items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-all w-16 h-16 shadow-md`}
    >
      {icon}
      <span className="text-xs mt-1 font-medium">{label}</span>
    </button>
  );
  
  return (
    <div className="w-full bg-black/90 py-4 rounded-lg border border-amber-600/30 backdrop-blur-sm">
      <div className="flex justify-center items-center gap-6 px-6 flex-wrap">
        <GameButton 
          icon={<ChevronsUp size={20} />} 
          label="DOUBLE" 
          onClick={doubleDown} 
          disabled={!isPlaying || player.hand.length > 2 || player.bet > player.chips}
          color="bg-amber-700"
        />
        
        <GameButton 
          icon={<RefreshCw size={20} />} 
          label="NEW HAND" 
          onClick={resetGame} 
          disabled={!isGameOver}
          color="bg-emerald-700"
        />
        
        {isPlaying && (
          <>
            <GameButton 
              icon={<CornerRightDown size={20} />} 
              label="HIT" 
              onClick={hit} 
              color="bg-blue-700"
            />
            
            <GameButton 
              icon={<X size={20} />} 
              label="STAND" 
              onClick={stand}
              color="bg-rose-700"
            />
          </>
        )}
      </div>
    </div>
  );
};

export default GameControls;
