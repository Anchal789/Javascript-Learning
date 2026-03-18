"use strict";

class Store {
	#state;
	#subscribers = new Set();
	#history = [];
	#historyIndex = -1;
	#isBatching = false;
	#maxHistory = 10;

	constructor(initialState) {
		const freezedState = this.#deepFreeze({ ...initialState });
		this.#state = freezedState;
		this.#addToHistory(freezedState);
	}

	getState = () => this.#state;

	setState = (updater) => {
		const nextState = updater(this.#state);

		if (nextState === this.#state) return;
		else {
			this.#state = nextState;
			this.#addToHistory(nextState);
			this.#scheduleNotify();
		}
	};

	subscribe = (selector, callback) => {
		const subscription = {
			selector,
			callback,
			lastValue: selector(this.#state),
		};

		this.#subscribers.add(subscription);

		return () => this.#subscribers.delete(subscription);
	};

	undo = () => {
		if (this.#historyIndex > 0) {
			this.#historyIndex--;
			this.#state = this.#history[this.#historyIndex];
			this.#scheduleNotify();
		}
	};

	redo = () => {
		if (this.#historyIndex < this.#history.length - 1) {
			this.#historyIndex++;
			this.#state = this.#history[this.#historyIndex];
			this.#scheduleNotify();
		}
	};

	#addToHistory(state) {
		this.#history = this.#history.slice(0, this.#historyIndex + 1);
		this.#history.push(state);

		if (this.#history.length > this.#maxHistory) {
			this.#history.shift();
			this.#historyIndex--;
		} else {
			this.#historyIndex++;
		}
	}

	#scheduleNotify() {
		if (this.#isBatching) return;

		this.#isBatching = true;
		queueMicrotask(() => {
			this.#isBatching = false;
			this.#notify();
		});
	}

	#notify() {
		this.#subscribers.forEach((sub) => {
			const newValue = sub.selector(this.#state);
			if (newValue !== sub.lastValue) {
				sub.lastValue = newValue;
				sub.callback(newValue);
			}
		});
	}

	#deepFreeze(obj) {
		if (obj === null || typeof obj !== "object") return obj;

		Object.freeze(obj);
		Object.values(obj).forEach((val) => this.#deepFreeze(val));
		return obj;
	}
}

document.addEventListener("DOMContentLoaded", () => {
	const store = new Store({ count: 0, lastAction: "Initialize" });

	const elements = {
		count: document.getElementById("count"),
		action: document.getElementById("action"),
		inc: document.getElementById("increment"),
		dec: document.getElementById("decrement"),
		undo: document.getElementById("undo"),
		redo: document.getElementById("redo"),
	};

	store.subscribe(
		(s) => s.count,
		(count) => {
			elements.count.textContent = count;
			console.log("UI Update: Count changed to", count);
		},
	);

	store.subscribe(
		(s) => s.lastAction,
		(action) => {
			elements.action.textContent = action;
		},
	);

	elements.inc.onclick = () => {
		store.setState((s) => ({
			...s,
			count: s.count + 1,
			lastAction: "Increment",
		}));
		store.setState((s) => ({ ...s, lastAction: "Increment (Batched)" }));
	};

	elements.dec.onclick = () =>
		store.setState((s) => ({
			...s,
			count: s.count - 1,
			lastAction: "Decrement",
		}));

	elements.undo.onclick = () => store.undo();
	elements.redo.onclick = () => store.redo();
});
