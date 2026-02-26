"use strict";

let score0 = 0;
let score1 = 0;
let currentScore = 0;
const dice = document.querySelector(".dice");
const rollDiceBtn = document.querySelector(".btn--roll");
const holdBtn = document.querySelector(".btn--hold");
const newGameBtn = document.querySelector(".btn--new");
const player1Score = document.querySelector("#score--0");
const player2Score = document.querySelector("#score--1");
const currentScorePlayer1 = document.querySelector("#current--0");
const currentScorePlayer2 = document.querySelector("#current--1");
const player1 = document.querySelector(".player--0");
const player2 = document.querySelector(".player--1");
const winMessage = document.querySelector(".win-message");

function playerSwitch() {
	if (player1.classList.contains("player--active")) {
		player1.classList.remove("player--active");
		player2.classList.add("player--active");
		currentScorePlayer1.textContent = 0;
	} else {
		player1.classList.add("player--active");
		player2.classList.remove("player--active");
		currentScorePlayer2.textContent = 0;
	}
}

function rollDice() {
	dice.style.display = "block";
	const diceImagesArray = [
		"dice-1.png",
		"dice-2.png",
		"dice-3.png",
		"dice-4.png",
		"dice-5.png",
		"dice-6.png",
	];
	const diceNo = Math.trunc(Math.random() * 6) + 1;
	currentScore += diceNo;
	dice.setAttribute("src", diceImagesArray[diceNo - 1]);
	if (diceNo == 1) {
		currentScore = 0;
		playerSwitch();
	} else {
		if (player1.classList.contains("player--active")) {
			currentScorePlayer1.textContent = currentScore;
		} else {
			currentScorePlayer2.textContent = currentScore;
		}
	}
}

function holdScore() {
	if (
		player1.classList.contains("player--active")
	) {
		score0 += currentScore;
		player1Score.textContent = score0;
		currentScorePlayer1.textContent = 0;
	} else {
		score1 += currentScore;
		player2Score.textContent = score1;
		currentScorePlayer2.textContent = 0;
	}
	if (score0 >= 100) {
		winMessage.textContent = "🎉 Player 1 Win!!";
		holdBtn.setAttribute("disabled", true);
		rollDiceBtn.setAttribute("disabled", true);
		return;
	} else if (score1 >= 100) {
		winMessage.textContent = "🎉 Player 2 Win!!";
		holdBtn.setAttribute("disabled", true);
		rollDiceBtn.setAttribute("disabled", true);
		return;
	}
	currentScore = 0;
	playerSwitch();
}

function newGame() {
	dice.style.display = "none";
	player1.classList.add("player--active");
	player2.classList.remove("player--active");
	score0 = 0;
	score1 = 0;
	currentScore = 0;
	[
		player1Score,
		player2Score,
		currentScorePlayer1,
		currentScorePlayer2,
	].forEach((element) => (element.textContent = 0));
	winMessage.textContent = "Pig Game";
	holdBtn.removeAttribute("disabled");
	rollDiceBtn.removeAttribute("disabled");
}

rollDiceBtn.addEventListener("click", rollDice);
holdBtn.addEventListener("click", holdScore);
newGameBtn.addEventListener("click", newGame);
