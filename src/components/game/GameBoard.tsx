
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
      <div className="flex flex-col items-center gap-8 p-6 bg-gradient-to-b from-emerald-800/90 via-emerald-700/80 to-emerald-900/90 rounded-xl shadow-2xl border-8 border-amber-950/50 min-h-[600px] relative bg-[url('/lovable-uploads/b93821dc-bb88-4840-b44a-76a313ebadb5.png')] bg-cover before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-br before:from-teal-800/30 before:via-emerald-600/20 before:to-blue-900/30 before:z-0 overflow-hidden backdrop-blur-sm">
        <div className="absolute top-2 left-4 z-10 text-left">
          <h1 className="text-4xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-500 drop-shadow-md" style={{ fontFamily: 'Georgia, serif' }}>
            Royal Flush
          </h1>
        </div>
        
        <div className="w-full text-center z-10 mt-14">
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
          <div className="w-full z-10">
            <Hand cards={dealer.hand} score={dealer.score} isDealer label="Dealer" />
          </div>
        )}
        
        <div className="flex-grow flex items-center justify-center z-10 w-full">
          {status === "betting" && dealer.hand.length === 0 ? (
            <BettingArea />
          ) : (
            <GameControls />
          )}
        </div>
        
        {(status !== "betting" || player.hand.length > 0) && (
          <div className="w-full mt-auto z-10">
            <Hand cards={player.hand} score={player.score} label="Your Hand" />
          </div>
        )}
        
        {/* Game stats display - moved up to avoid being cut off */}
        <div className="absolute bottom-3 left-0 right-0 bg-black/70 py-3 px-4 flex justify-between text-white backdrop-blur-sm z-10">
          <div className="flex flex-col items-start">
            <div className="text-xs uppercase tracking-wide text-gray-400">BET</div>
            <div className="text-xl font-bold">${player.bet}</div>
          </div>
          
          <div className="flex flex-col items-start">
            <div className="text-xs uppercase tracking-wide text-gray-400">BALANCE</div>
            <div className="text-xl font-bold">${player.chips}</div>
          </div>
          
          <div className="flex flex-col items-end">
            <div className="text-xs uppercase tracking-wide text-gray-400">WON</div>
            <div className="text-xl font-bold">${state.player.winnings || 0}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameBoard;
