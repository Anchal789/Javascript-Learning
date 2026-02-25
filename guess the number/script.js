"use strict";

// ================= STATE =================
let correctNumber;
let score;
let highScore = 0;

// ================= DOM =================
const mainContainer = document.querySelector(".main-container");
const secretNumber = document.querySelector(".secret-number");
const inputNumber = document.querySelector(".input-number");
const againButton = document.querySelector(".again");
const checkButton = document.querySelector(".check");
const message = document.querySelector(".message");
const labelScore = document.querySelector(".label-score");
const labelHighscore = document.querySelector(".label-highscore");

// ================= UTIL FUNCTIONS =================
const setMessage = (msg) => (message.textContent = msg);

const setBackground = (gradient) =>
  (mainContainer.style.background = gradient);

const generateNumber = () => Math.trunc(Math.random() * 20) + 1;

// ================= GAME RESET =================
const resetGame = () => {
  correctNumber = generateNumber();
  score = 20;

  inputNumber.value = "";
  inputNumber.removeAttribute("disabled");

  secretNumber.textContent = "?";
  labelScore.textContent = score;
  setMessage("Start guessing...");

  setBackground(
    "linear-gradient(90deg, rgba(0, 183, 255, 1) 0%, rgba(144, 111, 195, 1) 100%)"
  );
};

// ================= GAME LOGIC =================
const checkGuess = () => {
  const guess = Number(inputNumber.value);

  if (!guess) {
    setMessage("Please enter a valid number");
    return;
  }

  // WIN
  if (guess === correctNumber) {
    secretNumber.textContent = correctNumber;
    setMessage("Correct guess!");
    setBackground(
      "linear-gradient(90deg,rgba(42,155,55,1) 0%, rgba(87,199,133,1) 46%, rgba(83,237,181,1) 100%)"
    );
    inputNumber.setAttribute("disabled", true);

    if (score > highScore) {
      highScore = score;
      labelHighscore.textContent = highScore;
    }

    return;
  }

  // LOSE OR CONTINUE
  if (score > 1) {
    setMessage(guess > correctNumber ? "Guess lower" : "Guess higher");
    score--;
    labelScore.textContent = score;
  } else {
    setMessage("Game over! Try again.");
    inputNumber.setAttribute("disabled", true);
    score = 0;
    labelScore.textContent = score;
  }
};

// ================= EVENTS =================
checkButton.addEventListener("click", checkGuess);
againButton.addEventListener("click", resetGame);

// ================= INIT =================
resetGame();
