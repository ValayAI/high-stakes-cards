
import React from "react";
import { useGame } from "@/contexts/GameContext";
import Hand from "./Hand";
import BettingArea from "./BettingArea";
import GameControls from "./GameControls";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Trophy, AlertCircle } from "lucide-react";

const GameBoard: React.FC = () => {
  const { state } = useGame();
  const { player, dealer, status, message } = state;
  
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex flex-col items-center gap-10 p-6 bg-green-800 rounded-3xl shadow-2xl border-8 border-amber-950/50 min-h-[600px]">
        <div className="w-full text-center">
          <h1 className="text-4xl font-bold text-amber-300 tracking-wide mb-2 text-shadow">
            High Stakes Showdown
          </h1>
          
          <Alert className={`mx-auto w-fit text-white border-none ${
            message.includes("win") || message.includes("High Stakes") 
              ? "bg-emerald-700"
              : message.includes("Dealer wins") || message.includes("Busted")
                ? "bg-red-700"
                : "bg-blue-700"
          }`}>
            <AlertDescription className="flex items-center gap-2 font-medium">
              {message.includes("win") || message.includes("High Stakes") ? (
                <Trophy className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              {message}
            </AlertDescription>
          </Alert>
        </div>
        
        {(status !== "betting" || dealer.hand.length > 0) && (
          <div className="w-full">
            <Hand cards={dealer.hand} score={dealer.score} isDealer label="Dealer" />
          </div>
        )}
        
        <div className="flex-grow flex items-center justify-center">
          {status === "betting" && dealer.hand.length === 0 ? (
            <BettingArea />
          ) : (
            <GameControls />
          )}
        </div>
        
        {(status !== "betting" || player.hand.length > 0) && (
          <div className="w-full mt-auto">
            <Hand cards={player.hand} score={player.score} label="Your Hand" />
          </div>
        )}
        
        <div className="bg-black/30 px-4 py-2 rounded-lg text-white">
          Chips: ${player.chips} {player.bet > 0 && `| Current Bet: $${player.bet}`}
        </div>
      </div>
    </div>
  );
};

export default GameBoard;
