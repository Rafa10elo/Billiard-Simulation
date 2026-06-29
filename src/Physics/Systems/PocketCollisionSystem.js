export class PocketCollisionSystem {

    update(balls, tablePhysics, dt) {
        if (!tablePhysics || !dt) return;

        balls.forEach((ball) => {
            if (ball.isPocketed) {
                this.handlePocketEvent(ball, dt);
                this.removePocketedBall(ball);
                return;
            }

            if (!this.detectPocket(ball, tablePhysics.pockets)) {
                return;
            }

            ball.isPocketed = true;
            
        
            ball.velocity.x *= 0.3;
            ball.velocity.z *= 0.3;
            
        });
    }

    detectPocket(ball, pockets) {
        if (!pockets || ball.isActive === false) return false;

        for (let pocket of pockets) {
            const dx = ball.position.x - pocket.x;
            const dz = ball.position.z - pocket.z;
            const distanceSq = dx * dx + dz * dz;

            const ballRadius = ball.radius || 0.025;
            const triggerRadius = pocket.radius + ballRadius;
            const triggerRadiusSq = triggerRadius * triggerRadius;

            if (distanceSq < triggerRadiusSq) {
                console.log(`%c [SUCCESS] Ball ${ball.id || 'Pool'} fell into central pocket at (${pocket.x}, ${pocket.z})`, 'background: #222; color: #bada55; font-size: 14px;');
                return true;
            }
        }
        return false;
    }

   handlePocketEvent(ball, dt) {

    const damping = Math.exp(-8 * dt);

    ball.velocity.x *= damping;
    ball.velocity.z *= damping;
}

    removePocketedBall(ball) {
        if (ball.position.y < 0.4) {
            ball.velocity.x = 0;
            ball.velocity.y = 0;
            ball.velocity.z = 0;
            if (ball.acceleration) {
                ball.acceleration.x = 0;
                ball.acceleration.y = 0;
                ball.acceleration.z = 0;
            }
            ball.isActive = false; 
    }
}

    resetPocketState(ball, spawnPosition) {
        ball.isPocketed = false;
        ball.isActive = true;
        if (ball.position && ball.position.copy) {
            ball.position.copy(spawnPosition);
        }
    }
    }

