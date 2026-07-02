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
                if (A.isPocketed || B.isPocketed) continue;
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
        n.y = 0;
        return n.length() === 0 ? n.set(1,0,0) : n.normalize();
    }

    computePenetrationDepth(A, B) {
        const posA = new Vector3(A.position.x, 0, A.position.z);
        const posB = new Vector3(B.position.x, 0, B.position.z);
        const d = posB.sub(posA).length();
        return (A.radius + B.radius) - d;
    }

    separateBalls(A, B, n, overlap) {
        separateOverlappingBalls(A, B, n, overlap);
    }

    transferLinearMomentum(A, B, n) {
        const preVA = A.velocity.clone();
        const preVB = B.velocity.clone();

        resolveElasticImpulse(A, B, n, this.restitution);

        const postVA = A.velocity.clone();
        const postVB = B.velocity.clone();

        A.velocity.copy(preVA);
        B.velocity.copy(preVB);

        const deltaVA = postVA.sub(preVA);
        const deltaVB = postVB.sub(preVB);

        const impulseA = deltaVA.multiplyScalar(A.mass);
        const impulseB = deltaVB.multiplyScalar(B.mass);

        A.applyImpulse(impulseA);
        B.applyImpulse(impulseB);
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
        const invMass = (1 / mA) + (1 / mB);
        const effMass = 1 / invMass;
        const jt = -mu_sp * relT.length() * effMass;
        const impulseT = t.clone().multiplyScalar(jt);
        
        const linearImpulseA = impulseT;
        const linearImpulseB = impulseT.clone().multiplyScalar(-1);

        A.applyImpulse(linearImpulseA);
        B.applyImpulse(linearImpulseB);

        const IA = (2 / 5) * mA * rA * rA;
        const IB = (2 / 5) * mB * rB * rB;
        
        const torqueA = contactA.clone().cross(impulseT.clone().multiplyScalar(-1));
        const torqueB = contactB.clone().cross(impulseT);

        A.applyAngularImpulse(torqueA);
        B.applyAngularImpulse(torqueB);
    }
}
