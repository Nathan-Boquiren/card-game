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
  "Ben",
  "Jacob",
  "Hunter",
  "Hannah",
  "Katie",
  "Brianna",
  "Daniel",
  "Kole",
  "Andrew",
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

  if (score === 21) {
    winLose(player.name, "Won");
  } else if (score > 21) {
    winLose(player.name, "Lost");
  }
}

// ===== User HIT function =====
export function hit(player) {
  player.hand.push(dealCard(deck));
}
// User STAND function
export function stand() {
  botPlayer.hand.push(dealCard(deck));
  // calculateScore(botPlayer);
}
