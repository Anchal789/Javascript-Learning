document.addEventListener("DOMContentLoaded", () => {
	console.log("Project Hub Loaded Successfully!");

	const cards = document.querySelectorAll(".card");

	cards.forEach((card) => {
		card.addEventListener("click", () => {
			console.log(`Navigating to: ${card.querySelector("h2").innerText}`);
		});
	});
});
