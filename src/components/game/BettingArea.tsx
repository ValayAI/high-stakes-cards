
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
    <div className="w-full max-w-lg mx-auto bg-black/80 p-8 rounded-xl shadow-xl backdrop-blur-sm border border-amber-500/20">
      <h2 className="text-amber-300 text-4xl mb-8 text-center font-bold" style={{ fontFamily: 'Georgia, serif' }}>Place Your Bet</h2>
      
      <div className="flex justify-center mb-8 gap-4 flex-wrap">
        {chipValues.map((value) => (
          <ChipStack 
            key={value} 
            amount={value} 
            onClick={() => handleBet(value)}
            selected={selectedBet === value}
          />
        ))}
      </div>
      
      <div className="flex flex-col items-center gap-4 mt-6">
        <div className="bg-black/50 px-6 py-3 rounded-lg w-full text-center">
          <span className="text-white text-lg">Current Bet: ${state.player.bet}</span>
        </div>
        
        <div className="bg-black/50 px-6 py-3 rounded-lg w-full text-center">
          <span className="text-white text-lg">Chips: ${state.player.chips}</span>
        </div>
        
        <Button 
          variant="default" 
          className="bg-amber-600 hover:bg-amber-700 text-white font-bold w-full mt-4 py-6 text-lg"
          onClick={handlePlaceBet}
          disabled={!selectedBet || selectedBet > state.player.chips}
        >
          Place Bet
        </Button>
      </div>
      
      <div className="text-amber-200 text-sm text-center mt-6">
        <p>Blackjack pays 3 to 2</p>
      </div>
    </div>
  );
};

export default BettingArea;
