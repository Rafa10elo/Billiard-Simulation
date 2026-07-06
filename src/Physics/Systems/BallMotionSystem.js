import { Vector3 } from '../Math/Vector3.js';
export class BallMotionSystem {

    constructor(config, tablePhysics, groundY = null) {
        this.gravity = config.gravity;
        this.epsilon = config.epsilon;
        this.tablePhysics = tablePhysics;
        this.groundY = groundY; 
    }

   update(balls, dt) {
        balls.forEach(ball => {
            this.applyExternalForces(ball);

            const onTable = !ball.isPocketed && this.tablePhysics.supportsBall(ball);
            const onGround = (this.groundY !== null) && (ball.position.y <= this.groundY + ball.radius + 1e-4);

            if (onTable || onGround) {
                this.applyTableKinematics(ball, onGround);
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

     applyTableKinematics(ball, onGround) {
        const uX = ball.velocity.x + ball.radius * ball.angularVelocity.z;
        const uz = ball.velocity.z - ball.radius * ball.angularVelocity.x;
        const u = ball.velocity.clone().set(uX, 0, uz);
        const uLength = u.length();
        const spin = ball.angularVelocity.y;

        const horizontalVel = ball.velocity.clone().set(ball.velocity.x, 0, ball.velocity.z);
        const speed = horizontalVel.length();
        const targetY = onGround ? (this.groundY + ball.radius) : this.tablePhysics.surfaceY;
        
        if (ball.position.y < targetY) {
            const penetration = targetY - ball.position.y;
            if (penetration > 0.0005) {
                const slop = 0.0005;
                const beta = 0.2;
                ball.position.y += Math.max(0, penetration - slop) * beta;
            }

            if (ball.velocity.y < 0) {
                this.applyBouncePhysics(ball);
            }
            if (ball.acceleration.y < 0) {
                ball.acceleration.y = 0;
            }
        }

        if (uLength > this.epsilon) {
            this.applySlidingPhysics(ball,u);
            return;
        }

        if (speed > this.epsilon) {
            this.applyRollingPhysics(ball,horizontalVel);
            return;
        }
        
        if (Math.abs(spin) > this.epsilon){
            this.applySideSpinFriction(ball, spin);
            return;
        }

        this.sleepBall(ball);
        
    }

    applySideSpinFriction(ball,spin){   
        const spinDirection = Math.sign(spin);

        ball.angularAcceleration.y =
            -spinDirection *
            ball.mu_sp *
            Math.abs(this.gravity) /
            ball.radius;
    }

    sleepBall (ball){
        ball.velocity.set(0, 0, 0);
        ball.angularVelocity.set(0, 0, 0);
        ball.acceleration.set(0, 0, 0);
        ball.angularAcceleration.set(0, 0, 0);
    }

    applyBouncePhysics(ball){
        if (Math.abs(ball.velocity.y) < 0.05) {
            ball.velocity.y = 0;
        } else {
            ball.velocity.y *= -ball.restitution;
        }
    }

    applySlidingPhysics (ball,u){
        const uDirection = u.clone().normalize();
        const slidingScalar = -ball.mu_k * Math.abs(this.gravity);

        ball.acceleration.set(
            slidingScalar * uDirection.x,
            0,
            slidingScalar * uDirection.z
        );
        const alpha = (5 * ball.mu_k * Math.abs(this.gravity)) / (2 * ball.radius);
        ball.angularAcceleration.set(
            alpha * uDirection.z,
            0,
            -alpha * uDirection.x
        );
        return;
    }

    applyRollingPhysics(ball,horizontalVel){
        const velocityDirection = horizontalVel.clone().normalize();
        const rollingScalar = -ball.mu_r * Math.abs(this.gravity);

        ball.acceleration.set(
            rollingScalar * velocityDirection.x,
            0,
            rollingScalar * velocityDirection.z
        );

        const radius = ball.radius;
        ball.angularAcceleration.set(
            (-rollingScalar * velocityDirection.z) / radius,
            0,
            (rollingScalar * velocityDirection.x) / radius
        );
        return;
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

    updateRotationFromSpin(ball, dt) {
      ball.integrateRotation(dt);
    }

}