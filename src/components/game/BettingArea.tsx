
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useGame } from "@/contexts/GameContext";
import ChipStack from "./ChipStack";

const BettingArea: React.FC = () => {
  const { state, placeBet } = useGame();
  const [selectedBet, setSelectedBet] = useState<number | null>(null);
  
  const chipValues = [5, 25, 50, 100, 500];
  
  const handleBet = (amount: number) => {
    setSelectedBet(amount);
  };
  
  const handlePlaceBet = () => {
    if (selectedBet) {
      placeBet(selectedBet); // This will now trigger the deal cards functionality automatically
    }
  };
  
  return (
    <div className="w-full max-w-md mx-auto bg-black/70 p-8 rounded-xl shadow-xl backdrop-blur-sm border border-amber-500/20">
      <h2 className="text-amber-300 text-3xl mb-6 text-center font-bold" style={{ fontFamily: 'Georgia, serif' }}>Place Your Bet</h2>
      
      <div className="flex justify-center mb-6 gap-2 flex-wrap">
        {chipValues.map((value) => (
          <ChipStack 
            key={value} 
            amount={value} 
            onClick={() => handleBet(value)}
            selected={selectedBet === value}
          />
        ))}
      </div>
      
      <div className="flex flex-col items-center gap-4">
        <div className="bg-white/10 px-4 py-2 rounded-lg">
          <span className="text-white">Current Bet: ${state.player.bet}</span>
        </div>
        
        <div className="bg-white/10 px-4 py-2 rounded-lg">
          <span className="text-white">Chips: ${state.player.chips}</span>
        </div>
        
        <Button 
          variant="default" 
          className="bg-amber-600 hover:bg-amber-700 text-white font-bold w-full mt-2"
          onClick={handlePlaceBet}
          disabled={!selectedBet || selectedBet > state.player.chips}
        >
          Place Bet
        </Button>
      </div>
    </div>
  );
};

export default BettingArea;
