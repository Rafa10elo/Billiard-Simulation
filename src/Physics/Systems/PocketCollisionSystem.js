export class PocketCollisionSystem {
    update(balls, tablePhysics) {
        balls.forEach(ball => {
            if (!ball.isActive || ball.isPocketed) return;
            this.evaluatePocketDetection(ball, tablePhysics);
        });
    }

    evaluatePocketDetection(ball, tablePhysics) {
        if (ball.position.y >= tablePhysics.surfaceY) return;

        for (const pocket of tablePhysics.pockets) {
            const dx = ball.position.x - pocket.x;
            const dz = ball.position.z - pocket.z;
            const distanceSquared = dx * dx + dz * dz;

           
            const captureRadius = pocket.radius * 1.2; 
            const ballDepth = tablePhysics.surfaceY - ball.position.y;

            if (distanceSquared <= captureRadius * captureRadius && ballDepth > ball.radius * 0.5) {
                console.log("pocketed successfully: meow ball " + ball.id);
                
                ball.isPocketed = true;
                ball.pocketCenter = { x: pocket.x, z: pocket.z };

                ball.velocity.x = (pocket.x - ball.position.x) * 2.0;
                ball.velocity.z = (pocket.z - ball.position.z) * 2.0;
                
                return; 
            }
        }
    }
}
