export class MotionSystem {

    update(balls, dt) {

        balls.forEach(ball => {

            ball.velocity.add(
                ball.acceleration.clone()
                    .multiplyScalar(dt)
            );

            ball.position.add(
                ball.velocity.clone()
                    .multiplyScalar(dt)
            );

        });

    }

}