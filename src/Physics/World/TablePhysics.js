export class TablePhysics {


    constructor(config) {
    this.surfaceY = config.surfaceY;
    this.bounds = config.bounds;
    this.pockets = config.pockets ?? [];
}

    inAir(ball) {
        return ball.position.y > (this.surfaceY + 0.001);
    }

    getSnapshot() {
        return {
            surfaceY: this.surfaceY,
            bounds: { ...this.bounds },
            pockets: this.pockets.map(pocket => ({ ...pocket }))
        };
    }

supportsBall(ball) {

    if (ball.position.y > this.surfaceY + 0.001)
        return false;

    return this.isInsidePlayableSurface(ball);
}

isInsidePlayableSurface(ball) {
    const { minX, maxX, minZ, maxZ } = this.bounds;

    if (
        ball.position.x < minX ||
        ball.position.x > maxX ||
        ball.position.z < minZ ||
        ball.position.z > maxZ
    ) {
        return false;
    }

    for (const pocket of this.pockets) {

        const dx = ball.position.x - pocket.x;
        const dz = ball.position.z - pocket.z;

        if (dx * dx + dz * dz <= pocket.radius * pocket.radius) {
            return false;
        }
    }

    return true;
}

}