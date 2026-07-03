import { Vector3 } from '../Math/Vector3.js';

export class CushionCollisionSystem {
    constructor(config, tablePhysics, scene) {
        this.restitution = config.restitution ?? 0.85;
        this.friction = config.friction ?? 0.2;
        this.tablePhysics = tablePhysics;
        this.scene = scene;
        this.defaultThickness = 0.02;
        this.epsilon = 1e-4;
        this.debugCollision = config.debugCollision ?? true;
        this.debugBallId = config.debugBallId ?? null;

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

                if (Math.abs(ball.position.y - cushionY) > r + 0.01) continue;

                const collision = this.getLineCollision(ball, cushion, r, cushionY);
                if (!collision.hit) continue;

                this.logCollisionHit(ball, cushion, index, collision);
                this.resolveCushionImpulse(ball, collision.normal, collision.penetration);
                this.applyCushionFriction(ball, collision.normal);
                this.transferSpinOnCushion(ball, collision.normal);
            }
        }
    }

    getLineCollision(ball, cushion, ballRadius, cushionY) {
        const A = new Vector3(cushion.x1, cushionY, cushion.z1);
        const B = new Vector3(cushion.x2, cushionY, cushion.z2);
        const P = new Vector3(ball.position.x, cushionY, ball.position.z);

        const AB = B.clone().sub(A);
        const ab2 = AB.dot(AB);
        if (ab2 <= 1e-12) return { hit: false };

        const thickness = cushion.thickness ?? this.defaultThickness;
        const borderRadius = cushion.borderRadius ?? 0;
        const bodyRadius = thickness * 0.5;
        const capsuleRadius = bodyRadius + borderRadius;

        const tRaw = P.clone().sub(A).dot(AB) / ab2;

        if (tRaw < 0 || tRaw > 1) {
            const edgePoint = tRaw < 0 ? A : B;
            const toEdge = P.clone().sub(edgePoint);
            const dist = toEdge.length();
            const effR = ballRadius + capsuleRadius;
            if (dist >= effR) return { hit: false };

            let n = dist > 1e-10
                ? toEdge.multiplyScalar(1 / dist)
                : new Vector3(-AB.z, 0, AB.x).normalize();

            if (ball.velocity.dot(n) > 0) n.multiplyScalar(-1);

            return {
                hit: true,
                normal: n,
                penetration: Math.max(0, effR - dist) + this.epsilon,
                debug: { type: 'line-cap', dist, effR }
            };
        }

        const t = Math.max(0, Math.min(1, tRaw));
        const closest = A.clone().addScaledVector(AB, t);
        const PC = P.clone().sub(closest);
        const dist = PC.length();
        const effR = ballRadius + bodyRadius;
        if (dist >= effR) return { hit: false };

        let n = dist > 1e-10 ? PC.clone().multiplyScalar(1 / dist) : new Vector3(-AB.z, 0, AB.x).normalize();

        if (ball.velocity.dot(n) > 0) n.multiplyScalar(-1);

        return {
            hit: true,
            normal: n,
            penetration: Math.max(0, effR - dist) + this.epsilon,
            debug: { type: 'line', dist, effR }
        };
    }

    resolveCushionImpulse(ball, normal, penetration) {
        const n = normal;
        const v = ball.velocity.clone();
        const vDotN = v.dot(n);

        if (vDotN < 0) {
            const j = -(1 + this.restitution) * vDotN;
            const deltaV = n.clone().multiplyScalar(j);
            const impulse = deltaV.multiplyScalar(ball.mass);
            ball.applyImpulse(impulse);
        }

        const push = Math.max(0, penetration) + this.epsilon;
        ball.position.x += n.x * push;
        ball.position.z += n.z * push;
    }

    applyCushionFriction(ball, normal) {
        const n = normal;
        const t = new Vector3(-n.z, 0, n.x).normalize();
        const v = ball.velocity.clone();
        const vt = v.dot(t);

        if (Math.abs(vt) < 1e-5) return;

        const mu_k = ball.mu_k ?? 0.02;
        const reduce = mu_k * 9.81 * 0.016;

        const newVt = Math.sign(vt) * Math.max(0, Math.abs(vt) - reduce);
        const vn = v.dot(n);
        const postV = n.clone().multiplyScalar(vn).addScaledVector(t, newVt);
        const deltaV = postV.sub(v);
        const impulse = deltaV.multiplyScalar(ball.mass);

        ball.applyImpulse(impulse);
    }

    transferSpinOnCushion(ball, normal) {
        const n = normal;
        const t = new Vector3(-n.z, 0, n.x).normalize();
        const v = ball.velocity.clone();

        const vContactT = v.dot(t) - ball.radius * ball.angularVelocity.y;
        if (Math.abs(vContactT) < 1e-5) return;

        const mu_sp = ball.mu_sp ?? 0.015;
        const jt = -vContactT * mu_sp;

        const impulseL = t.clone().multiplyScalar(jt);
        ball.applyImpulse(impulseL);

        const I = 0.4 * ball.mass * ball.radius * ball.radius;
        if (I > 1e-12) {
            const deltaWy = -(jt * ball.radius) / I;
            const torque = new Vector3(0, deltaWy * I, 0);
            ball.applyAngularImpulse(torque);
        }
    }

    createPhysicalDebugMeshes() {
        import('three').then((THREE) => {
            const cushions = this.tablePhysics.cushions;
            const defaultHeight = 0.08;
            const mat = new THREE.MeshPhongMaterial({color: 0x00ff00,transparent: true,opacity: 0.5,side: THREE.DoubleSide});

            cushions.forEach(c => {
                const y = c.y ?? this.tablePhysics.surfaceY;

                const thickness = c.thickness ?? this.defaultThickness;
                const height = c.height ?? defaultHeight;
                const capRadius = (thickness * 0.5) + (c.borderRadius ?? 0);

                const A = new THREE.Vector3(c.x1, y, c.z1);
                const B = new THREE.Vector3(c.x2, y, c.z2);
                const dir = B.clone().sub(A);
                const length = dir.length();
                if (length <= 1e-12) return;

                const boxGeo = new THREE.BoxGeometry(length, height, capRadius * 2);
                const boxMesh = new THREE.Mesh(boxGeo, mat);
                const mid = A.clone().add(B).multiplyScalar(0.5);
                boxMesh.position.set(mid.x, y - (height * 0.5), mid.z);
                boxMesh.rotation.y = -Math.atan2(dir.z, dir.x);
                this.scene.add(boxMesh);

                const cylGeo = new THREE.CylinderGeometry(capRadius, capRadius, height, 24);

                const capA = new THREE.Mesh(cylGeo, mat);
                capA.position.set(A.x, y - (height * 0.5), A.z);
                this.scene.add(capA);

                const capB = new THREE.Mesh(cylGeo, mat);
                capB.position.set(B.x, y - (height * 0.5), B.z);
                this.scene.add(capB);
            });
        });
    }

    logCollisionHit(ball, cushion, index, collision) {
        if (!this.debugCollision) return;
        if (this.debugBallId != null && ball.id !== this.debugBallId) return;
        const d = collision.debug ?? {};
        console.log(`[CUSHION HIT] ball=${ball.id} type=${cushion.type ?? 'line'} idx=${index} n=(${collision.normal.x.toFixed(3)},${collision.normal.z.toFixed(3)}) pen=${collision.penetration.toFixed(5)} dbg=${d.type ?? 'n/a'}`);
    }
}