import { TableData } from '../../Data/TableData.js';

export class PocketCollisionSystem {
    update(balls, tablePhysics) {
        balls.forEach(ball => {
            if (!ball.isActive || ball.isPocketed) return;
            this.evaluatePocketDetection(ball, tablePhysics.pockets);
        });
    }
    evaluatePocketDetection(ball, pockets) {
        if (!ball.isActive || ball.isPocketed) return;
        for (const pocket of pockets) {
            const dx = ball.position.x - pocket.x;
            const dz = ball.position.z - pocket.z;
            const distanceSquared = dx * dx + dz * dz;
            const pocketRadius = pocket.radius;
            if (distanceSquared <= pocketRadius * pocketRadius) {
                const tunnelBottom = pocket.y - pocket.depth;
                if (ball.position.y <= tunnelBottom) {
                    console.log("pocketed: id" + ball.id);
                    ball.isPocketed = true;
                    return;
                }
            }
        }
    }
}
