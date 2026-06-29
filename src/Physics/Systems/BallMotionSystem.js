export class BallMotionSystem {

    constructor(config, tablePhysics) {
        this.gravity = config.gravity;
        this.epsilon = config.epsilon;
        this.tablePhysics = tablePhysics;
    }

    update(balls, dt) {

        balls.forEach(ball => {

            this.applyExternalForces(ball, dt);

          if (this.tablePhysics.supportsBall(ball)) {
          this.applyTableKinematics(ball);
}           else {
                this.applyAirKinematics(ball);
}

            this.applyFriction(ball, dt);
            this.applyLinearAcceleration(ball, dt);
            this.applyAngularAcceleration(ball, dt);
            this.integrateLinearMotion(ball, dt);
            this.integrateAngularMotion(ball, dt);
            this.updateRotationFromSpin(ball, dt);

        });

    }

    applyExternalForces(ball, dt) {
    }

    applyFriction(ball, dt) {

    }

    applyLinearAcceleration(ball, dt) {
        ball.velocity.add(
            ball.acceleration.clone()
                .multiplyScalar(dt)
        );
    }

    applyAngularAcceleration(ball, dt) {
        ball.angularVelocity.add(
            ball.angularAcceleration.clone()
                .multiplyScalar(dt)
        );
    }

    integrateLinearMotion(ball, dt) {
        ball.position.add(
            ball.velocity.clone()
                .multiplyScalar(dt)
        );
    }

    integrateAngularMotion(ball, dt) {

    }

    updateRotationFromSpin(ball, dt) {

    }

    applyAirKinematics(ball) {
        ball.acceleration.set(0, this.gravity, 0);
        ball.angularAcceleration.set(0, 0, 0);
        //  airborne kinematics
    }

    applyTableKinematics(ball) {
        ball.position.y = this.tablePhysics.surfaceY;
        ball.velocity.y = 0;
        ball.acceleration.y = 0;

        const uX = ball.velocity.x + ball.radius * ball.angularVelocity.y;
        const uY = ball.velocity.y - ball.radius * ball.angularVelocity.x;
        const u = ball.velocity.clone().set(uX, uY, 0);
        const uLength = u.length();

        const horizontalVel = ball.velocity.clone().set(ball.velocity.x, 0, ball.velocity.z);
        const speed = horizontalVel.length();

        if (uLength > this.epsilon) {
            const uDirection = u.clone().normalize();
            const slidingScalar = ball.mu_k * this.gravity;
            ball.acceleration.set(
                slidingScalar * uDirection.x,
                0,
                slidingScalar * uDirection.z
            );
            // SLIDING SPIN AL ZOLIM
            return;
        }

        if (speed > this.epsilon) {
            const velocityDirection = horizontalVel.clone().normalize();
            const rollingScalar = ball.mu_r * this.gravity;
            ball.acceleration.set(
                rollingScalar * velocityDirection.x,
                0,
                rollingScalar * velocityDirection.z
            );
            // EQUATION     ROLLING torque
            return;
        }

        ball.velocity.x = 0;
        ball.velocity.z = 0;
        ball.acceleration.set(0, 0, 0);
        ball.angularAcceleration.set(0, 0, 0);
    }
    

}