"use strict";

// ===== Elements =====
const popup = document.querySelector(".modal");
const backdrop = document.querySelector(".overlay");
const closeBtn = document.querySelector(".btn--close-modal");
const openBtns = document.querySelectorAll(".btn--show-modal");

const scrollBtn = document.querySelector(".btn--scroll-to");
const firstSection = document.querySelector("#section--1");

const navbar = document.querySelector(".nav");
const navLinksWrapper = document.querySelector(".nav__links");

const tabWrapper = document.querySelector(".operations__tab-container");
const tabBtns = document.querySelectorAll(".operations__tab");
const tabPanels = document.querySelectorAll(".operations__content");

// ===== Modal =====
const showPopup = (e) => {
	e.preventDefault();
	popup.classList.remove("hidden");
	backdrop.classList.remove("hidden");
};

const hidePopup = () => {
	popup.classList.add("hidden");
	backdrop.classList.add("hidden");
};

openBtns.forEach((btn) => btn.addEventListener("click", showPopup));
closeBtn.addEventListener("click", hidePopup);
backdrop.addEventListener("click", hidePopup);

document.addEventListener("keydown", (e) => {
	if (e.key === "Escape" && !popup.classList.contains("hidden")) {
		hidePopup();
	}
});

// ===== Smooth Scroll =====
scrollBtn.addEventListener("click", () => {
	firstSection.scrollIntoView({ behavior: "smooth" });
});

navLinksWrapper.addEventListener("click", (e) => {
	e.preventDefault();

	const target = e.target;
	if (!target.classList.contains("nav__link")) return;

	const sectionId = target.getAttribute("href");
	document.querySelector(sectionId).scrollIntoView({ behavior: "smooth" });
});

// ===== Tabs =====
tabWrapper.addEventListener("click", (e) => {
	const selectedTab = e.target.closest(".operations__tab");
	if (!selectedTab) return;

	tabBtns.forEach((btn) => btn.classList.remove("operations__tab--active"));
	tabPanels.forEach((panel) =>
		panel.classList.remove("operations__content--active"),
	);

	selectedTab.classList.add("operations__tab--active");

	document
		.querySelector(`.operations__content--${selectedTab.dataset.tab}`)
		.classList.add("operations__content--active");
});

// ===== Menu Fade =====
const changeOpacity = function (e) {
	if (!e.target.classList.contains("nav__link")) return;

	const current = e.target;
	const allLinks = current.closest(".nav").querySelectorAll(".nav__link");
	const logoImg = current.closest(".nav").querySelector("img");

	allLinks.forEach((link) => {
		if (link !== current) link.style.opacity = this;
	});

	logoImg.style.opacity = this;
};

navbar.addEventListener("mouseover", changeOpacity.bind(0.4));
navbar.addEventListener("mouseout", changeOpacity.bind(1));

// ===== Sticky Navbar =====
const headerEl = document.querySelector(".header");
const navSize = navbar.getBoundingClientRect().height;

const observeHeader = (entries) => {
	const [entry] = entries;

	navbar.classList.toggle("sticky", !entry.isIntersecting);
};

const headerWatcher = new IntersectionObserver(observeHeader, {
	root: null,
	threshold: 0,
	rootMargin: `-${navSize}px`,
});

headerWatcher.observe(headerEl);

// ===== Reveal Sections =====
const sections = document.querySelectorAll(".section");

const revealOnScroll = (entries, observer) => {
	entries.forEach((entry) => {
		if (!entry.isIntersecting) return;

		entry.target.classList.remove("section--hidden");
		observer.unobserve(entry.target);
	});
};

const sectionWatcher = new IntersectionObserver(revealOnScroll, {
	root: null,
	threshold: 0.2,
});

sections.forEach((sec) => {
	sec.classList.add("section--hidden");
	sectionWatcher.observe(sec);
});

// ===== Lazy Images =====
const lazyImages = document.querySelectorAll("img[data-src]");

const swapImage = (entries, observer) => {
	const [entry] = entries;
	if (!entry.isIntersecting) return;

	const img = entry.target;
	img.src = img.dataset.src;

	img.addEventListener("load", () => {
		img.classList.remove("lazy-img");
	});

	observer.unobserve(img);
};

const imageWatcher = new IntersectionObserver(swapImage, {
	root: null,
	threshold: 0,
	rootMargin: "150px",
});

lazyImages.forEach((img) => imageWatcher.observe(img));

// ===== Slider =====
const initSlider = () => {
	const slides = document.querySelectorAll(".slide");
	const leftBtn = document.querySelector(".slider__btn--left");
	const rightBtn = document.querySelector(".slider__btn--right");
	const dotsArea = document.querySelector(".dots");

	let current = 0;
	const total = slides.length;

	const renderDots = () => {
		slides.forEach((_, i) => {
			dotsArea.insertAdjacentHTML(
				"beforeend",
				`<button class="dots__dot" data-index="${i}"></button>`,
			);
		});
	};

	const highlightDot = (index) => {
		document
			.querySelectorAll(".dots__dot")
			.forEach((dot) => dot.classList.remove("dots__dot--active"));

		document
			.querySelector(`.dots__dot[data-index="${index}"]`)
			.classList.add("dots__dot--active");
	};

	const moveToSlide = (index) => {
		slides.forEach((slide, i) => {
			slide.style.transform = `translateX(${100 * (i - index)}%)`;
		});
	};

	const next = () => {
		current = current === total - 1 ? 0 : current + 1;
		moveToSlide(current);
		highlightDot(current);
	};

	const prev = () => {
		current = current === 0 ? total - 1 : current - 1;
		moveToSlide(current);
		highlightDot(current);
	};

	const setup = () => {
		moveToSlide(0);
		renderDots();
		highlightDot(0);
	};

	setup();

	rightBtn.addEventListener("click", next);
	leftBtn.addEventListener("click", prev);

	document.addEventListener("keydown", (e) => {
		if (e.key === "ArrowLeft") prev();
		if (e.key === "ArrowRight") next();
	});

	dotsArea.addEventListener("click", (e) => {
		if (!e.target.classList.contains("dots__dot")) return;

		current = Number(e.target.dataset.index);
		moveToSlide(current);
		highlightDot(current);
	});
};

initSlider();
