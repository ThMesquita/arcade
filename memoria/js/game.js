const grid = document.querySelector(".grid");
const player = document.querySelector(".player");
const timer = document.querySelector(".timer");

const colors = [
  "#FF0000", // Vermelho
  "#00FF00", // Verde
  "#0000FF", // Azul
  "#800080", // Roxo
  "#FFC0CB", // Rosa
  "#008000", // Verde Escuro
  "#A52A2A", // Marrom
  "#FFA500", // Laranja
  "#FFFF00", // Amarelo
  "#9400D3", // Violeta
];

const createElement = (tag, className) => {
  const element = document.createElement(tag);
  element.className = className;
  return element;
};

let firstCard = "";
let secondCard = "";

const checkEndGame = () => {
  const disabledCards = document.querySelectorAll(".disable-card");
  if (disabledCards.length == colors.length * 2) {
    clearInterval(this.loop);
    setTimeout(() => {
      alert(
        `Congrats, ${player.innerHTML}! your times was: ${timer.innerHTML} seconds!`
      );
    }, 500);
  }
};

const checkCards = () => {
  const firstColor = firstCard.getAttribute("data-color");
  const secondColor = secondCard.getAttribute("data-color");

  if (firstColor == secondColor) {
    firstCard.firstChild.classList.add("disable-card");
    secondCard.firstChild.classList.add("disable-card");

    firstCard = "";
    secondCard = "";

    checkEndGame();
  } else {
    setTimeout(() => {
      firstCard.classList.remove("reveal-card");
      secondCard.classList.remove("reveal-card");

      firstCard = "";
      secondCard = "";
    }, 500);
  }
};

const revealCard = ({ target }) => {
  if (target.parentNode.className.includes("reveal-card")) {
    return;
  }

  if (firstCard == "") {
    target.parentNode.classList.add("reveal-card");
    firstCard = target.parentNode;
  } else if (secondCard == "") {
    target.parentNode.classList.add("reveal-card");
    secondCard = target.parentNode;
  }

  checkCards();
};

const createCard = (color) => {
  const card = createElement("div", "card");
  const front = createElement("div", "face front");
  const back = createElement("div", "face back");

  front.style.backgroundColor = `${color}`;

  card.appendChild(front);
  card.appendChild(back);

  card.addEventListener("click", revealCard);
  card.setAttribute("data-color", color);

  return card;
};

const loadGame = () => {
  const duplicatesColors = [...colors, ...colors];

  const shuffledArray = duplicatesColors.sort(() => Math.random() - 0.5);

  shuffledArray.forEach((color) => {
    const card = createCard(color);
    grid.appendChild(card);
  });
};

const startTimer = () => {
  this.loop = setInterval(() => {
    const currenTime = +timer.innerHTML;
    timer.innerHTML = currenTime + 1;
  }, 1000);
};

window.onload = () => {
  player.innerHTML = localStorage.getItem("player");
  loadGame();
  startTimer();
};
