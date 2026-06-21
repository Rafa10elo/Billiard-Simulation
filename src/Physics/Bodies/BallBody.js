import {Vector3} from '../Math/Vector3.js';

export class BallBody{

    constructor(data){

        this.id = data.id;
        this.isCue = data.isCue;

        this.position = new Vector3(
            data.startPos.x,
            data.startPos.y,
            data.startPos.z
        );

        this.velocity = new Vector3();

        this.acceleration = new Vector3();

        this.angularVelocity = new Vector3();

        this.angularAcceleration = new Vector3();

        this.radius = 0.04;

        this.mass = 0.1;

        this.mu_k = 0.2;
        this.mu_r = 0.01;
        this.mu_sp = 0.02;
    }

}