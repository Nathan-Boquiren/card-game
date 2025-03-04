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

const startScreen = document.getElementById("start-screen");
const mainScreen = document.getElementById("main-screen");
const userNameInput = document.getElementById("user-name-input");
const startBtn = document.getElementById("start-btn");
const deckContainer = document.getElementById("deck");
const botContainer = document.getElementById("bot-hand-container");
const userContainer = document.getElementById("user-hand-container");
const cardsLeftWrapper = document.getElementById("deck-length");
const userScoreWrapper = document.getElementById("user-score-wrapper");
const choiceBtns = document.querySelectorAll(".choice-btn");

// ===== Global Variables =====

let userName = "";

// ===== Start Screen Event Listeners =====

startBtn.addEventListener("click", () => {
  if (userNameInput.value !== "") {
    startGame();
  } else {
    alert("Enter your name, dude.");
  }
});

userNameInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && userNameInput.value !== "") {
    startGame();
  }
});

function startGame() {
  cl("===== START GAME =====");
  startScreen.style.display = "none";
  mainScreen.style.display = "flex";
  userName = userNameInput.value;
  populateDeckContainer(deck);
  populateNames("Bot", "You");
}

// ===== Style Main Section Height =====

document.addEventListener("DOMContentLoaded", () => {
  let headerHeight = document
    .getElementById("header")
    .getBoundingClientRect().height;
  let vpHeight = window.innerHeight;
  document.getElementById("main-screen").style.height = `${
    vpHeight - headerHeight
  }px`;
  document.getElementById("main-screen").style.paddingBottom = `${
    headerHeight / 2
  }px`;
});

// ===== Populate DOM with card deck =====

function populateDeckContainer(deck) {
  cl(`deck length: ${deck.length}`);
  deckContainer.innerHTML = `<button id="deal-cards-btn">Deal<br>Cards</button>`;
  deck.forEach((card) => {
    deckContainer.innerHTML += `
      <div class="card ${card.suit}-${card.rank}" style="background-image: url(card-images/${card.suit}-${card.rank}.png)">
      </div>`;
  });

  document.getElementById("deal-cards-btn").addEventListener("click", () => {
    dealCardsDOM();
    if (document.body.getBoundingClientRect().width <= 768) {
      document.getElementById("deck-container").style.display = "none";
    }
  });
}

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
  document.getElementById("deal-cards-btn").style.display = "none";
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

const msgContainer = document.getElementById("msg-container");

export function winLose(player, status) {
  cl(`========== ${player} ${status}! ==========`);
  msgContainer.innerHTML = `<button id="reset-btn" class="choice-btn">RESET</button>`;
  if (status === "") {
    msgContainer.innerHTML += `<div>${player}</div>`;
  } else {
    msgContainer.innerHTML += `<div>${player} ${status}!</div>`;
  }
  setTimeout(() => {
    msgContainer.style.display = `flex`;
    msgContainer.classList.add("fade-in");
    document.getElementById("reset-btn").addEventListener("click", resetGame);
  }, 500);
}

// ========== Reset Game Function ==========

function resetGame() {
  location.reload();
}

// ========== UPDATE DOM ==========

export function updateDom() {
  cl("updated dom");
  populateDeckContainer(deck);
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
      <div class="card ${card.suit}-${card.rank}" style="background-image: url(card-images/${card.suit}-${card.rank}.png)">
      </div>`;
  });
}
