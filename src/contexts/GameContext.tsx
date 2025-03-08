
import React, { createContext, useContext, useReducer, ReactNode } from "react";
import { GameState, Card, Hand, GameStatus } from "@/types/game";
import { createDeck, shuffleDeck, calculateScore, hasBlackjack, isBusted } from "@/utils/cardUtils";
import { toast } from "@/hooks/use-toast";

interface GameContextType {
  state: GameState;
  dealCards: () => void;
  placeBet: (amount: number) => void;
  hit: () => void;
  stand: () => void;
  resetGame: () => void;
  doubleDown: () => void;
}

const initialState: GameState = {
  deck: [],
  player: {
    hand: [],
    score: 0,
    chips: 1000,
    bet: 0,
    busted: false,
    hasBlackjack: false,
    hasPush: false,
    isStanding: false,
    winnings: 0,
  },
  dealer: {
    hand: [],
    score: 0,
    busted: false,
    hasBlackjack: false,
    isRevealed: false,
  },
  status: "betting",
  message: "Place your bet!",
};

type GameAction =
  | { type: "DEAL_CARDS" }
  | { type: "PLACE_BET"; amount: number }
  | { type: "HIT" }
  | { type: "STAND" }
  | { type: "DEALER_TURN" }
  | { type: "DEALER_HIT" }
  | { type: "END_GAME" }
  | { type: "RESET_GAME" }
  | { type: "DOUBLE_DOWN" };

const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case "PLACE_BET": {
      const { amount } = action;
      if (amount > state.player.chips) {
        toast({
          title: "Not enough chips!",
          description: "You don't have enough chips for this bet.",
          variant: "destructive",
        });
        return state;
      }
      
      // Apply the bet
      const newState = {
        ...state,
        player: {
          ...state.player,
          bet: amount,
          chips: state.player.chips - amount,
        },
        message: "Placing bet...",
      };
      
      // Now immediately deal cards
      const newDeck = shuffleDeck(createDeck());
      
      // Deal first 4 cards
      const playerCard1 = { ...newDeck.pop()!, faceUp: true };
      const dealerCard1 = { ...newDeck.pop()!, faceUp: true };
      const playerCard2 = { ...newDeck.pop()!, faceUp: true };
      const dealerCard2 = { ...newDeck.pop()!, faceUp: false };
      
      const playerHand: Hand = [playerCard1, playerCard2];
      const dealerHand: Hand = [dealerCard1, dealerCard2];
      
      const playerScore = calculateScore(playerHand);
      const dealerVisibleScore = calculateScore([dealerCard1]);
      
      const playerHasBlackjack = hasBlackjack(playerHand);
      
      return {
        ...newState,
        deck: newDeck,
        player: {
          ...newState.player,
          hand: playerHand,
          score: playerScore,
          hasBlackjack: playerHasBlackjack,
          busted: false,
          isStanding: false,
          hasPush: false,
        },
        dealer: {
          hand: dealerHand,
          score: dealerVisibleScore,
          busted: false,
          hasBlackjack: false,
          isRevealed: false,
        },
        status: playerHasBlackjack ? "dealerTurn" : "playing",
        message: playerHasBlackjack 
          ? "Blackjack! Dealer's turn." 
          : "Your turn. Hit or Stand?",
      };
    }

    case "DEAL_CARDS": {
      const newDeck = shuffleDeck(createDeck());
      
      // Deal first 4 cards
      const playerCard1 = { ...newDeck.pop()!, faceUp: true };
      const dealerCard1 = { ...newDeck.pop()!, faceUp: true };
      const playerCard2 = { ...newDeck.pop()!, faceUp: true };
      const dealerCard2 = { ...newDeck.pop()!, faceUp: false };
      
      const playerHand: Hand = [playerCard1, playerCard2];
      const dealerHand: Hand = [dealerCard1, dealerCard2];
      
      const playerScore = calculateScore(playerHand);
      const dealerVisibleScore = calculateScore([dealerCard1]);
      
      const playerHasBlackjack = hasBlackjack(playerHand);
      
      return {
        ...state,
        deck: newDeck,
        player: {
          ...state.player,
          hand: playerHand,
          score: playerScore,
          hasBlackjack: playerHasBlackjack,
          busted: false,
          isStanding: false,
          hasPush: false,
        },
        dealer: {
          hand: dealerHand,
          score: dealerVisibleScore,
          busted: false,
          hasBlackjack: false,
          isRevealed: false,
        },
        status: playerHasBlackjack ? "dealerTurn" : "playing",
        message: playerHasBlackjack 
          ? "High Stakes! Dealer's turn." 
          : "Your turn. Hit or Stand?",
      };
    }

    case "HIT": {
      if (state.status !== "playing") return state;
      
      const newDeck = [...state.deck];
      const newCard = { ...newDeck.pop()!, faceUp: true };
      const newHand = [...state.player.hand, newCard];
      const newScore = calculateScore(newHand);
      const busted = isBusted(newScore);
      
      let newStatus: GameStatus = state.status;
      let message = state.message;
      
      if (busted) {
        newStatus = "gameOver";
        message = "Busted! Dealer wins.";
      } else if (newScore === 21) {
        newStatus = "dealerTurn";
        message = "21! Dealer's turn.";
      } else {
        message = "Hit or Stand?";
      }
      
      const updatedState = {
        ...state,
        deck: newDeck,
        player: {
          ...state.player,
          hand: newHand,
          score: newScore,
          busted,
        },
        status: newStatus,
        message,
      };
      
      // Automatically trigger dealer's turn if player busted or has 21
      if (newStatus === "dealerTurn") {
        // We return the updated state so the UI updates first,
        // then we'll trigger the dealer's turn through a side effect
        return updatedState;
      }
      
      return updatedState;
    }

    case "STAND": {
      return {
        ...state,
        player: {
          ...state.player,
          isStanding: true,
        },
        status: "dealerTurn",
        message: "Dealer's turn.",
      };
    }

    case "DEALER_TURN": {
      // Reveal dealer's hole card
      const dealerHand = state.dealer.hand.map(card => ({ ...card, faceUp: true }));
      const dealerScore = calculateScore(dealerHand);
      const dealerHasBlackjack = hasBlackjack(dealerHand);
      
      let newStatus: GameStatus = "dealerTurn";
      let message = state.message;
      let playerChips = state.player.chips;
      let hasPush = false;
      let winnings = state.player.winnings || 0;
      
      if (state.player.hasBlackjack) {
        if (dealerHasBlackjack) {
          // Both have blackjack, push
          playerChips += state.player.bet;
          message = "Push! Both have Blackjack.";
          hasPush = true;
          newStatus = "gameOver";
        } else {
          // Player has blackjack, dealer doesn't - pays 3:2 (1.5x)
          const blackjackPayout = state.player.bet * 1.5;
          playerChips += state.player.bet + blackjackPayout;
          winnings += blackjackPayout;
          message = "Blackjack pays 3:2! You win!";
          newStatus = "gameOver";
        }
      } else if (dealerHasBlackjack) {
        message = "Dealer has Blackjack! Dealer wins.";
        newStatus = "gameOver";
      }
      
      return {
        ...state,
        dealer: {
          ...state.dealer,
          hand: dealerHand,
          score: dealerScore,
          hasBlackjack: dealerHasBlackjack,
          isRevealed: true,
        },
        player: {
          ...state.player,
          chips: playerChips,
          hasPush,
          winnings,
        },
        status: newStatus,
        message,
      };
    }

    case "DEALER_HIT": {
      if (state.status !== "dealerTurn") {
        return state;
      }
      
      // Skip if player or dealer already has blackjack
      if (state.player.hasBlackjack || state.dealer.hasBlackjack) {
        return state;
      }
      
      const newDeck = [...state.deck];
      const dealerHand = [...state.dealer.hand];
      let dealerScore = calculateScore(dealerHand);
      
      // Dealer draws until score is 17 or higher
      while (dealerScore < 17) {
        const newCard = { ...newDeck.pop()!, faceUp: true };
        dealerHand.push(newCard);
        dealerScore = calculateScore(dealerHand);
      }
      
      const dealerBusted = isBusted(dealerScore);
      let message = "";
      let playerChips = state.player.chips;
      let winnings = state.player.winnings || 0;
      let hasPush = false;
      
      if (dealerBusted) {
        message = "Dealer busted! You win.";
        const payout = state.player.bet * 2;
        playerChips += payout;
        winnings += state.player.bet;
      } else if (dealerScore > state.player.score) {
        message = "Dealer wins.";
        // Player already lost their bet when they placed it
      } else if (dealerScore < state.player.score) {
        message = "You win!";
        const payout = state.player.bet * 2;
        playerChips += payout;
        winnings += state.player.bet;
      } else {
        message = "Push! It's a tie.";
        playerChips += state.player.bet;
        hasPush = true;
      }
      
      return {
        ...state,
        deck: newDeck,
        dealer: {
          ...state.dealer,
          hand: dealerHand,
          score: dealerScore,
          busted: dealerBusted,
          isRevealed: true,
        },
        player: {
          ...state.player,
          chips: playerChips,
          hasPush,
          winnings,
        },
        status: "gameOver",
        message,
      };
    }

    case "DOUBLE_DOWN": {
      if (state.status !== "playing" || state.player.hand.length > 2) {
        return state;
      }
      
      const newDeck = [...state.deck];
      const newCard = { ...newDeck.pop()!, faceUp: true };
      const newHand = [...state.player.hand, newCard];
      const newScore = calculateScore(newHand);
      const busted = isBusted(newScore);
      
      // Double the bet
      const newBet = state.player.bet * 2;
      const newChips = state.player.chips - state.player.bet; // Take additional bet amount
      
      return {
        ...state,
        deck: newDeck,
        player: {
          ...state.player,
          hand: newHand,
          score: newScore,
          bet: newBet,
          chips: newChips,
          busted,
          isStanding: true,
        },
        status: "dealerTurn",
        message: busted ? "Busted on double down! Dealer wins." : "Double down! Dealer's turn.",
      };
    }

    case "RESET_GAME": {
      // Don't reset if player has no chips - game is over
      if (state.player.chips <= 0) {
        toast({
          title: "Game Over!",
          description: "You've run out of chips. Refresh the page to start a new game.",
          variant: "destructive",
        });
        return {
          ...state,
          message: "Game Over! You've run out of chips.",
        };
      }
      
      // Continue the game with current chips amount
      return {
        ...initialState,
        player: {
          ...initialState.player,
          chips: state.player.chips,
          winnings: state.player.winnings,
        },
      };
    }

    default:
      return state;
  }
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  const dealCards = () => {
    if (state.player.bet > 0 && state.status === "betting") {
      dispatch({ type: "DEAL_CARDS" });
    } else {
      toast({
        title: "Place a bet first!",
        description: "You need to place a bet before dealing cards.",
      });
    }
  };

  const placeBet = (amount: number) => {
    if (state.status === "betting") {
      dispatch({ type: "PLACE_BET", amount });
    }
  };

  const hit = () => {
    if (state.status === "playing") {
      dispatch({ type: "HIT" });
      
      // Check if we need to trigger dealer's turn after state update
      setTimeout(() => {
        if (state.status === "dealerTurn") {
          dealerTurn();
        }
      }, 500);
    }
  };

  const stand = () => {
    if (state.status === "playing") {
      dispatch({ type: "STAND" });
      
      // Automatically trigger dealer's turn
      setTimeout(() => {
        dealerTurn();
      }, 500);
    }
  };

  const dealerTurn = () => {
    dispatch({ type: "DEALER_TURN" });
    
    // Add a small delay before dealer draws cards
    setTimeout(() => {
      if (state.status === "dealerTurn" && !state.player.hasBlackjack && !state.dealer.hasBlackjack) {
        dispatch({ type: "DEALER_HIT" });
      }
    }, 1000);
  };

  const doubleDown = () => {
    if (state.status === "playing" && state.player.hand.length === 2) {
      if (state.player.bet <= state.player.chips) {
        dispatch({ type: "DOUBLE_DOWN" });
        
        // Automatically trigger dealer's turn
        setTimeout(dealerTurn, 1000);
      } else {
        toast({
          title: "Not enough chips!",
          description: "You need more chips to double down.",
          variant: "destructive",
        });
      }
    }
  };

  const resetGame = () => {
    dispatch({ type: "RESET_GAME" });
  };

  // Automatically trigger dealer's turn when the status changes
  React.useEffect(() => {
    if (state.status === "dealerTurn") {
      // Small delay to allow UI to update
      setTimeout(dealerTurn, 500);
    }
  }, [state.status]);

  return (
    <GameContext.Provider
      value={{
        state,
        dealCards,
        placeBet,
        hit,
        stand,
        resetGame,
        doubleDown,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = (): GameContextType => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
};
