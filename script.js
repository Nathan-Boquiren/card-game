let cl = console.log;

// ===== Import Deck and Functions =====

import { deck, Player, Bot, playerNames } from "./logic.js";

// ===== DOM Elements =====

const userNameInput = document.getElementById("user-name-input");
const dealCardsBtn = document.getElementById("deal-cards-btn");
const choiceBtns = document.querySelectorAll(".choice-btn");
const msgContainer = document.getElementById("msg-container");
const msgWrapper = document.getElementById("msg-wpr");

// ===== Global Variables =====

let user;
let bot;
let players = [];

// ===== Start Screen Event Listeners =====

document.getElementById("start-btn").addEventListener("click", () => {
  if (userNameInput.value !== "") startGame();
});

userNameInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && userNameInput.value !== "")
    startGame(userNameInput.value);
});

// ===== Create PLayers =====

function createPlayers(userName) {
  const randName = playerNames[Math.floor(Math.random() * playerNames.length)];
  user = new Player(userName, "user");
  bot = new Bot(randName, "bot");
  players.push(user, bot);
}

// ===== Start Game =====

function startGame(userNameInput) {
  document.body.classList.add("start-game");
  deck.populateCards(true);
  createPlayers(userNameInput);
  players.forEach((p) => p.renderName());
}

// ===== Deal Cards in DOM =====

dealCardsBtn.addEventListener("click", () => {
  user.calculateScore();
  updateDom();
  dealCardsBtn.remove();
  players.forEach((p) => p.renderHand(true));
});

// ===== Event Listeners for User Choice Btns =====

choiceBtns.forEach((btn) => {
  btn.addEventListener("pointerdown", () => {
    btn.classList.add("animate");
    setTimeout(btn.classList.remove("animate"), 300);
    btn.id === "hit" ? user.hit() : bot.turn();
  });
});

// ===== Win and Lose Functions =====

export function endMsg(player, status) {
  msgWrapper.innerHTML = status ? `${player} ${status}!` : player;
  msgContainer.classList.add("show");
}
// ===== UPDATE DOM =====

export function updateDom() {
  deck.populateCards(false);
  players.forEach((p) => p.renderHand(false));
  user.updateScoreElement();
}

// ===== Compare Scores =====

export function compareScores() {
  if (user.score === bot.score) return endMsg("It's a tie!", null);

  const winner = user.score > bot.score ? user : bot;
  const loser = user.score > bot.score ? bot : user;

  endMsg(`Congrats, ${winner.name}`, `won by ${winner.score - loser.score}`);
}
