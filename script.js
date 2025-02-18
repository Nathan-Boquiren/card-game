let cl = console.log;
let ct = console.table;

// ===== Build Deck =====

import {
  deck,
  populatePlayers,
  // createPlayer,
  // dealHand,
  // dealCard,
  botPlayer,
  userPlayer,
  calculateScore,
  hit,
} from "./logic.js";

// ===== Start Screen =====

// let startScreen = document.getElementById("start-screen");
// let mainScreen = document.getElementById("main-screen");
// let userNameInput = document.getElementById("user-name-input");
// let startBtn = document.getElementById("start-btn");
// let userName = "";

// ===== Event listeners to start game =====

// startBtn.addEventListener("click", () => {
//   if (userNameInput.value !== "") {
//     startGame();
//   } else {
//     alert("Enter your name, dude.");
//   }
// });

// userNameInput.addEventListener("keydown", (e) => {
//   if (e.key === "Enter" && userNameInput.value !== "") {
//     startGame();
//   }
// });

// function startGame() {
// cl("START GAME");
// startScreen.style.display = "none";
// mainScreen.style.display = "block";
// userName = userNameInput.value;

// populatePlayers("Nathan");
// populateDeckContainer(deck);
// }

populatePlayers("Nathan");

document.getElementById("bot-name-wrapper").innerHTML = `${botPlayer.name}`;

// ===== Style Main Section Height =====

document.addEventListener("DOMContentLoaded", () => {
  let headerHeight = document
    .getElementById("header")
    .getBoundingClientRect().height;
  let vpHeight = window.innerHeight;
  document.getElementById("main-screen").style.height = `${
    vpHeight - headerHeight
  }px`;
  document.getElementById(
    "main-screen"
  ).style.paddingBottom = `${headerHeight}px`;
});

// ===== Populate DOM with card deck =====

let deckContainer = document.getElementById("deck");
let botContainer = document.getElementById("bot-hand-container");
let userContainer = document.getElementById("user-hand-container");

if (deck) {
  populateDeckContainer(deck);
}

function populateDeckContainer(deck) {
  // cl("deck repopulated");
  // cl(`deck length: ${deck.length}`);
  deckContainer.innerHTML = `<button id="deal-cards-btn">Deal<br>Cards</button>`;
  deck.forEach((card) => {
    deckContainer.innerHTML += `
      <div class="card ${card.suit}-${card.rank}">
        </div>`;
    document.querySelector(
      `.${card.suit}-${card.rank}`
    ).style.backgroundImage = `url(card-images/${card.suit}-${card.rank}.png)`;
  });
}

// ===== Event listener to deal cards in DOM =====

function populateHand(player, container) {
  container.innerHTML = "";
  player.hand.forEach((card) => {
    container.innerHTML += `
        <div class="card ${card.suit}-${card.rank}">
        </div>`;
    document.querySelector(
      `.${card.suit}-${card.rank}`
    ).style.backgroundImage = `url(card-images/${card.suit}-${card.rank}.png)`;
  });
}

document.getElementById("deal-cards-btn").addEventListener("click", () => {
  calculateScore(userPlayer);
  calculateScore(botPlayer);
  ct(botPlayer);
  ct(userPlayer);
  updateDom();
  document.getElementById("deal-cards-btn").style.display = "none";
});

// ===== Event Listeners for User Choice Btns =====

const hitBtn = document.getElementById("hit");
const standBtn = document.getElementById("stand");
const choiceBtns = document.querySelectorAll(".choice-btn");

choiceBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    cl(`User chose to ${btn.id}`);
    if (btn.id === "hit") {
      hit(userPlayer);
    } else {
      stand();
    }
    updateDom();
  });
});

// ===== Update Cards left in deck =====
function updateCardsLeft(deck) {
  let cardsLeftWrapper = document.getElementById("deck-length");
  cardsLeftWrapper.innerHTML = deck.length;
}

// ===== Update user score =====

function updateUserScore() {
  calculateScore(userPlayer);
  cl(`user score: ${userPlayer.score}`);
  let userScoreWrapper = document.getElementById("user-score-wrapper");
  userScoreWrapper.innerHTML = `${userPlayer.score}`;
}

// ===== Win and Lose Functions

const msgContainer = document.getElementById("msg-container");

export function winLose(player, status) {
  cl(`========== ${player} ${status}! ==========`);
  msgContainer.style.display = `flex`;
  msgContainer.innerHTML = `${player} ${status}!`;
  msgContainer.classList.add("fade-in");
  setTimeout(() => {
    msgContainer.classList.remove("fade-in");
  }, 300);
}

// ========== UPDATE DOM ==========

function updateDom() {
  cl("updated dom");
  populateDeckContainer(deck);
  populateHand(botPlayer, botContainer);
  populateHand(userPlayer, userContainer);
  updateCardsLeft(deck);
  // calculateScore(userPlayer);
  updateUserScore();
}
