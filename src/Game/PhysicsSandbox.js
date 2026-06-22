import { BallData } from '../Data/BallData.js';

export class PhysicsSandbox {

    constructor(physicsWorld) {
        this.physicsWorld = physicsWorld;
        this.initialBallData = BallData;
    }

    reset() {
        this.physicsWorld.balls.forEach((ball) => {
            const data = this.initialBallData.find(d => d.id === ball.id);
            if (data) {
                ball.position.x = data.startPos.x;
                ball.position.y = data.startPos.y;
                ball.position.z = data.startPos.z;
            }
            ball.velocity.set(0, 0, 0);
            ball.acceleration.set(0, 0, 0);
            ball.angularVelocity.set(0, 0, 0);
            ball.angularAcceleration.set(0, 0, 0);
        });
    }

    throwCueBall() {
        const cue = this.physicsWorld.balls.find(b => b.isCue);
        if (!cue) return;
        cue.velocity.x = 1.5;
        cue.velocity.z = 0.5;
    }

    shootAtRack() {
        const cue = this.physicsWorld.balls.find(b => b.isCue);
        if (!cue) return;
        cue.velocity.x = 0;
        cue.velocity.z = -2.0;
    }

    shootAtCushion() {
        const cue = this.physicsWorld.balls.find(b => b.isCue);
        if (!cue) return;
        cue.velocity.x = 1.2;
        cue.velocity.z = -0.6;
    }

    explodeAll() {
        this.physicsWorld.balls.forEach((ball, i) => {
            ball.velocity.x += (Math.random() - 0.5) * 1.6;
            ball.velocity.z += (Math.random() - 0.5) * 1.6;
        });
    }

}
