
import React from "react";
import { useGame } from "@/contexts/GameContext";
import Hand from "./Hand";
import BettingArea from "./BettingArea";
import GameControls from "./GameControls";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Trophy, AlertCircle, Coins } from "lucide-react";

const GameBoard: React.FC = () => {
  const { state } = useGame();
  const { player, dealer, status, message } = state;
  
  return (
    <div className="w-full max-w-5xl mx-auto flex">
      {/* Main Game Area */}
      <div className="flex flex-col items-center gap-8 p-6 bg-gradient-to-b from-emerald-800/90 via-emerald-700/80 to-emerald-900/90 rounded-l-xl shadow-2xl border-l-8 border-t-8 border-b-8 border-amber-950/50 min-h-[600px] relative bg-[url('/lovable-uploads/63fe6dd7-b415-4288-b38f-4069e2e2e3fd.png')] bg-cover before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-br before:from-teal-800/30 before:via-emerald-600/20 before:to-blue-900/30 before:z-0 overflow-hidden backdrop-blur-sm flex-grow">
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
        
        <div className="flex-grow flex items-center justify-center z-10 w-full py-4">
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
      </div>
      
      {/* Right Stats Sidebar */}
      <div className="w-72 bg-black/80 rounded-r-xl border-r-8 border-t-8 border-b-8 border-amber-950/50 p-6 flex flex-col justify-between backdrop-blur-sm">
        <div>
          <h2 className="text-amber-300 text-2xl font-bold mb-8 text-center" style={{ fontFamily: 'Georgia, serif' }}>Game Stats</h2>
          
          <div className="space-y-6">
            <div className="bg-black/50 rounded-lg p-4 border border-amber-900/30">
              <div className="text-xs uppercase tracking-wide text-gray-400 mb-1">Current Bet</div>
              <div className="text-2xl font-bold text-amber-300 flex items-center">
                <Coins className="h-5 w-5 mr-2 text-amber-400" />
                ${player.bet}
              </div>
            </div>
            
            <div className="bg-black/50 rounded-lg p-4 border border-amber-900/30">
              <div className="text-xs uppercase tracking-wide text-gray-400 mb-1">Your Balance</div>
              <div className="text-2xl font-bold text-green-400 flex items-center">
                <Coins className="h-5 w-5 mr-2 text-green-500" />
                ${player.chips}
              </div>
            </div>
            
            <div className="bg-black/50 rounded-lg p-4 border border-amber-900/30">
              <div className="text-xs uppercase tracking-wide text-gray-400 mb-1">Total Won</div>
              <div className="text-2xl font-bold text-purple-400 flex items-center">
                <Trophy className="h-5 w-5 mr-2 text-purple-500" />
                ${state.player.winnings || 0}
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-auto pt-4">
          <div className="text-amber-200 text-sm text-center p-3 bg-amber-950/50 rounded-lg border border-amber-700/30">
            <p className="font-medium">Blackjack pays 3:2</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameBoard;
