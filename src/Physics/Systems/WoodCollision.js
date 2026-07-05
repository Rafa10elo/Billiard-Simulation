import { Vector3 } from '../Math/Vector3.js';

export class WoodCollisionSystem {
    constructor(config, tablePhysics) {
        this.restitution = config.restitutionWood ?? 0.45;
        this.friction = config.frictionWood ?? 0.3;
        this.tablePhysics = tablePhysics;

        this.defaultThickness = 0.11;
        this.defaultHeight = 0.08;
        this.epsilon = 1e-5;
    }

    update(balls) {
        const woods = this.tablePhysics.woods ?? [];

        for (const ball of balls) {
            if (ball.isPocketed || ball.inPocketTunnel) continue;

            for (let i = 0; i < woods.length; i++) {
                const wood = woods[i];
                const collision = this.get3DWoodCollision(ball, wood, ball.radius);

                if (!collision.hit) continue;

                this.resolveWoodImpulse(ball, collision.normal, collision.penetration);
                this.resolveFrictionAndSpin(ball, collision.normal, collision.contactPoint);
            }
        }
    }

    get3DWoodCollision(ball, seg, ballRadius) {
        const A = new Vector3(seg.x1, seg.y, seg.z1);
        const B = new Vector3(seg.x2, seg.y, seg.z2);

        const AB = B.clone().sub(A);
        const length = AB.length();
        if (length < 1e-10) return { hit: false };

        const uX = AB.x / length;
        const uZ = AB.z / length;

        const nX = -uZ; 
        const nZ =  uX;

        const halfLength = length * 0.5;
        const halfThickness = (seg.thickness ?? this.defaultThickness) * 0.5;
        const halfHeight = (seg.height ?? this.defaultHeight) * 0.5;

        const centerX = (seg.x1 + seg.x2) * 0.5;
        const centerY = seg.y;
        const centerZ = (seg.z1 + seg.z2) * 0.5;

        const dX = ball.position.x - centerX;
        const dY = ball.position.y - centerY;
        const dZ = ball.position.z - centerZ;

        const localX = dX * uX + dZ * uZ; 
        const localY = dY;                
        const localZ = dX * nX + dZ * nZ; 

        if (Math.abs(localX) > halfLength + ballRadius ||
            Math.abs(localY) > halfHeight + ballRadius ||
            Math.abs(localZ) > halfThickness + ballRadius) {
            return { hit: false };
        }

        const clampedX = Math.max(-halfLength, Math.min(halfLength, localX));
        const clampedY = Math.max(-halfHeight, Math.min(halfHeight, localY));
        const clampedZ = Math.max(-halfThickness, Math.min(halfThickness, localZ));

        const closest = new Vector3(
            centerX + clampedX * uX + clampedZ * nX,
            centerY + clampedY,
            centerZ + clampedX * uZ + clampedZ * nZ
        );

        const toBall = ball.position.clone().sub(closest);
        const dist = toBall.length();

        if (dist > ballRadius) return { hit: false };

        let normal;
        if (dist > this.epsilon) {
            normal = toBall.multiplyScalar(1 / dist);
        } else {

            const dxFace = halfLength - Math.abs(localX);
            const dyFace = halfHeight - Math.abs(localY);
            const dzFace = halfThickness - Math.abs(localZ);

            if (dxFace <= dyFace && dxFace <= dzFace) {
                const s = Math.sign(localX) || 1;
                normal = new Vector3(uX * s, 0, uZ * s);
            } else if (dyFace <= dxFace && dyFace <= dzFace) {
                const s = Math.sign(localY) || 1;
                normal = new Vector3(0, s, 0);
            } else {
                const s = Math.sign(localZ) || 1;
                normal = new Vector3(nX * s, 0, nZ * s);
            }
        }

        if (ball.velocity.dot(normal) > 0) {
            normal.multiplyScalar(-1);
        }

        return {
            hit: true,
            normal,
            penetration: Math.max(0, ballRadius - dist) + this.epsilon,
            contactPoint: closest
        };
    }

    resolveWoodImpulse(ball, normal, penetration) {
        const vDotN = ball.velocity.dot(normal);

        if (vDotN < 0) {
            const j = -(1 + this.restitution) * vDotN;
            const impulse = normal.clone().multiplyScalar(j * ball.mass);
            ball.applyImpulse(impulse);
        }

    
        ball.position.addScaledVector(normal, penetration);
    }

    resolveFrictionAndSpin(ball, normal, contactPoint) {
        const r = contactPoint.clone().sub(ball.position);
        const vContact = ball.velocity.clone().add(ball.angularVelocity.clone().cross(r));

        const vN = vContact.dot(normal);
        const vT = vContact.clone().sub(normal.clone().multiplyScalar(vN));
        const tLen = vT.length();
        if (tLen < 1e-6) return;

        const t = vT.multiplyScalar(1 / tLen);

        const rn = r.clone().cross(t);
        const invEffMassT = (1 / ball.mass) + rn.dot(rn) * (2.5 / (ball.mass * ball.radius * ball.radius));

        let jt = -vContact.dot(t) / invEffMassT;


        const jnApprox = Math.abs(vN) * ball.mass;
        const maxJt = this.friction * Math.max(jnApprox, 1e-6);
        if (Math.abs(jt) > maxJt) jt = Math.sign(jt) * maxJt;

        const impulseT = t.clone().multiplyScalar(jt);
        ball.applyImpulse(impulseT);

        const torque = r.clone().cross(impulseT);
        ball.applyAngularImpulse(torque);
    }
}