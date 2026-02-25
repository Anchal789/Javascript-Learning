"use strict";
const correctNumber = Math.trunc(Math.random() * 20);
let score = 5;
let highScore = 0;
let userGuessNumber = null;
const secretNumber = document.querySelector(".secret-number");
const inputNumber = document.querySelector(".input-number");
const againButton = document.querySelector(".again");
const checkButton = document.querySelector(".check");
const message = document.querySelector(".message");
const labelScore = document.querySelector(".label-score");
const labelHighscore = document.querySelector(".label-highscore");
console.log(correctNumber);

againButton.addEventListener("click", () => {
	score = 5;
	highScore = 0;
	inputNumber.value = null;
	document.querySelector(".main-container").style.background =
		"linear-gradient(90deg, rgba(0, 183, 255, 1) 0%, rgba(144, 111, 195, 1) 100%)";
	message.textContent = "Start guessing...";
	labelScore.textContent = score;
	labelHighscore.textContent = highScore;
	secretNumber.textContent = "?";
	inputNumber.removeAttribute("disabled");
});

inputNumber.addEventListener("input", (event) => {
	userGuessNumber = Number(event.target.value);
});
checkButton.addEventListener("click", () => {
	if (!userGuessNumber || isNaN(userGuessNumber)) {
		message.textContent = "Hey!! Please enter a valid number";
		return;
	}
	if (userGuessNumber == correctNumber) {
		secretNumber.textContent = correctNumber;
		message.textContent = "😍 Yeah!! You guess it correct!!!!";
		document.querySelector(".main-container").style.background =
			"linear-gradient(90deg,rgba(42, 155, 55, 1) 0%, rgba(87, 199, 133, 1) 46%, rgba(83, 237, 181, 1) 100%)";
		highScore += 1;
		labelHighscore.textContent = highScore;
		inputNumber.value = null;
		inputNumber.setAttribute("disabled", true);
	} else {
		score -= 1;
		labelScore.textContent = score;
		if (userGuessNumber > correctNumber) {
			message.textContent = "📉 Guess a lower number";
		} else {
			message.textContent = "📈 Guess a higher number";
		}
		if (score == 0) {
			inputNumber.setAttribute("disabled", true);
			message.textContent =
				"😢 Oops!! You didn't guess it correct. Try again!!";
			inputNumber.value = null;
		}
	}
});
