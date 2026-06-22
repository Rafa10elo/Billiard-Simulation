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

        this.mass = 0.1;

        this.mu_k = 0.2;
        this.mu_r = 0.01;
        this.mu_sp = 0.02;
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
    }

    applyImpulse(impulse) {
    }

    applyAngularImpulse(impulse) {
    }

    clearForces() {
    }

    integrateRotation(dt) {
    }

    transferEnergyTo(otherBall, collisionData) {
    }

}