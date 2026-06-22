export class PocketCollisionSystem {

	update(balls) {
		balls.forEach((ball) => {
			if (!this.detectPocket(ball)) {
				return;
			}

			this.handlePocketEvent(ball);
			this.removePocketedBall(ball);
		});
	}

	detectPocket(ball) {
		return false;
	}

	removePocketedBall(ball) {

	}

	handlePocketEvent(ball) {

	}

	resetPocketState() {

	}

}

