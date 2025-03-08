
import React from "react";
import { Coins } from "lucide-react";

interface ChipStackProps {
  amount: number;
  onClick?: () => void;
  selected?: boolean;
}

const ChipStack: React.FC<ChipStackProps> = ({ amount, onClick, selected = false }) => {
  // Determine color based on chip value
  const getChipColor = () => {
    if (amount <= 5) return "bg-red-500";
    if (amount <= 25) return "bg-blue-500";
    if (amount <= 50) return "bg-green-500";
    if (amount <= 100) return "bg-purple-500";
    return "bg-amber-500";
  };

  return (
    <button
      className={`relative w-16 h-16 rounded-full flex items-center justify-center text-white shadow-lg ${getChipColor()} 
      border-4 border-white/30 hover:scale-110 transform transition-all duration-200 
      ${selected ? "ring-4 ring-white ring-opacity-70 scale-110" : ""}`}
      onClick={onClick}
    >
      <Coins className="absolute text-white/20 w-10 h-10" />
      <span className="text-sm font-bold z-10">${amount}</span>
    </button>
  );
};

export default ChipStack;
