// ===== Classes =====

class Card {
  constructor(rank, suit) {
    this.rank = rank;
    this.suit = suit;
    this.name = this.getName();
    this.clr = this.getClr();
  }

  getName() {
    if (this.rank < 11) return this.rank.toString();
    const nameScheme = {
      11: "Kack",
      12: "Queen",
      13: "King",
      14: "Ace",
    };
    return nameScheme[this.rank];
  }

  getClr() {
    if (this.suit === "Spades" || this.suit === "Clubs") {
      return "Black";
    } else if (this.suit === "Hearts" || this.suit === "Diamonds") {
      return "Red";
    }
  }
}

class Deck {
  constructor() {
    this.cards = this.buildDeck();
    this.element = document.getElementById("deck");
    this.cardsLeftElement = document.getElementById("deck-length");
  }

  buildDeck() {
    let deck = [];
    const suits = ["hearts", "spades", "diamonds", "clubs"];
    for (let i = 2; i <= 14; i++) {
      suits.forEach((suit) => {
        deck.push(new Card(i, suit));
      });
    }
    return deck;
  }

  dealHand() {
    return [this.dealCard(), this.dealCard()];
  }

  dealCard() {
    let randIndex = Math.floor(Math.random() * this.cards.length);
    return this.cards.splice(randIndex, 1)[0];
  }

  populateCards(isFirstTime) {
    if (!isFirstTime) this.element.innerHTML = "";
    this.cards.forEach((card) => {
      const cardElement = document.createElement("div");
      cardElement.className = "card";
      cardElement.style.backgroundImage = `url(card-images/${card.suit}-${card.rank}.png)`;
      this.element.append(cardElement);
    });

    this.cardsLeftElement.innerText = this.cards.length;
  }
}

class Player {
  constructor(name, type) {
    this.type = type;
    this.name = name;
    this.hand = deck.dealHand();
    this.score = 0;
    this.nameElement = document.getElementById(`${type}-name-wrapper`);
    this.handElement = document.getElementById(`${type}-hand-container`);
    this.scoreElement = document.getElementById(`${type}-score-wrapper`);
  }

  calculateScore() {
    let score = 0;
    this.hand.forEach((card) => {
      if (card.rank === 14) {
        score += score <= 10 ? 11 : 1;
      } else {
        score += card.rank >= 11 && card.rank < 14 ? 10 : card.rank;
      }
    });

    this.score = score;

    if (this.score === 21) return endMsg(`Congrats, ${this.name}`, "won");
    if (this.score > 21) return endMsg(`Oh. ${this.name}`, "busted");
  }

  updateScoreElement() {
    this.calculateScore();
    this.scoreElement.innerText = `${this.score}`;
  }

  hit() {
    this.hand.push(deck.dealCard());
    updateDom();
  }

  renderName() {
    this.nameElement.innerText = this.name;
  }

  renderHand(isFirstTime) {
    this.handElement.innerHTML = "";
    this.hand.forEach((c) => {
      const cardElement = document.createElement("div");
      cardElement.className = "card";
      cardElement.style.backgroundImage = `url(card-images/${c.suit}-${c.rank}.png)`;
      this.handElement.append(cardElement);
    });

    this.styleHandElement();

    if (isFirstTime) this.animateHandDeal();
  }

  styleHandElement() {
    const cards = this.handElement.querySelectorAll(".card");
    const cardWidth = 178.5714286;
    const overlap = 40;
    const newContainerWidth = cardWidth + (cards.length - 1) * overlap;
    this.handElement.style.width = `${newContainerWidth}px`;
    cards.forEach((card, i) => (card.style.left = `${i * overlap}px`));
  }

  animateHandDeal() {
    this.handElement.classList.add("show-cards");
    setTimeout(() => this.handElement.classList.remove("show-cards"), 300);
  }
}

class Bot extends Player {
  constructor(name, type) {
    super(name, type);
  }

  turn() {
    this.handElement.classList.add("remove-after");
    this.calculateScore();
    if (this.score < 17) {
      this.hit();
      setTimeout(() => {
        this.turn();
        updateDom();
      }, 500);
    } else if (this.score >= 17 && this.score < 21) {
      setTimeout(compareScores, 500);
    }
  }
}

// ===== DOM Elements =====

const userNameInput = document.getElementById("user-name-input");
const dealCardsBtn = document.getElementById("deal-cards-btn");
const choiceBtns = document.querySelectorAll(".choice-btn");
const msgContainer = document.getElementById("msg-container");
const msgWrapper = document.getElementById("msg-wpr");

// ===== Global Variables =====

const playerNames = [
  "Nathan",
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
  "Donald Trump",
  "Joe Biden",
  "Jack Black",
  "Taylor Swift",
];

let deck = new Deck();
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

function endMsg(player, status) {
  msgWrapper.innerHTML = status ? `${player} ${status}!` : player;
  msgContainer.classList.add("show");
}
// ===== UPDATE DOM =====

function updateDom() {
  deck.populateCards(false);
  players.forEach((p) => p.renderHand(false));
  user.updateScoreElement();
}

// ===== Compare Scores =====

function compareScores() {
  if (user.score === bot.score) return endMsg("It's a tie!", null);

  const winner = user.score > bot.score ? user : bot;
  const loser = user.score > bot.score ? bot : user;

  endMsg(`Congrats, ${winner.name}`, `won by ${winner.score - loser.score}`);
}
