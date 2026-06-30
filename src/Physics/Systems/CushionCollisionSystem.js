import { Vector3 } from '../Math/Vector3.js';
export class CushionCollisionSystem {

    constructor(config, tablePhysics) {
        this.restitution = config.restitution;
        this.tablePhysics = tablePhysics;
    }

    update(balls) {
        const cushions = this.tablePhysics.cushions;

        balls.forEach(ball => {
            
            const r = ball.radius;

            cushions.forEach(c => {
                const dist = this.distancePointToSegment(
                    ball.position.x,
                    ball.position.z,
                    c.x1, c.z1,
                    c.x2, c.z2
                );

                if (dist < r) {
                    this.resolveCushionImpulse(ball, c);
                    this.applyCushionFriction(ball, c);
                    this.transferSpinOnCushion(ball, c);
                }
            });
        });
    }

    distancePointToSegment(px, pz, x1, z1, x2, z2) {
        const A = new Vector3(x1, 0, z1);
        const B = new Vector3(x2, 0, z2);
        const P = new Vector3(px, 0, pz);

        const v = B.clone().sub(A);  
        const w = P.clone().sub(A);  

        const c1 = w.dot(v);
        const c2 = v.dot(v);

        let t = c1 / c2;
        t = Math.max(0, Math.min(1, t));

        const C = A.clone().addScaledVector(v, t); 
        return P.clone().sub(C).length();
    }


    resolveCushionImpulse(ball, cushion) {
       const n = this.computeCushionNormal(cushion,ball);
        const v = new Vector3(ball.velocity.x, 0, ball.velocity.z);

        const vDotN = v.dot(n);
        if (vDotN >= 0) return;

        
    const j = -(1 + this.restitution) * vDotN;
    const impulse = n.clone().multiplyScalar(j);

    v.add(impulse); // NOT sub

        ball.velocity.x = v.x;
        ball.velocity.z = v.z;

        ball.position.x += n.x * (ball.radius * 0.01);
        ball.position.z += n.z * (ball.radius * 0.01);
    }



    applyCushionFriction(ball, cushion) {
        const v = new Vector3(ball.velocity.x, 0, ball.velocity.z);
        const speed = v.length();
        if (speed < 0.0001) return;

        const dir = v.clone().normalize();

        const mu_k = ball.mu_k ?? 0.02;
        const mass = ball.mass ?? 0.17;
        const frictionMag = mu_k * 9.81 * mass;

        const frictionImpulse = dir.clone().multiplyScalar(frictionMag * 0.016);
        v.sub(frictionImpulse);

        ball.velocity.x = v.x;
        ball.velocity.z = v.z;
    }



    transferSpinOnCushion(ball, cushion) {
       const n = this.computeCushionNormal(cushion,ball); 
        const t = new Vector3(-n.z, 0, n.x);
        
        const spin = new Vector3(ball.angularVelocity.x, 0, ball.angularVelocity.z);
        const spinAlongTangent = spin.dot(t);

        if (Math.abs(spinAlongTangent) < 0.0001) return;

        const mu_sp = ball.mu_sp ?? 0.015;
        const transfer = spinAlongTangent * ball.radius * mu_sp;

        const v = new Vector3(ball.velocity.x, 0, ball.velocity.z);
        v.addScaledVector(t, transfer);

        ball.velocity.x = v.x;
        ball.velocity.z = v.z;

        const spinDelta = t.clone().multiplyScalar(transfer / ball.radius);
        spin.sub(spinDelta);

        ball.angularVelocity.x = spin.x;
        ball.angularVelocity.z = spin.z;
    }

    
    computeCushionNormal(cushion, ball) {
        const A = new Vector3(cushion.x1, 0, cushion.z1);
        const B = new Vector3(cushion.x2, 0, cushion.z2);

        const dir = B.clone().sub(A).normalize();
        let n = new Vector3(-dir.z, 0, dir.x).normalize();

        const toBall = new Vector3(ball.position.x - A.x, 0, ball.position.z - A.z);

        if (n.dot(toBall) < 0) {
            n.multiplyScalar(-1);
        }

        return n;
    }

}
