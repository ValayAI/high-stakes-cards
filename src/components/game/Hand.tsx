
import React from "react";
import CardComponent from "./Card";
import { Card as CardType } from "@/types/game";

interface HandProps {
  cards: CardType[];
  score: number;
  isDealer?: boolean;
  label: string;
}

const Hand: React.FC<HandProps> = ({ cards, score, isDealer = false, label }) => {
  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center justify-center mb-2">
        <h2 className="text-white text-xl mr-2">{label}</h2>
        <div className="bg-black/30 px-3 py-1 rounded-full text-white">
          Score: {score}
        </div>
      </div>
      <div className="flex items-center justify-center flex-wrap gap-2">
        {cards.map((card, index) => (
          <div
            key={index}
            className="transform transition-transform hover:translate-y-[-10px]"
            style={{
              marginLeft: index > 0 ? "-40px" : "0",
              zIndex: index,
            }}
          >
            <CardComponent card={card} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Hand;
