export class PocketCollisionSystem {

    update(balls, tablePhysics, dt) {
        if (!tablePhysics || !dt) return;

        balls.forEach((ball) => {
         
            this.evaluatePocketDetection(ball, tablePhysics.pockets);
        });
    }

    evaluatePocketDetection(ball, pockets) {
        if (ball.isActive === false || ball.isPocketed) return;

        const ballRadius = ball.radius || 0.0225;

        for (let pocket of pockets) {
            const dx = ball.position.x - pocket.x;
            const dz = ball.position.z - pocket.z;
            const distanceSq = dx * dx + dz * dz;

            const tableEdgeRadius = pocket.radius - ballRadius * 0.2;

            if (distanceSq < tableEdgeRadius * tableEdgeRadius) {
                ball.isPocketed = true;
                return;
            }
        }
    }
}
