import { Vector3 } from '../Math/Vector3.js';
import { separateOverlappingBalls } from '../Utils/CollisionUtils.js';

export class BallBallCollisionSystem {
    constructor(config) {
        this.restitution = config.restitution;
        this.mu_sp =  config.mu_sp; 
    }

    update(balls) {
        for (let i = 0; i < balls.length; i++) {
            for (let j = i + 1; j < balls.length; j++) {
                const A = balls[i];
                const B = balls[j];
                if (A.isPocketed || B.isPocketed) continue;
                
                const deltaPos = B.position.clone().sub(A.position);
                const distance = deltaPos.length();
                const minDistance = A.radius + B.radius;
                
                if (distance >= minDistance || distance === 0) continue;

                const n = deltaPos.normalize();
                
                separateOverlappingBalls(A, B, n, minDistance - distance);

                this.resolveCollision3D(A, B, n);
            }
        }
    }

    resolveCollision3D(A, B, n) {
    const vRelLinear = A.velocity.clone().sub(B.velocity);
    const vRelN = vRelLinear.dot(n);
    if (vRelN <= 0) return;

    const invEffMassN = (1 / A.mass) + (1 / B.mass);
    const jn = (1 + this.restitution) * vRelN / invEffMassN;
    const impulseN = n.clone().multiplyScalar(jn);

    A.applyImpulse(impulseN.clone().multiplyScalar(-1));
    B.applyImpulse(impulseN);

    const rA = n.clone().multiplyScalar(A.radius);
    const rB = n.clone().multiplyScalar(-B.radius);

    const vContactA = A.velocity.clone().add(A.angularVelocity.clone().cross(rA));
    const vContactB = B.velocity.clone().add(B.angularVelocity.clone().cross(rB));
    const vRelContact = vContactA.sub(vContactB);

    const vRelT = vRelContact.clone().sub(n.clone().multiplyScalar(vRelContact.dot(n)));
    const tLength = vRelT.length();

    if (tLength > 1e-4) {
        const t = vRelT.clone().normalize();
        
        const invEffMassT = (1 / A.mass) + (1 / B.mass) + 
                            (2.5 / A.mass) + (2.5 / B.mass);
        
        let jt = -vRelContact.dot(t) / invEffMassT;
        const maxJt = this.mu_sp * jn;
        
        if (Math.abs(jt) > maxJt) {
            jt = Math.sign(jt) * maxJt;
        }

        const impulseT = t.clone().multiplyScalar(jt);

        A.applyImpulse(impulseT);
        B.applyImpulse(impulseT.clone().multiplyScalar(-1));

        const torqueA = rA.clone().cross(impulseT);
        const torqueB = rB.clone().cross(impulseT.clone().multiplyScalar(-1));

        A.applyAngularImpulse(torqueA);
        B.applyAngularImpulse(torqueB);
    }
}

}
