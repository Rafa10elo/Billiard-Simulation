export class GameState {

    constructor() {

        this.running = true;
        this.resetting = false;

        this.totalBalls = 0;
        this.pocketedBalls = 0;

        this.lastSnapshot = null;

        this.aimX = 0;
        this.aimZ = -1;
        this.shotPower = 1.8;
    }

}