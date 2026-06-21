import { MotionSystem } from '/src/Physics/Systems/MotionSystem.js';

export class PhysicsWorld {

    constructor() {

        this.balls = [];

        this.motionSystem =
            new MotionSystem();
    }


    addBall(ball) {
    this.balls.push(ball);
}

step(dt) {

    this.motionSystem.update(
        this.balls,
        dt
    );

}
}

export { MotionSystem };