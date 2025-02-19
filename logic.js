let cl = console.log;
let ct = console.table;

// ===== Build Deck =====

function buildDeck() {
  let deck = [];
  const suits = ["Hearts", "Spades", "Diamonds", "Clubs"];
  for (let i = 2; i <= 14; i++) {
    suits.forEach((suit) => {
      deck.push(createCard(i, suit));
    });
  }

  return deck;
}

function createCard(rank, suit) {
  return {
    rank: rank,
    suit: suit,
    color: getColor(suit),
    name: getName(rank),
  };
}

function getName(rank) {
  let name = "";
  if (rank === 11) {
    name = "Jack";
  } else if (rank === 12) {
    name = "Queen";
  } else if (rank === 13) {
    name = "King";
  } else if (rank === 14) {
    name = "Ace";
  } else {
    name = rank;
  }
  return name;
}

function getColor(suit) {
  let color = "";

  if (suit === "Spades" || suit === "Clubs") {
    color = "Black";
  } else if (suit === "Hearts" || suit === "Diamonds") {
    color = "Red";
  }

  return color;
}

export let deck = buildDeck();

// ===== Deal Cards and Hands =====

export function dealHand() {
  let hand = [];
  for (let i = 0; i < 2; i++) {
    hand.push(dealCard(deck));
  }
  return hand;
}

export function dealCard(deck) {
  let randIndex = Math.floor(Math.random() * deck.length);
  return deck.splice(randIndex, 1)[0];
}

// ===== Create Players =====

export let botPlayer = "";
export let userPlayer = "";

let playerNames = [
  "Brianna",
  "Brennan",
  "Andrew",
  "Jacob",
  "Kole",
  "Jacob",
  "Daniel",
  "Katie",
  "Summer",
  "Aria",
  "Hunter",
  "Hannah",
  "Gaines",
  "Ben",
];

export function populatePlayers(userName) {
  botPlayer = createPlayer(
    playerNames[Math.floor(Math.random() * playerNames.length)]
  );
  userPlayer = createPlayer(userName);
}

export function createPlayer(name) {
  return {
    name: name,
    hand: dealHand(),
    score: 0,
  };
}

// ===== Win/Lose Functions =====

import { winLose } from "./script.js";

// ===== Calculate Scores =====

export function calculateScore(player) {
  let score = 0;
  player.hand.forEach((card) => {
    if (card.rank >= 11 && card.rank < 14) {
      score += 10;
    } else if (card.rank === 14) {
      score += 11;
    } else {
      score += card.rank;
    }
  });
  // return score;
  player.score = score;

  // compareScores();

  if (score === 21) {
    winLose(player.name, "Won");
  } else if (score > 21) {
    winLose(player.name, "Busted");
  }
}

// ===== User HIT function =====
export function hit(player) {
  player.hand.push(dealCard(deck));
}
// User STAND function
export function stand() {
  dealerTurn();
}

// ===== Dealer Turn =====

function dealerTurn() {
  calculateScore(botPlayer);
  if (botPlayer.score < 17) {
    hit(botPlayer);
    setTimeout(dealerTurn, 500);
  } else if (botPlayer.score >= 17 && botPlayer.score < 21) {
    cl(`Bot chose to stand with ${botPlayer.score}`);
    compareScores();
  } /* else if (botPlayer.score > 21) {
    winLose(botPlayer.name, "Busted");
  } */
}

// ===== Compare Scores =====

function compareScores() {
  cl(`bot score: ${botPlayer.score}`);
  cl(`user score: ${userPlayer.score}`);
  if (userPlayer.score > botPlayer.score) {
    winLose(userPlayer.name, `Won by ${userPlayer.score - botPlayer.score}`);
  } else if (userPlayer.score < botPlayer.score) {
    winLose(botPlayer.name, `Won by ${botPlayer.score - userPlayer.score}`);
  } else {
    winLose("It's a tie!");
  }
}
