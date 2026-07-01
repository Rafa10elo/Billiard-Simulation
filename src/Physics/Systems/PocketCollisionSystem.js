export class PocketCollisionSystem {
    update(balls, tablePhysics) {
        balls.forEach(ball => {
            if (!ball.isActive || ball.isPocketed) return;
            this.evaluatePocketDetection(ball, tablePhysics);
        });
    }
    evaluatePocketDetection(ball, tablePhysics) {
        if (!ball.isActive || ball.isPocketed) return;
        if (!tablePhysics.supportsBall(ball)) {
            if (ball.position.y < tablePhysics.surfaceY - 1e-4) {
                for (const pocket of tablePhysics.pockets) {
                    const dx = ball.position.x - pocket.x;
                    const dz = ball.position.z - pocket.z;
                    const distanceSquared = dx * dx + dz * dz;
                    if (distanceSquared <= (pocket.radius * 1.5) * (pocket.radius * 1.5)) {
                        console.log("pocketed: id" + ball.id);
                        ball.isPocketed = true;
                        ball.pocketCenter = { x: pocket.x, z: pocket.z };
                        return;
                    }
                }
            }
        }
    }
}
