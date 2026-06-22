export class MouseInput {

	constructor(domElement) {
		this.position = { x: 0, y: 0 };

		domElement.addEventListener('pointermove', (event) => {
			this.position.x = event.clientX;
			this.position.y = event.clientY;
		});
	}

}
