export class TablePhysics {

    constructor(config) {
        this.surfaceY = config.surfaceY;
        this.bounds = config.tableBounds;
    }

    inAir(ball) {
        return ball.position.y > (this.surfaceY + 0.001);
    }

    getSnapshot() {
        return {
            surfaceY: this.surfaceY,
            bounds: { ...this.bounds }
        };
    }

}