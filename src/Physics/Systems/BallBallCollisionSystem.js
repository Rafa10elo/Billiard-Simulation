import { Vector3 } from '../Math/Vector3.js';
import {
    resolveElasticImpulse,
    separateOverlappingBalls
} from '../Utils/CollisionUtils.js';

export class BallBallCollisionSystem {

    constructor(config) {
        this.restitution = config.restitution;
    }

    update(balls) {
        for (let i = 0; i < balls.length; i++) {
            for (let j = i + 1; j < balls.length; j++) {

                const A = balls[i];
                const B = balls[j];

                if (!this.detectCollision(A, B)) continue;

                const n = this.computeContactNormal(A, B);
                const overlap = this.computePenetrationDepth(A, B);

                this.separateBalls(A, B, n, overlap);
                this.transferLinearMomentum(A, B, n);
                this.transferAngularMomentum(A, B, n);
            }
        }
    }

    detectCollision(A, B) {
        const d = B.position.clone().sub(A.position).length();
        return d < (A.radius + B.radius);
    }

    computeContactNormal(A, B) {
        const n = B.position.clone().sub(A.position);
        return n.length() === 0 ? n.set(1,0,0) : n.normalize();
    }

    computePenetrationDepth(A, B) {
        const d = B.position.clone().sub(A.position).length();
        return (A.radius + B.radius) - d;
    }

    separateBalls(A, B, n, overlap) {
        separateOverlappingBalls(A, B, n, overlap);
    }


    transferLinearMomentum(A, B, n) {
        resolveElasticImpulse(A, B, n, this.restitution);
    }

    transferAngularMomentum(A, B, n) {

        const rA = A.radius;
        const rB = B.radius;

        const mA = A.mass;
        const mB = B.mass;

        const vA = A.velocity.clone();
        const vB = B.velocity.clone();

        const wA = A.angularVelocity.clone();
        const wB = B.angularVelocity.clone();

        const contactA = n.clone().multiplyScalar(rA);
        const contactB = n.clone().multiplyScalar(-rB);

        const vContactA = vA.clone().add(wA.clone().cross(contactA));
        const vContactB = vB.clone().add(wB.clone().cross(contactB));

        const rel = vContactA.clone().sub(vContactB);

        const relN = n.clone().multiplyScalar(rel.dot(n));
        const relT = rel.clone().sub(relN);

        if (relT.length() < 0.0001) return;

        const t = relT.clone().normalize();

        const mu_sp = 0.015;

        const invMass = (1/mA) + (1/mB);
        const effMass = 1 / invMass;

        const jt = -mu_sp * relT.length() * effMass;

        const impulseT = t.clone().multiplyScalar(jt);

        vA.add(impulseT.clone().multiplyScalar(1/mA));
        vB.sub(impulseT.clone().multiplyScalar(1/mB));

        A.velocity.copy(vA);
        B.velocity.copy(vB);

        const IA = (2/5) * mA * rA * rA;
        const IB = (2/5) * mB * rB * rB;

        const torqueA = contactA.clone().cross(impulseT.clone().multiplyScalar(-1));
        const torqueB = contactB.clone().cross(impulseT);

        const dWA = torqueA.clone().multiplyScalar(1/IA);
        const dWB = torqueB.clone().multiplyScalar(1/IB);

        wA.add(dWA);
        wB.add(dWB);

        A.angularVelocity.copy(wA);
        B.angularVelocity.copy(wB);
    }
}
