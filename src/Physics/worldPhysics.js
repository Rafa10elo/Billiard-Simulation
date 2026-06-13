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
        ball.state = 'MIDAIR';
        ball.acceleration.set(0,-this.gravity,0);
        //still not complete equations 38 , 48
    }
    applyTableKinematics(ball,dt){
        ball.position.y = this.surfaceY;
        ball.velocity.y = 0;
        ball.acceleration.y = 0;

        const horizontalVel = new THREE.Vector3(ball.velocity.x,0,ball.velocity.z);
        const speed = horizontalVel.length();
        if (speed === 0 && ball.angularVelocity.length() ===0){
            ball.state = 'STATIONARY' ;
            return;
        }

        const velocityDirection = horizontalVel.clone().normalize();
        switch (ball.state) {
            case 'SLIDING':
                //equation 4
                const slidingScalar = ball.mu_k * this.gravity;
                ball.acceleration.copy(velocityDirection).multiplyScalar(-slidingScalar);
                //TOdO: Calculate sliding torque adjustments. 
                break;

            case 'ROLLING':
                //equation 6 & 14
                const rollingScalar = ball.mu_r * this.gravity;
                ball.acceleration.copy(velocityDirection).multiplyScalar(-rollingScalar);

                // equation 7
                break;

            case 'SPINNING':
                //equation 13 and equation 21 
                ball.acceleration.set(0, 0, 0);
                const spinScalar = (5 * ball.mu_sp * this.gravity) / (2 * ball.radius);

                if (Math.abs(ball.angularVelocity.y) > 0.01) {
                    const spinDirection = Math.sign(ball.angularVelocity.y);
                    ball.angularAcceleration.set(0, -spinDirection * spinScalar, 0);
                } else {
                    ball.angularVelocity.y = 0;
                    ball.angularAcceleration.set(0, 0, 0);
                }
                break;
        }
    }
}