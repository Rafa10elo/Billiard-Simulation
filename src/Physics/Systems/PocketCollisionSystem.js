export class PocketCollisionSystem {

    update(balls, tablePhysics) {

        balls.forEach(ball=>{

            if(!ball.isActive)
                return;

            this.evaluatePocketDetection(
                ball,
                tablePhysics.pockets
            );

        });

    }

    evaluatePocketDetection(ball,pockets){

       if(!ball.isActive)
            return;

        const radius = ball.radius;

        for(const pocket of pockets){

            const dx = ball.position.x - pocket.x;
            const dz = ball.position.z - pocket.z;

            const distanceSquared =dx*dx + dz*dz;

            const triggerRadius =pocket.radius - radius*0.2;

            if(distanceSquared <= triggerRadius*triggerRadius){
                ball.isPocketed=true;
                return;

            }

        }

    }

}