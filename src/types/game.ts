
export type Suit = "hearts" | "diamonds" | "clubs" | "spades";
export type Rank = "A" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "J" | "Q" | "K";

export interface Card {
  suit: Suit;
  rank: Rank;
  faceUp: boolean;
}

export type Hand = Card[];

export interface Player {
  hand: Hand;
  score: number;
  chips: number;
  bet: number;
  busted: boolean;
  hasBlackjack: boolean;
  hasPush: boolean;
  isStanding: boolean;
  winnings?: number; // Track total winnings
}

export interface Dealer {
  hand: Hand;
  score: number;
  busted: boolean;
  hasBlackjack: boolean;
  isRevealed: boolean;
}

export type GameStatus = "betting" | "playing" | "dealerTurn" | "gameOver";

export interface GameState {
  deck: Card[];
  player: Player;
  dealer: Dealer;
  status: GameStatus;
  message: string;
}
