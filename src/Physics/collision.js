import * as THREE from 'three';

export class Collision {
    constructor(tablebounds, restitution,surfaceY){
        this.tablebounds = tablebounds;
        this.restitution = restitution;
        this.surfaceY = surfaceY
    }
    allCollisions(balls){
        this.tableCollision(balls);
        this.cushionCollision(balls);
        this.ballCollisions(balls);
    }
    tableCollision(balls , surfaceY){
        //hoon mshan el jump shots 
    }
    cushionCollision(balls){
        balls.forEach((ball) => {
            const r = ball.radius ;
            // x talbe bounds 
            if (ball.position.x - r < this.tablebounds.minX){
                ball.position.x = this.tablebounds.minX +r;
                ball.velocity.x *= -this.restitution;
                // + torque modifier to angular velocity 
            } 
            else if (ball.position.x +r > this.tablebounds.maxX){
                ball.position.x = this.tablebounds.maxX -r;
                ball.velocity.x *= -this.restitution;
                // + torque modifier to angular velocity 
            }

            // z table bounds 
            if (ball.position.z-r < this.tablebounds.minZ){
                ball.position.z = this.tablebounds.minZ +r;
                ball.velocity.z *= -this.restitution;
                // + torque modifier to angular velocity 
            }
            else if (ball.position.z + r > this.tablebounds.maxZ){
                ball.position.z = this.tablebounds.maxZ -r;
                ball.velocity.z *= -this.restitution;
                // + torque modifier to angular velocity 
            }
        });
    }
    ballCollisions(balls){
        for (let i=0 ;i<balls.length ; i++){
            for (let j=i+1 ; j<balls.length ;j++){
                const ballA = balls[i];
                const ballB = balls[j];
                
                const normal = new THREE.Vector3().subVectors(ballB.position, ballA.position);
                const distance = normal.length();
                const minDistance = ballA.radius + ballB.radius;

                if (distance < minDistance){
                    normal.normalize();
                    // prevent balls from sticking
                    const overlap = minDistance - distance;
                    ballA.position.addScaledVector(normal, -overlap / 2);
                    ballB.position.addScaledVector(normal, overlap / 2 );

                    //eljump shots 
                    if(ballA.state == 'MIDAIR' || ballB.state == 'MIDAIR'){
                        //7isab elzawieh mawjood bil diraseh equation 40
                    } 

                    //relative velocity elastic momentum transfer
                    const relVel = new THREE.Vector3().subVectors(ballB.velocity, ballA.velocity);
                    const velNormal = relVel.dot(normal);

                    //impulse if objects are moving toward each other
                    if (velNormal < 0){
                        //todo transfer kinetic energy equations 41 ,42
                        const impulse = -(1 + this.restitution) * velNormal / (1/ballA.mass + 1/ballB.mass);
                        ballA.velocity.addScaledVector(normal, -impulse / ballA.mass);
                        ballB.velocity.addScaledVector(normal, impulse / ballB.mass);

                    }
                }
            }
        }
    }
}