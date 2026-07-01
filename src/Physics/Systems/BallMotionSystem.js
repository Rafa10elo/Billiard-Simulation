import { Vector3 } from '../Math/Vector3.js';
export class BallMotionSystem {

    constructor(config, tablePhysics, groundY = null) {
        this.gravity = config.gravity;
        this.epsilon = config.epsilon;
        this.tablePhysics = tablePhysics;
<<<<<<< HEAD
        this.groundY = groundY; 
        this.minVelocity = 0.015;
        this.minAngularVelocity = 0.015;
=======
>>>>>>> 4b8452bfd94ce3fa807d1d34f196ec15b8d70acb
    }

   update(balls, dt) {
        balls.forEach(ball => {
            this.applyExternalForces(ball);

            const onTable = this.tablePhysics.supportsBall(ball);
            const onGround = (this.groundY !== null) && (ball.position.y <= this.groundY + ball.radius + 1e-4);

            if (onTable || onGround) {
                this.applyTableKinematics(ball, onGround);
                this.applySideSpinFriction(ball);
            } else {
                this.applyAirKinematics(ball);
            }

            this.applyLinearAcceleration(ball, dt);
            this.integrateLinearMotion(ball, dt);
            this.integrateAngularMotion(ball, dt);
            this.updateRotationFromSpin(ball,dt);
        });
    }

    applyExternalForces(ball) {
        ball.clearForces();
    }

    applyAirKinematics(ball) {
        ball.acceleration.set(0, this.gravity, 0);
        ball.angularAcceleration.set(0, 0, 0);
    }

    applyTableKinematics(ball, useGround = false) {
        if (useGround) {
            ball.position.y = this.groundY + ball.radius;
        } else {
            ball.position.y = this.tablePhysics.surfaceY;
        }
        ball.velocity.y = 0;
        ball.acceleration.y = 0;

        const uX = ball.velocity.x + ball.radius * ball.angularVelocity.z;
        const uz = ball.velocity.z - ball.radius * ball.angularVelocity.x;
        const u = ball.velocity.clone().set(uX, 0, uz);
        const uLength = u.length();

        const horizontalVel = ball.velocity.clone().set(ball.velocity.x, 0, ball.velocity.z);
        const speed = horizontalVel.length();

        if (uLength > this.epsilon) {
            const uDirection = u.clone().normalize();

            const slidingScalar =-ball.mu_k * Math.abs(this.gravity);

            ball.acceleration.set(
                slidingScalar * uDirection.x,
                0,
                slidingScalar * uDirection.z
            );

            const alpha =(5 * ball.mu_k * Math.abs(this.gravity))/ (2 * ball.radius);

            ball.angularAcceleration.set(
                alpha * uDirection.z,
                0,
                -alpha * uDirection.x
            );

            return;
        }

        if (speed > this.epsilon) {
            const velocityDirection =horizontalVel.clone().normalize();

            const rollingScalar =-ball.mu_r * Math.abs(this.gravity);

            ball.acceleration.set(
                rollingScalar * velocityDirection.x,
                0,
                rollingScalar * velocityDirection.z
            );

            const radius = ball.radius;

            ball.angularAcceleration.set(
                (-rollingScalar * velocityDirection.z) / radius,
                0,
                ( rollingScalar * velocityDirection.x) / radius
            );

            return;
        }   

        ball.velocity.set(0, 0, 0);
        ball.angularVelocity.set(0, 0, 0);
        ball.acceleration.set(0, 0, 0);
        ball.angularAcceleration.set(0, 0, 0);
    }

    integrateLinearMotion(ball, dt) {
        ball.position.add(
            ball.velocity.clone()
                .multiplyScalar(dt)
        );
    }

    integrateAngularMotion(ball, dt) {
        const oldSpin = ball.angularVelocity.y;

        ball.angularVelocity.add(
            ball.angularAcceleration.clone().multiplyScalar(dt)
        );

        if (oldSpin * ball.angularVelocity.y < 0) {
            ball.angularVelocity.y = 0;
        }
    }

    applyLinearAcceleration(ball, dt) {
        const oldVelocity = ball.velocity.clone();
        ball.velocity.add(
            ball.acceleration.clone().multiplyScalar(dt)
        );

        const oldHorizontal = oldVelocity.clone().set(oldVelocity.x,0,oldVelocity.z);
        const newHorizontal = ball.velocity.clone().set(ball.velocity.x,0,ball.velocity.z);

        if(oldHorizontal.dot(newHorizontal) < 0){
            ball.velocity.x = 0;
            ball.velocity.z = 0;
        }
    }

    applySideSpinFriction(ball){
        const spin = ball.angularVelocity.y;

        if (Math.abs(spin) > this.epsilon) {

            const spinDirection = Math.sign(spin);

            ball.angularAcceleration.y =
                -spinDirection *
                ball.mu_sp *
                Math.abs(this.gravity) /
                ball.radius;
        }
    }

    updateRotationFromSpin(ball, dt) {
      ball.integrateRotation(dt);
    }
}