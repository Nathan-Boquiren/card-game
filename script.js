let cl = console.log;

// ===== Import Deck and Functions =====

import {
  deck,
  populatePlayers,
  botPlayer,
  userPlayer,
  calculateScore,
  hit,
  stand,
} from "./logic.js";

// ===== DOM Elements =====

const userNameInput = document.getElementById("user-name-input");
const deckContainer = document.getElementById("deck");
const dealCardsBtn = document.getElementById("deal-cards-btn");
const botContainer = document.getElementById("bot-hand-container");
const userContainer = document.getElementById("user-hand-container");
const cardsLeftWrapper = document.getElementById("deck-length");
const userScoreWrapper = document.getElementById("user-score-wrapper");
const choiceBtns = document.querySelectorAll(".choice-btn");
const msgContainer = document.getElementById("msg-container");
const msgWrapper = document.getElementById("msg-wpr");

// ===== Global Variables =====

let userName = "";

// ===== Start Screen Event Listeners =====

document.getElementById("start-btn").addEventListener("click", () => {
  if (userNameInput.value !== "") startGame();
});

userNameInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && userNameInput.value !== "") startGame();
});

function startGame() {
  cl("===== START GAME =====");
  document.body.classList.add("start-game");
  userName = userNameInput.value;
  populateDeckContainer(deck, true);
  populateNames("Bot", "You");
}

// ===== Populate DOM with card deck =====

function populateDeckContainer(deck, isFirstTime) {
  cl(`deck length: ${deck.length}`);
  if (!isFirstTime) deckContainer.innerHTML = "";
  deck.forEach((card) => {
    deckContainer.innerHTML += `
      <div class="card ${card.suit}-${card.rank}" style="background-image: url(card-images/${card.suit}-${card.rank}.png)"></div>`;
  });
}

dealCardsBtn.addEventListener("click", dealCardsDOM);

// ===== Populate player names in DOM =====

function populateNames(botName, userName) {
  document.getElementById("bot-name-wrapper").innerHTML = `${botName}`;
  document.getElementById("user-name-wrapper").innerHTML = `${userName}`;
}

// ===== Deal Cards in DOM =====

function dealCardsDOM() {
  populatePlayers(userName);
  populateNames(botPlayer.name, userPlayer.name);
  calculateScore(userPlayer);
  updateDom();
  dealCardsBtn.remove();
  stylePlayerCards();
  animateDeal(botContainer);
  animateDeal(userContainer);
}

// === Animate Initial Deal ===

function animateDeal(container) {
  container.classList.add("show-cards");
  setTimeout(() => {
    container.classList.remove("show-cards");
  }, 300);
}

// ===== Style Player Cards Overlap =====

function stylePlayerCards() {
  const playerContainers = document.querySelectorAll(".player-hand-container");
  playerContainers.forEach((container) => {
    const cards = container.querySelectorAll(".card");
    const cardWidth = 178.5714286;
    const overlap = 50;
    const newContainerWidth = cardWidth + (cards.length - 1) * overlap;

    container.style.width = `${newContainerWidth}px`;

    cards.forEach((card, i) => {
      card.style.left = `${i * overlap}px`;
    });
  });
}

// ===== Event Listeners for User Choice Btns =====

choiceBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    cl(`User chose to ${btn.id}`);
    btn.classList.add("animateBtn");
    setTimeout(() => {
      btn.classList.remove("animateBtn");
    }, 300);
    if (btn.id === "hit") {
      hit(userPlayer);
      updateDom();
    } else if (btn.id === "stand") {
      stand();
      flipBotCard();
    }
  });
});

// ===== Flip Bot Card =====

function flipBotCard() {
  cl(" ===== flipping dealer card =====");
  botContainer.classList.add("remove-after");
}

// ===== Update Cards left in deck =====

function updateCardsLeft(deck) {
  cardsLeftWrapper.innerHTML = deck.length;
}

// ===== Update user score =====

function updateUserScore() {
  calculateScore(userPlayer);
  cl(`user score: ${userPlayer.score}`);
  userScoreWrapper.innerHTML = `${userPlayer.score}`;
}

// ===== Win and Lose Functions

export function winLose(player, status) {
  cl(`========== ${player} ${status}! ==========`);
  if (player && status) msgWrapper.innerHTML = `${player} ${status}!`;
  msgContainer.classList.add("show");
}

// ========== Reset Game Function ==========

// ========== UPDATE DOM ==========

export function updateDom() {
  cl("updated dom");
  populateDeckContainer(deck, false);
  populateHand(botPlayer, botContainer);
  populateHand(userPlayer, userContainer);
  stylePlayerCards();
  updateCardsLeft(deck);
  updateUserScore();
}

function populateHand(player, container) {
  container.innerHTML = "";
  player.hand.forEach((card) => {
    container.innerHTML += `
      <div style="background-image: url(card-images/${card.suit}-${card.rank}.png)"></div>`;
  });
}
