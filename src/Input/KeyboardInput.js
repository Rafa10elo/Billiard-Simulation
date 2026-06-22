export class KeyboardInput {

	constructor() {
		this.keys = new Set();
		this.previousKeys = new Set();
		this.justPressedKeys = new Set();
		this.gameKeys = new Set(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space', 'ShiftLeft', 'KeyR', 'Digit1', 'Digit2', 'Digit3']);

		window.addEventListener('keydown', (event) => {
			if (this.gameKeys.has(event.code)) {
				event.preventDefault();
			}
			this.keys.add(event.code);
		});

		window.addEventListener('keyup', (event) => {
			if (this.gameKeys.has(event.code)) {
				event.preventDefault();
			}
			this.keys.delete(event.code);
		});
	}

	update() {
		this.justPressedKeys = new Set();

		this.keys.forEach((key) => {
			if (!this.previousKeys.has(key)) {
				this.justPressedKeys.add(key);
			}
		});

		this.previousKeys = new Set(this.keys);
	}

	isPressed(code) {
		return this.keys.has(code);
	}

	isJustPressed(code) {
		return this.justPressedKeys.has(code);
	}

}
