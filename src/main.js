import { PhysicsWorld } from './Physics/PhysicsWorld.js';
import { BallBody } from '/src/Physics/Bodies/BallBody.js'



const world = new PhysicsWorld();
const ball = new BallBody({
    id:0,
    isCue:true,
    startPos:{
        x:0,
        y:0,
        z:0
    }
});

ball.velocity.x = 1;

world.addBall(ball);

for(let i=0;i<5;i++){

    world.step(1);

    console.log(
        world.balls[0].position
    );

}