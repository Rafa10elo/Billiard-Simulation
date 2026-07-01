import { Vector3 } from '../Math/Vector3.js';

export class CushionCollisionSystem {
    constructor(config, tablePhysics) {
        this.restitution = config.restitution;
        this.tablePhysics = tablePhysics;
        this.defaultThickness = 0.02; 
    }

    update(balls) {
        const cushions = this.tablePhysics.cushions;

        balls.forEach(ball => {
            const r = ball.radius;

            cushions.forEach(cushion => {
                const collision = cushion.type === 'arc'
                    ? this.getArcCollision(ball, cushion, r)
                    : this.getLineCollision(ball, cushion, r);

                if (!collision.hit) return;

                this.resolveCushionImpulse(ball, collision.normal, collision.penetration);
                this.applyCushionFriction(ball, collision.normal);
                this.transferSpinOnCushion(ball, collision.normal);
            });
        });
    }

    getLineCollision(ball, cushion, ballRadius) {
        const A = new Vector3(cushion.x1, 0, cushion.z1);
        const B = new Vector3(cushion.x2, 0, cushion.z2);
        const P = new Vector3(ball.position.x, 0, ball.position.z);

        const AB = B.clone().sub(A);
        const AP = P.clone().sub(A);

        const ab2 = AB.dot(AB);
        if (ab2 <= 1e-10) return { hit: false };

        let t = AP.dot(AB) / ab2;
        t = Math.max(0, Math.min(1, t));

        const closest = A.clone().addScaledVector(AB, t);
        const PC = P.clone().sub(closest);
        const dist = PC.length();

        const thickness = cushion.thickness ?? this.defaultThickness;
        const effectiveRadius = ballRadius + (thickness * 0.5);

        if (dist >= effectiveRadius) return { hit: false };

        let n;
        if (dist <= 1e-8) {
            const dir = AB.clone().normalize();
            n = new Vector3(-dir.z, 0, dir.x).normalize();
        } else {
            n = PC.clone().multiplyScalar(1 / dist);
        }

        return {
            hit: true,
            normal: n,
            penetration: effectiveRadius - dist
        };
    }

    getArcCollision(ball, arc, ballRadius) {
        const P = new Vector3(ball.position.x, 0, ball.position.z);
        const nearest = this.closestPointOnArc(P.x, P.z, arc);
        const C = new Vector3(nearest.x, 0, nearest.z);

        const diff = P.clone().sub(C);
        const dist = diff.length();

        const thickness = arc.thickness ?? this.defaultThickness;
        const effectiveRadius = ballRadius + (thickness * 0.5);

        if (dist >= effectiveRadius) return { hit: false };

        let n;
        if (dist <= 1e-8) {
            const rx = P.x - arc.cx;
            const rz = P.z - arc.cz;
            const rl = Math.hypot(rx, rz);
            n = rl <= 1e-8 ? new Vector3(1, 0, 0) : new Vector3(rx / rl, 0, rz / rl);
        } else {
            n = diff.clone().multiplyScalar(1 / dist);
        }

        return {
            hit: true,
            normal: n,
            penetration: effectiveRadius - dist
        };
    }

    closestPointOnArc(px, pz, arc) {
        const dx = px - arc.cx;
        const dz = pz - arc.cz;
        const pointAngle = this.normalizeAngle(Math.atan2(dz, dx));

        const start = this.normalizeAngle(arc.startAngle);
        const end = this.normalizeAngle(arc.endAngle);

        const a = this.clampAngleToArc(pointAngle, start, end);

        return {
            x: arc.cx + Math.cos(a) * arc.radius,
            z: arc.cz + Math.sin(a) * arc.radius
        };
    }

    clampAngleToArc(angle, start, end) {
        if (this.isAngleBetween(angle, start, end)) return angle;

        const dStart = this.angularDistance(angle, start);
        const dEnd = this.angularDistance(angle, end);

        return dStart < dEnd ? start : end;
    }

    normalizeAngle(a) {
        const twoPi = Math.PI * 2;
        let v = a % twoPi;
        if (v < 0) v += twoPi;
        return v;
    }

    isAngleBetween(angle, start, end) {
        if (start <= end) return angle >= start && angle <= end;
        return angle >= start || angle <= end;
    }

    angularDistance(a, b) {
        const twoPi = Math.PI * 2;
        let d = Math.abs(a - b) % twoPi;
        if (d > Math.PI) d = twoPi - d;
        return d;
    }

    resolveCushionImpulse(ball, normal, penetration) {
        const n = normal;
        const v = new Vector3(ball.velocity.x, 0, ball.velocity.z);

        const vDotN = v.dot(n);
        if (vDotN < 0) {
            const j = -(1 + this.restitution) * vDotN;
            v.add(n.clone().multiplyScalar(j));

            ball.velocity.x = v.x;
            ball.velocity.z = v.z;
        }

        const push = Math.max(penetration, ball.radius * 0.02);
        ball.position.x += n.x * push;
        ball.position.z += n.z * push;
    }

    applyCushionFriction(ball, normal) {
        const n = normal;
        const t = new Vector3(-n.z, 0, n.x).normalize();

        const v = new Vector3(ball.velocity.x, 0, ball.velocity.z);
        const vt = v.dot(t);
        if (Math.abs(vt) < 0.0001) return;

        const mu_k = ball.mu_k ?? 0.02;
        const g = 9.81;
        const dt = 0.016;
        const reduce = mu_k * g * dt;

        const newVt = Math.sign(vt) * Math.max(0, Math.abs(vt) - reduce);
        const vn = v.dot(n);

        const out = n.clone().multiplyScalar(vn).add(t.clone().multiplyScalar(newVt));
        ball.velocity.x = out.x;
        ball.velocity.z = out.z;
    }

    transferSpinOnCushion(ball, normal) {
        const n = normal;
        const t = new Vector3(-n.z, 0, n.x).normalize();

        const spin = new Vector3(ball.angularVelocity.x, 0, ball.angularVelocity.z);
        const spinAlongTangent = spin.dot(t);
        if (Math.abs(spinAlongTangent) < 0.0001) return;

        const mu_sp = ball.mu_sp ?? 0.015;
        const transfer = spinAlongTangent * ball.radius * mu_sp;

        const v = new Vector3(ball.velocity.x, 0, ball.velocity.z);
        v.addScaledVector(t, transfer);

        ball.velocity.x = v.x;
        ball.velocity.z = v.z;

        const spinDelta = t.clone().multiplyScalar(transfer / Math.max(ball.radius, 1e-6));
        spin.sub(spinDelta);

        ball.angularVelocity.x = spin.x;
        ball.angularVelocity.z = spin.z;
    }
}