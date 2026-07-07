import { Vector3 } from '../Math/Vector3.js';

export class CushionCollisionSystem {
   constructor(config, tablePhysics, scene) {

    this.restitution = config.cushionRestitution ?? 0.85;
    this.friction = config.friction ?? 0.2;
    this.tablePhysics = tablePhysics;
    this.scene = scene;

    this.defaultThickness = 0.02;
    this.defaultHeight = 0.05;
    this.epsilon = 1e-4;

    this.debugCollision = config.debugCollision ?? true;
    this.debugBallId = config.debugBallId ?? null;

    this.generatePocketCushions();

    if (this.scene) {
        this.createPhysicalDebugMeshes();
    }
}

    update(balls) {
        const cushions = this.tablePhysics.cushions;

        for (const ball of balls) {
            if (ball.isPocketed || ball.inPocketTunnel) continue;
            const r = ball.radius;

            for (let index = 0; index < cushions.length; index++) {
                const cushion = cushions[index];
                const cushionY = cushion.y ?? this.tablePhysics.surfaceY;
                const height = cushion.height ?? this.defaultHeight;

                const collision = this.get3DBoxCollision(ball, cushion, r, cushionY, height);
                if (!collision.hit) continue;

                this.logCollisionHit(ball, cushion, index, collision);
                this.resolveCushionImpulse(ball, collision.normal, collision.penetration);
                this.resolveCushionFrictionAndSpin(ball, collision.normal, collision.contactPoint);
            }
        }
    }

    get3DBoxCollision(ball, cushion, ballRadius, cushionY, height) {

    const A = new Vector3(cushion.x1, cushionY, cushion.z1);
    const B = new Vector3(cushion.x2, cushionY, cushion.z2);

    const AB = B.clone().sub(A);
    const length = AB.length();
    if (length <= 1e-12) return { hit: false };

    const uX = AB.x / length;
    const uZ = AB.z / length;

    const nX = -uZ;
    const nZ =  uX;

    const thickness = cushion.thickness ?? this.defaultThickness;
    const halfThickness = thickness * 0.5;

    const topY = cushionY + height;
    const bottomY = cushionY;
    const halfHeight = height * 0.5;
    const midY = cushionY + halfHeight;

    const midWorldX = A.x + uX * length * 0.5;
    const midWorldZ = A.z + uZ * length * 0.5;

    const deltaWorldX = ball.position.x - midWorldX;
    const deltaWorldZ = ball.position.z - midWorldZ;

    const localX = deltaWorldX * uX + deltaWorldZ * uZ;
    const localY = ball.position.y - midY;
    const localZ = deltaWorldX * nX + deltaWorldZ * nZ;

    const halfLength = length * 0.5;

    if (
        Math.abs(localX) > halfLength + ballRadius ||
        Math.abs(localY) > halfHeight + ballRadius ||
        Math.abs(localZ) > halfThickness + ballRadius
    ) {
        return { hit: false };
    }

    const clampedX = Math.max(-halfLength, Math.min(halfLength, localX));
    const clampedY = Math.max(-halfHeight, Math.min(halfHeight, localY));
    const clampedZ = Math.max(-halfThickness, Math.min(halfThickness, localZ));

    const closestPoint = new Vector3(
        midWorldX + clampedX * uX + clampedZ * nX,
        midY + clampedY,
        midWorldZ + clampedX * uZ + clampedZ * nZ
    );

    const toBall = ball.position.clone().sub(closestPoint);
    const dist = toBall.length();

    if (dist >= ballRadius || dist === 0) {
        return { hit: false };
    }

    const normal = toBall.normalize();

    if (ball.velocity.dot(normal) > 0) {
        normal.multiplyScalar(-1);
    }

    return {
        hit: true,
        normal,
        penetration: ballRadius - dist + this.epsilon,
        contactPoint: closestPoint
    };
}

    resolveCushionImpulse(ball, normal, penetration) {
        const vDotN = ball.velocity.dot(normal);

        if (vDotN < 0) {
            const j = -(1 + this.restitution) * vDotN;
            const impulse = normal.clone().multiplyScalar(j * ball.mass);
            ball.applyImpulse(impulse);
        }

        const push = Math.max(0, penetration) + this.epsilon;
        ball.position.addScaledVector(normal, push);
    }

    resolveCushionFrictionAndSpin(ball, normal, contactPoint) {
        const r = contactPoint.clone().sub(ball.position);

        const vContact = ball.velocity.clone().add(ball.angularVelocity.clone().cross(r));
        
        const vContactN = vContact.dot(normal);
        const vContactT = vContact.clone().sub(normal.clone().multiplyScalar(vContactN));
        const tLength = vContactT.length();

        if (tLength < 1e-5) return;

        const t = vContactT.clone().normalize();

        const rn = r.clone().cross(t);
        const angularComponent = rn.dot(rn) * (2.5 / (ball.mass * ball.radius * ball.radius));
        const invEffMassT = (1 / ball.mass) + angularComponent;

        let jt = -vContactT.dot(t) / invEffMassT;

        const vDotN = ball.velocity.dot(normal);
        const jn = Math.abs(vDotN * ball.mass) || (ball.mass * 9.81 * 0.016);
        const maxJt = this.friction * jn;

        if (Math.abs(jt) > maxJt) {
            jt = Math.sign(jt) * maxJt;
        }

        const impulseT = t.clone().multiplyScalar(jt);
        ball.applyImpulse(impulseT);

        const torque = r.clone().cross(impulseT);
        ball.applyAngularImpulse(torque);
    }

  

    logCollisionHit(ball, cushion, index, collision) {
        if (!this.debugCollision) return;
        if (this.debugBallId != null && ball.id !== this.debugBallId) return;
        console.log(`[CUSHION HIT 3D] ball=${ball.id} idx=${index} n=(${collision.normal.x.toFixed(3)},${collision.normal.y.toFixed(3)},${collision.normal.z.toFixed(3)}) pen=${collision.penetration.toFixed(5)}`);
    }


generatePocketCushions() {
    const y = 0.71;
    const thickness = 0.04;
    const height = 0.1;

    const segments = 10;
    const newCushions = [];

    const offsets = [
        45 * Math.PI/180,
        0,
        -45 * Math.PI/180,
        -135 * Math.PI/180,
        Math.PI,
        135 * Math.PI/180
    ];

   this.tablePhysics.pockets.forEach((pocket, index) => {
        const cx = pocket.x;
        const cz = pocket.z;
        const r  = pocket.radius * 1.5 ;

        const baseOffset = offsets[index];

        const angles = [];

        for (let i = 0; i <= segments; i++) {
            const t = -Math.PI / 2 + (Math.PI / segments) * i;
            angles.push(baseOffset + t);
        }

        for (let i = 0; i < segments; i++) {
            const a1 = angles[i];
            const a2 = angles[i + 1];

            newCushions.push({
                type: "line",
                y,
                x1: cx + Math.cos(a1) * r,
                z1: cz + Math.sin(a1) * r,
                x2: cx + Math.cos(a2) * r,
                z2: cz + Math.sin(a2) * r,
                thickness,
                height
            });
        }
    });

this.tablePhysics.cushions.push(...newCushions);}


}
