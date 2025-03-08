
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
    <div className="w-full max-w-5xl mx-auto">
      <div className="flex flex-col items-center gap-8 p-6 bg-emerald-800 rounded-xl shadow-2xl border-8 border-amber-950/50 min-h-[600px] relative bg-[url('/lovable-uploads/9a705cdc-4772-449f-9acf-daf43e60922a.png')] bg-cover">
        <div className="w-full text-center">
          <h1 className="text-4xl font-bold text-amber-300 tracking-wide mb-2 drop-shadow-lg">
            Blackjack
          </h1>
          
          <Alert className={`mx-auto w-fit text-white border-none backdrop-blur-sm ${
            message.includes("win") || message.includes("Blackjack") 
              ? "bg-emerald-700/80"
              : message.includes("Dealer wins") || message.includes("Busted")
                ? "bg-rose-700/80"
                : "bg-blue-700/80"
          }`}>
            <AlertDescription className="flex items-center gap-2 font-medium">
              {message.includes("win") || message.includes("Blackjack") ? (
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
        
        {/* Game stats display */}
        <div className="absolute bottom-0 left-0 right-0 bg-black/70 py-2 px-4 flex justify-between text-white backdrop-blur-sm">
          <div className="flex flex-col items-start">
            <div className="text-xs uppercase tracking-wide text-gray-400">BET</div>
            <div className="text-2xl font-bold">${player.bet}</div>
          </div>
          
          <div className="flex flex-col items-start">
            <div className="text-xs uppercase tracking-wide text-gray-400">BALANCE</div>
            <div className="text-2xl font-bold">${player.chips}</div>
          </div>
          
          <div className="flex flex-col items-end">
            <div className="text-xs uppercase tracking-wide text-gray-400">WON</div>
            <div className="text-2xl font-bold">${state.player.winnings || 0}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameBoard;
