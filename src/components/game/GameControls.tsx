
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
      className={`${color} hover:bg-opacity-90 text-pink-300 p-4 rounded-full flex flex-col items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-all w-16 h-16`}
    >
      {icon}
      <span className="text-xs mt-1">{label}</span>
    </button>
  );
  
  return (
    <div className="absolute bottom-0 left-0 right-0 bg-black/90 py-3 border-t border-gray-700">
      <div className="flex justify-evenly px-6">
        <GameButton 
          icon={<X size={20} />} 
          label="CLEAR BETS" 
          onClick={() => {}} 
          disabled={!isPlaying || player.hand.length > 0}
          color="bg-gray-800"
        />
        
        <GameButton 
          icon={<Building2 size={20} />} 
          label="INSURANCE" 
          onClick={() => {}} 
          disabled={!isPlaying || player.hand.length > 2}
          color="bg-gray-800"
        />
        
        <GameButton 
          icon={<ChevronsUp size={20} />} 
          label="DOUBLE" 
          onClick={doubleDown} 
          disabled={!isPlaying || player.hand.length > 2 || player.bet > player.chips}
          color="bg-gray-800"
        />
        
        <GameButton 
          icon={<CornerRightDown size={20} />} 
          label="DOUBLE & DEAL" 
          onClick={() => {
            if (isPlaying) doubleDown();
          }} 
          disabled={!isPlaying || player.hand.length > 2 || player.bet > player.chips}
          color="bg-gray-800"
        />
        
        <GameButton 
          icon={<Split size={20} />} 
          label="SPLIT" 
          onClick={() => {}} 
          disabled={true} // Not implemented yet
          color="bg-gray-800"
        />
        
        <GameButton 
          icon={<RefreshCw size={20} />} 
          label="REBET" 
          onClick={() => {}} 
          disabled={!isGameOver}
          color="bg-gray-800"
        />
        
        <GameButton 
          icon={<CornerRightDown size={20} />} 
          label={isPlaying ? "HIT" : "DEAL"} 
          onClick={isPlaying ? hit : resetGame} 
          color="bg-gray-800"
        />
      </div>
    </div>
  );
};

export default GameControls;
