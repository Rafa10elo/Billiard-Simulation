export class GroundCollisionSystem {

    constructor(config, groundY = 0) {

        this.groundY = groundY;

        this.restitution = 0.45;
        this.friction = 0.25;

        this.epsilon = 1e-6;
        this.minBounceThreshold = 0.02;
    }

    update(balls) {

        for (const ball of balls) {

            if (ball.isPocketed)
                continue;

            if (!this.isTouchingGround(ball))
                continue;

            this.correctPenetration(ball);

            if (ball.velocity.y < 0) {

                const normalImpulse =
                    this.resolveNormalCollision(ball);

                this.resolveTangentialFriction(
                    ball,
                    normalImpulse
                );

                this.resolveAngularResponse(
                    ball,
                    normalImpulse
                );

                this.removeTinyBounce(ball);

            } else {

                ball.velocity.y =
                    Math.max(ball.velocity.y, 0);

            }

            this.removeTinyHorizontalVelocity(ball);

        }

    }

    isTouchingGround(ball) {

        const minY =
            this.groundY + ball.radius;

        return ball.position.y < minY;

    }

    correctPenetration(ball) {

        ball.position.y =
            this.groundY +
            ball.radius +
            this.epsilon;

    }

    resolveNormalCollision(ball) {

        const vn = ball.velocity.y;

        const impulse =
            -(1 + this.restitution) *
            vn *
            ball.mass;

        ball.velocity.y =
            -this.restitution * vn;

        return impulse;

    }

    resolveTangentialFriction(ball, normalImpulse) {

        const desiredImpulseX =
            -ball.mass * ball.velocity.x;

        const desiredImpulseZ =
            -ball.mass * ball.velocity.z;

        const desiredMagnitude =
            Math.hypot(
                desiredImpulseX,
                desiredImpulseZ
            );

        const maxFrictionImpulse =
            Math.abs(normalImpulse) *
            this.friction;

        let scale = 1;

        if (
            desiredMagnitude > maxFrictionImpulse &&
            desiredMagnitude > 0
        ) {

            scale =
                maxFrictionImpulse /
                desiredMagnitude;

        }

        ball._groundImpulse = {

            x: desiredImpulseX * scale,
            z: desiredImpulseZ * scale

        };

        ball.velocity.x +=
            ball._groundImpulse.x /
            ball.mass;

        ball.velocity.z +=
            ball._groundImpulse.z /
            ball.mass;

    }

    resolveAngularResponse(ball) {

        if (!ball._groundImpulse)
            return;

        const r = ball.radius;

        const inverseInertia =
            5 /
            (2 * ball.mass * r * r);

        const torqueX =
            -r * ball._groundImpulse.z;

        const torqueZ =
            r * ball._groundImpulse.x;

        ball.angularVelocity.x +=
            torqueX * inverseInertia;

        ball.angularVelocity.z +=
            torqueZ * inverseInertia;

        delete ball._groundImpulse;

    }

    removeTinyBounce(ball) {

        if (
            Math.abs(ball.velocity.y) <
            this.minBounceThreshold
        ) {

            ball.velocity.y = 0;

        }

    }

    removeTinyHorizontalVelocity(ball) {

        if (Math.abs(ball.velocity.x) < 1e-3)
            ball.velocity.x = 0;

        if (Math.abs(ball.velocity.z) < 1e-3)
            ball.velocity.z = 0;

    }

}