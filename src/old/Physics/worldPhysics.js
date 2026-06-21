import * as THREE from 'three';

export class WorldPhysics {
    constructor(gravity  , surfaceY) {
        this.gravity = gravity;
        this.surfaceY = surfaceY;
    }
    updateWorld(balls,dt){
        balls.forEach((ball) =>{
            if (this.inAir(ball)){    
                this.applyAirKinematics(ball, dt);
            }else {
                this.applyTableKinematics(ball , dt)
            }
            ball.update(dt);
        });
    }
    inAir(ball) {
        return ball.position.y > (this.surfaceY +0.001);
    }
    applyAirKinematics(ball,dt){
        ball.acceleration.set(0,this.gravity,0);
        ball.angularAcceleration.set(0,0,0);
        //still not complete equations 38 , 48
    }
    applyTableKinematics(ball,dt){
        ball.position.y = this.surfaceY;
        ball.velocity.y = 0;
        ball.acceleration.y = 0;

        //equation 16
        const uX =ball.velocity.x+ ball.radius *ball.angularVelocity.y;
        const uY= ball.velocity.y -ball.radius *ball.angularVelocity.x;
        const u = new THREE.Vector3(uX, uY, 0);
        const uLength = u.length();

        const horizontalVel = new THREE.Vector3(ball.velocity.x, 0, ball.velocity.z);
        const speed = horizontalVel.length();

        const EPSILON = 0.005; 
        if (uLength > EPSILON) {
            //equation 4
            const uDirection = u.clone().normalize();
            const slidingScalar = ball.mu_k * this.gravity;

        } else if (speed > EPSILON) {
            //equation 6 & 14
            const velocityDirection = horizontalVel.clone().normalize();
            const rollingScalar = ball.mu_r * this.gravity;
            //equation 7 &21

        } else {
            ball.velocity.x = 0;
            ball.velocity.z = 0;
            ball.acceleration.set(0, 0, 0);
            ball.angularAcceleration.set(0, 0, 0);
        }

        //equation 13& 24 for angular velocity
    }
}