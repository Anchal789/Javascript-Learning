class MyPromise {
	constructor(executor) {
		this.state = "pending";
		this.value = undefined;
		this.reason = undefined;
		this.onResolve = [];
		this.onReject = [];
		this.onFinally = [];
		try {
			executor(this.resolve.bind(this), this.reject.bind(this));
		} catch (error) {
			this.reject(error);
		}
	}
	resolve(value) {
		if (this.state === "pending") {
			this.state = "fulfilled";
			this.value = value;
			this.onResolve.forEach((fn) => fn(value));
		}
	}
	reject(reason) {
		if (this.state === "pending") {
			this.state = "rejected";
			this.reason = reason;
			this.onReject.forEach((fn) => fn(reason));
		}
	}
	then(onResolve, onReject) {
		return new MyPromise((resolve, reject) => {
			this.onResolve.push(() => {
				try {
					const result = onResolve(this.value);
					resolve(result);
				} catch (error) {
					reject(error);
				}
			});
			this.onReject.push(() => {
				try {
					const result = onReject(this.reason);
					resolve(result);
				} catch (error) {
					reject(error);
				}
			});
		});
	}
	catch(onReject) {
		return this.then(null, onReject);
	}
	finally(onFinally) {
		return this.then(onFinally, onFinally);
	}
}
// Example usage:
const promise = new MyPromise((resolve, reject) => {
	setTimeout(() => resolve("Hello, World!"), 1000);
});
promise
	.then((value) => {
		console.log(value); // "Hello, World!"
		return "Next step";
	})
	.then((value) => {
		console.log(value); // "Next step"
		// throw new Error("Something went wrong!");
	})
	.catch((error) => {
		console.error(error); // Error: Something went wrong!
	})
	.finally(() => {
		console.log("Promise settled."); // "Promise settled."
	});
