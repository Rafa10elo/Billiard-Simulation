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
            if (ball.isPocketed) continue;
            const minY = this.groundY + ball.radius;
            if (ball.position.y < minY) {
                const v_rel_n = ball.velocity.y;
                if (v_rel_n < 0) {
                    ball.position.y = minY + this.epsilon;
                    const e = this.restitution;
                    const v_n_after = -e * v_rel_n;
                    ball.velocity.y = v_n_after;
                    const j = -(1 + e) * v_rel_n * ball.mass;
                    const v_tx = ball.velocity.x;
                    const v_tz = ball.velocity.z;
                    const imp_tx = -ball.mass * v_tx;
                    const imp_tz = -ball.mass * v_tz;
                    const imp_t_mag = Math.hypot(imp_tx, imp_tz);
                    const max_friction = Math.abs(j) * this.friction;
                    let scale = 1;
                    if (imp_t_mag > max_friction && imp_t_mag > 0) {
                        scale = max_friction / imp_t_mag;
                    }
                    const applied_tx = imp_tx * scale;
                    const applied_tz = imp_tz * scale;
                    ball.velocity.x += applied_tx / ball.mass;
                    ball.velocity.z += applied_tz / ball.mass;
                    const r = ball.radius;
                    const invI = 5 / (2 * ball.mass * r * r);
                    const torqueX = -r * applied_tz;
                    const torqueZ = r * applied_tx;
                    ball.angularVelocity.x += torqueX * invI;
                    ball.angularVelocity.z += torqueZ * invI;
                    if (Math.abs(ball.velocity.y) < this.minBounceThreshold) {
                        ball.velocity.y = 0;
                        ball.position.y = minY;
                    }
                } else {
                    ball.position.y = minY;
                    ball.velocity.y = Math.max(ball.velocity.y, 0);
                }
                if (Math.abs(ball.velocity.x) < 1e-3) ball.velocity.x = 0;
                if (Math.abs(ball.velocity.z) < 1e-3) ball.velocity.z = 0;
            }
        }
    }
}
