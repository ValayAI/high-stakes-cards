
import React from "react";
import { Card as CardType, Suit } from "@/types/game";
import { Heart, Diamond, Club, Spade } from "lucide-react";

interface CardProps {
  card: CardType;
}

const Card: React.FC<CardProps> = ({ card }) => {
  if (!card.faceUp) {
    // Card back design
    return (
      <div className="w-24 h-36 rounded-lg border-2 border-white bg-gradient-to-br from-blue-900 to-blue-700 shadow-lg flex items-center justify-center text-white animate-fade-in">
        <div className="grid grid-cols-3 grid-rows-3 gap-1">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="w-4 h-4 rounded-full bg-blue-500"></div>
          ))}
        </div>
      </div>
    );
  }

  const getSuitColor = (suit: Suit) => {
    return suit === "hearts" || suit === "diamonds" ? "text-red-600" : "text-black";
  };

  const getSuitIcon = (suit: Suit) => {
    switch (suit) {
      case "hearts":
        return <Heart className="w-4 h-4 fill-current" />;
      case "diamonds":
        return <Diamond className="w-4 h-4 fill-current" />;
      case "clubs":
        return <Club className="w-4 h-4" />;
      case "spades":
        return <Spade className="w-4 h-4" />;
    }
  };

  return (
    <div className="w-24 h-36 rounded-lg border-2 border-gray-300 bg-white shadow-lg relative flex flex-col justify-between p-2 animate-fade-in">
      <div className={`flex items-center ${getSuitColor(card.suit)}`}>
        <span className="text-lg font-bold mr-1">{card.rank}</span>
        {getSuitIcon(card.suit)}
      </div>
      
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
        <span className={`text-4xl ${getSuitColor(card.suit)}`}>
          {getSuitIcon(card.suit)}
        </span>
      </div>
      
      <div className={`flex items-center self-end rotate-180 ${getSuitColor(card.suit)}`}>
        <span className="text-lg font-bold mr-1">{card.rank}</span>
        {getSuitIcon(card.suit)}
      </div>
    </div>
  );
};

export default Card;
