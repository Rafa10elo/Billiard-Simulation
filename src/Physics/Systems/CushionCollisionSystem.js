export class CushionCollisionSystem {

	constructor(config, tablePhysics) {
		this.restitution = config.restitution;
		this.tablePhysics = tablePhysics;
	}

	update(balls) {
		const bounds = this.tablePhysics.bounds;

		balls.forEach((ball) => {
			const r = ball.radius;

			if (ball.position.x - r < bounds.minX) {
				this.detectCushionCollision(ball);
				this.resolveCushionImpulse(ball, 'x', bounds.minX + r);
				this.applyCushionFriction(ball, 'x');
				this.transferSpinOnCushion(ball, 'x');
			} else if (ball.position.x + r > bounds.maxX) {
				this.detectCushionCollision(ball);
				this.resolveCushionImpulse(ball, 'x', bounds.maxX - r);
				this.applyCushionFriction(ball, 'x');
				this.transferSpinOnCushion(ball, 'x');
			}

			if (ball.position.z - r < bounds.minZ) {
				this.detectCushionCollision(ball);
				this.resolveCushionImpulse(ball, 'z', bounds.minZ + r);
				this.applyCushionFriction(ball, 'z');
				this.transferSpinOnCushion(ball, 'z');
			} else if (ball.position.z + r > bounds.maxZ) {
				this.detectCushionCollision(ball);
				this.resolveCushionImpulse(ball, 'z', bounds.maxZ - r);
				this.applyCushionFriction(ball, 'z');
				this.transferSpinOnCushion(ball, 'z');
			}
		});
	}

	detectCushionCollision(ball) {

	}

	resolveCushionImpulse(ball, axis, boundary) {
		ball.position[axis] = boundary;
		ball.velocity[axis] *= -this.restitution;
	}

	applyCushionFriction(ball, axis) {

	}

	transferSpinOnCushion(ball, axis) {

	}

}

