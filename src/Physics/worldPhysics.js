import * as THREE from 'three';

export class WorldPhysics {
    constructor(gravity ,friction , surfaceY) {
        this.gravity = gravity;
        this.friction= friction;
        this.surfaceY = surfaceY;
    }
    addgravity(balls, deltaTime){
        balls.forEach((ball) => {
            //gravity if the ball is in the air else apply friction
            if (ball.position.y > this.surfaceY){
                ball.acceleration.y = -this.gravity;
            } else {
                ball.acceleration.y = 0;
                ball.velocity.y = 0;
                ball.position.y = this.surfaceY;
            }
            //v=v+a*dt
            ball.velocity.addScaledVector(ball.acceleration, deltaTime);
            if (ball.position.y == this.surfaceY){
                ball.velocity.multiplyScalar(this.friction);
            }
            //p=p+v*dt
            ball.position.addScaledVector(ball.velocity, deltaTime);
            ball.syncMesh();
        });
    }
}