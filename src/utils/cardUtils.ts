
import { Card, Rank, Suit, Hand } from "@/types/game";

// Create a new deck of cards
export const createDeck = (): Card[] => {
  const suits: Suit[] = ["hearts", "diamonds", "clubs", "spades"];
  const ranks: Rank[] = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
  const deck: Card[] = [];

  for (const suit of suits) {
    for (const rank of ranks) {
      deck.push({
        suit,
        rank,
        faceUp: true,
      });
    }
  }

  return deck;
};

// Shuffle the deck
export const shuffleDeck = (deck: Card[]): Card[] => {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Calculate the score of a hand
export const calculateScore = (hand: Hand): number => {
  let score = 0;
  let aces = 0;

  for (const card of hand) {
    if (!card.faceUp) continue;

    if (card.rank === "A") {
      aces += 1;
      score += 11;
    } else if (["J", "Q", "K"].includes(card.rank)) {
      score += 10;
    } else {
      score += parseInt(card.rank);
    }
  }

  // Adjust aces if needed
  while (score > 21 && aces > 0) {
    score -= 10;
    aces -= 1;
  }

  return score;
};

// Check if a hand has blackjack (21 with 2 cards)
export const hasBlackjack = (hand: Hand): boolean => {
  return hand.length === 2 && calculateScore(hand) === 21;
};

// Check if a hand has busted (over 21)
export const isBusted = (score: number): boolean => {
  return score > 21;
};
