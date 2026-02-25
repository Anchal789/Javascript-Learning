"use strict";

const showModalButtons = document.querySelectorAll(".show-modal");
const modalContainer = document.querySelector(".modal-container");
const overlayContainer = document.querySelector(".overlay");
const closeModalButton = document.querySelector(".close-button");

function toggleModal(show) {
	modalContainer.classList.toggle("hidden", !show);
	overlayContainer.classList.toggle("hidden", !show);
}

showModalButtons.forEach((button) =>
	button.addEventListener("click", () => toggleModal(true)),
);

[closeModalButton, overlayContainer].forEach((element) =>
	element.addEventListener("click", () => toggleModal(false)),
);

document.addEventListener(
	"keydown",
	(e) =>
		e.key === "Escape" &&
		!modalContainer.classList.contains("hidden") &&
		toggleModal(false),
);
