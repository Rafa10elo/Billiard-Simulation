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
                const cushionY = cushion.type === 'arc'
                    ? (cushion.cy ?? this.tablePhysics.surfaceY)
                    : (cushion.y ?? this.tablePhysics.surfaceY);

                if (Math.abs(ball.position.y - cushionY) > r + 0.01) continue;

                const collision = cushion.type === 'arc'
                    ? this.getArcCollision(ball, cushion, r, cushionY)
                    : this.getLineCollision(ball, cushion, r, cushionY);

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

        let tRaw = P.clone().sub(A).dot(AB) / ab2;

        if (tRaw < 0 || tRaw > 1) {
            const edgePoint = tRaw < 0 ? A : B;
            const toEdge = P.clone().sub(edgePoint);
            const dist = toEdge.length();
            const effR = ballRadius + capsuleRadius;
            if (dist >= effR) return { hit: false };

            let n = dist > 1e-10 ? toEdge.multiplyScalar(1 / dist) : new Vector3(-AB.z, 0, AB.x).normalize();
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

        getArcCollision(ball, arc, ballRadius, arcY) {
        const P = new Vector3(ball.position.x, arcY, ball.position.z);
        const dx = P.x - arc.cx;
        const dz = P.z - arc.cz;
        const distCenter = Math.hypot(dx, dz);
        if (distCenter <= 1e-12) return { hit: false };

        const start = this.normalizeAngle(arc.startAngle);
        const end = this.normalizeAngle(arc.endAngle);
        const sweep = this.ccwSweep(start, end);

        const pAng = this.normalizeAngle(Math.atan2(dz, dx));
        const inSpan = this.angleInCCWSpan(pAng, start, sweep);

        if (inSpan) {
            const thickness = arc.thickness ?? 0.04;
            const halfT = thickness * 0.5;
            const innerR = arc.radius - halfT;
            const outerR = arc.radius + halfT;

            const minD = innerR - ballRadius;
            const maxD = outerR + ballRadius;

            if (distCenter >= minD && distCenter <= maxD) {
                const radialOut = new Vector3(dx / distCenter, 0, dz / distCenter);
                const penOuter = maxD - distCenter;
                const penInner = distCenter - minD;

                let n, pen;
                if (penOuter < penInner) {
                    n = radialOut.clone();
                    pen = penOuter;
                } else {
                    n = radialOut.clone().multiplyScalar(-1);
                    pen = penInner;
                }

                return {
                    hit: true,
                    normal: n.normalize(),
                    penetration: Math.max(0, pen) + this.epsilon,
                    debug: { type: 'arc-band-solid', distCenter, innerR, outerR }
                };
            }
        }

        const dStart = this.angularDistance(pAng, start);
        const dEnd = this.angularDistance(pAng, end);
        const edgeAngle = dStart <= dEnd ? start : end;

        const edgePoint = new Vector3(
            arc.cx + Math.cos(edgeAngle) * arc.radius,
            arcY,
            arc.cz + Math.sin(edgeAngle) * arc.radius
        );

        const toBall = P.clone().sub(edgePoint);
        const distToEdge = toBall.length();

        if (distToEdge < ballRadius) {
            let n = distToEdge > 1e-10 ? toBall.normalize() : new Vector3(Math.cos(edgeAngle), 0, Math.sin(edgeAngle));
            
            return {
                hit: true,
                normal: n,
                penetration: (ballRadius - distToEdge) + this.epsilon,
                debug: { type: 'arc-edge-solid', distToEdge }
            };
        }

        return { hit: false };
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
            const height = 0.08;
            const mat = new THREE.MeshPhongMaterial({ color: 0x00ff00, transparent: true, opacity: 0.5, side: THREE.DoubleSide });

            cushions.forEach(c => {
                const y = c.y ?? (c.cy ?? 0.8);
                if (c.type === 'line') {
                    const thickness = c.thickness ?? this.defaultThickness;
                    const capRadius = (thickness * 0.5) + (c.borderRadius ?? 0);

                    const A = new THREE.Vector3(c.x1, y, c.z1);
                    const B = new THREE.Vector3(c.x2, y, c.z2);
                    const dir = B.clone().sub(A);
                    const length = dir.length();

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

                } else if (c.type === 'arc') {
                    const thickness = c.thickness ?? this.defaultThickness;
                    const cushionRadius = thickness * 0.5;
                    const innerR = c.radius - cushionRadius;
                    const outerR = c.radius + cushionRadius;

                    const start = this.normalizeAngle(c.startAngle);
                    const end = this.normalizeAngle(c.endAngle);
                    const sweep = this.ccwSweep(start, end);

                    const shape = new THREE.Shape();
                    const outerPts = [];
                    const innerPts = [];
                    const seg = 64;

                    for (let i = 0; i <= seg; i++) {
                        const a = start + (sweep * i) / seg;
                        outerPts.push(new THREE.Vector2(Math.cos(a) * outerR, Math.sin(a) * outerR));
                    }
                    for (let i = seg; i >= 0; i--) {
                        const a = start + (sweep * i) / seg;
                        innerPts.push(new THREE.Vector2(Math.cos(a) * innerR, Math.sin(a) * innerR));
                    }

                    shape.moveTo(outerPts[0].x, outerPts[0].y);
                    for (let i = 1; i < outerPts.length; i++) shape.lineTo(outerPts[i].x, outerPts[i].y);
                    for (let i = 0; i < innerPts.length; i++) shape.lineTo(innerPts[i].x, innerPts[i].y);
                    shape.closePath();

                    const extrudeSettings = { depth: height, bevelEnabled: false };
                    const arcGeo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
                    const arcMesh = new THREE.Mesh(arcGeo, mat);
                    arcMesh.rotation.x = -Math.PI * 0.5;
                    arcMesh.position.set(c.cx, y, c.cz);
                    this.scene.add(arcMesh);
                }
            });
        });
    }

    normalizeAngle(a) {
        const twoPi = Math.PI * 2;
        let v = a % twoPi;
        if (v < 0) v += twoPi;
        return v;
    }

    ccwSweep(start, end) {
        const twoPi = Math.PI * 2;
        let s = end - start;
        s = ((s % twoPi) + twoPi) % twoPi;
        return s;
    }

    angleInCCWSpan(angle, start, sweep) {
        const rel = this.ccwSweep(start, angle);
        return rel <= sweep + 1e-8;
    }

    angularDistance(a, b) {
        const twoPi = Math.PI * 2;
        let d = Math.abs(a - b) % twoPi;
        if (d > Math.PI) d = twoPi - d;
        return d;
    }

    logCollisionHit(ball, cushion, index, collision) {
        if (!this.debugCollision) return;
        if (this.debugBallId != null && ball.id !== this.debugBallId) return;
        const d = collision.debug ?? {};
        console.log(`[CUSHION HIT] ball=${ball.id} type=${cushion.type} idx=${index} n=(${collision.normal.x.toFixed(3)},${collision.normal.z.toFixed(3)}) pen=${collision.penetration.toFixed(5)} dbg=${d.type ?? 'n/a'}`);
    }
}