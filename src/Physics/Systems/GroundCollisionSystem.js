import { Vector3 } from '../Math/Vector3.js';

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
            const minY = this.groundY + ball.radius;
            if (ball.position.y <= minY + 1e-3) {
                const v_rel_n = ball.velocity.y;

                if (v_rel_n < 0) {
                    ball.position.y = minY + this.epsilon;
                    const deltaVy = -(1 + this.restitution) * v_rel_n;
                    ball.applyImpulse(new Vector3(0, deltaVy * ball.mass, 0));
                } else {
                    ball.position.y = minY;
                    ball.velocity.y = Math.max(ball.velocity.y, 0);
                }

                const v_tx = ball.velocity.x + ball.radius * ball.angularVelocity.z;
                const v_tz = ball.velocity.z - ball.radius * ball.angularVelocity.x;
                const v_t_mag = Math.hypot(v_tx, v_tz);

                if (v_t_mag > 1e-4) {
                    const j_normal = Math.max(0.1, Math.abs(ball.velocity.y * ball.mass)) || (ball.mass * 9.81 * 0.016);
                    const max_friction = j_normal * this.friction;
                    
                    const imp_tx = -ball.mass * v_tx * 0.4;
                    const imp_tz = -ball.mass * v_tz * 0.4;
                    const imp_t_mag = Math.hypot(imp_tx, imp_tz);

                    const scale = (imp_t_mag > max_friction && imp_t_mag > 0) ? (max_friction / imp_t_mag) : 1;
                    const applied_tx = imp_tx * scale;
                    const applied_tz = imp_tz * scale;

                    ball.applyImpulse(new Vector3(applied_tx, 0, applied_tz));
                    ball.applyAngularImpulse(new Vector3(-ball.radius * applied_tz, 0, ball.radius * applied_tx));
                }

                if (Math.abs(ball.velocity.y) < this.minBounceThreshold) {
                    ball.velocity.y = 0;
                    ball.position.y = minY;
                }

                ball.angularVelocity.y *= 0.95;

                if (Math.abs(ball.velocity.x) < 1e-3 && Math.abs(ball.angularVelocity.z) < 1e-2) ball.velocity.x = 0;
                if (Math.abs(ball.velocity.z) < 1e-2 && Math.abs(ball.angularVelocity.x) < 1e-2) ball.velocity.z = 0;
            }
        }
    }
}
