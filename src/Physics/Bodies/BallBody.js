import { Vector3 } from '../Math/Vector3.js';
import { Quaternion } from '../Math/Quaternion.js';

export class BallBody{

    constructor(data){

        this.id = data.id;
        this.isCue = data.isCue;

        this.position = new Vector3(
            data.startPos.x,
            data.startPos.y,
            data.startPos.z
        );

        this.velocity = new Vector3(0, 0, 0);

        this.acceleration = new Vector3(0, 0, 0);

        this.angularVelocity = new Vector3(0, 0, 0);

        this.angularAcceleration = new Vector3(0, 0, 0);

        this.rotation = new Quaternion();

        this.radius = 0.04;

        this.mass = 0.5;

        this.mu_k = 0.1;
        this.mu_r = 0.01;
        this.mu_sp = 0.1;
        this.restitution = 0.6;

        this.isPocketed=false;
        this.isActive=true;
    }

    toSnapshot() {
        return {
            id: this.id,
            isCue: this.isCue,
            position: {
                x: this.position.x,
                y: this.position.y,
                z: this.position.z
            },
            rotation: this.rotation.toObject()
        };
    }

    applyForce(force) {
        this.acceleration.x += force.x / this.mass;
        this.acceleration.y += force.y / this.mass;
        this.acceleration.z += force.z / this.mass;
    }

    applyImpulse(impulse) {
        this.velocity.x += impulse.x / this.mass;
        this.velocity.y += impulse.y / this.mass;
        this.velocity.z += impulse.z / this.mass;
    }   

    applyAngularImpulse(impulse) {
        const I = (2 / 5) * this.mass * this.radius * this.radius;
        this.angularVelocity.x += impulse.x / I;
        this.angularVelocity.y += impulse.y / I;
        this.angularVelocity.z += impulse.z / I;
    }

    clearForces() {
        this.acceleration.set(0, 0, 0);
        this.angularAcceleration.set(0, 0, 0);
    }

    integrateRotation(dt) {
        const wx = this.angularVelocity.x;
        const wy = this.angularVelocity.y;
        const wz = this.angularVelocity.z;

        const speed = Math.sqrt(wx * wx + wy * wy + wz * wz);
        if (speed < 0.0001) return;

        const angle = speed * dt;
        const s = Math.sin(angle / 2);

        const delta = new Quaternion(
          (wx / speed) * s,
            (wy / speed) * s,
            (wz / speed) * s,
            Math.cos(angle / 2)
        );

        this.rotation.copy(delta.multiply(this.rotation.clone())).normalize();
    }

    

}