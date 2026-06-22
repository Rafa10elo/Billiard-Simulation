export class GameState {

	constructor() {
		this.running = true;
		this.lastSnapshot = { balls: [] };
		this.aimX = 0;
		this.aimZ = -1;
		this.shotPower = 1.8;
	}

}
