import {
	resolveElasticImpulse,
	separateOverlappingBalls
} from '../Utils/CollisionUtils.js';

export class BallBallCollisionSystem {

	constructor(config) {
		this.restitution = config.restitution;
	}

	update(balls) {
		for (let i = 0; i < balls.length; i++) {
			for (let j = i + 1; j < balls.length; j++) {
				const ballA = balls[i];
				const ballB = balls[j];

				if (!this.detectCollision(ballA, ballB)) {
					continue;
				}

				const normal = this.computeContactNormal(ballA, ballB);
				const overlap = this.computePenetrationDepth(ballA, ballB);

				this.separateBalls(ballA, ballB, normal, overlap);
				this.transferLinearMomentum(ballA, ballB, normal);
				this.transferAngularMomentum(ballA, ballB, normal);
				this.resolveEnergyTransfer(ballA, ballB, normal);
			}
		}
	}

	detectCollision(ballA, ballB) {
		const normal = ballB.position.clone().sub(ballA.position);
		return normal.length() < (ballA.radius + ballB.radius);
	}

	computeContactNormal(ballA, ballB) {
		const normal = ballB.position.clone().sub(ballA.position);

		if (normal.length() === 0) {
			return normal.set(1, 0, 0);
		}

		return normal.normalize();
	}

	computePenetrationDepth(ballA, ballB) {
		const distance = ballB.position.clone().sub(ballA.position).length();
		return (ballA.radius + ballB.radius) - distance;
	}

	separateBalls(ballA, ballB, normal, overlap) {
		separateOverlappingBalls(ballA, ballB, normal, overlap);
	}

	transferLinearMomentum(ballA, ballB, normal) {
		resolveElasticImpulse(ballA, ballB, normal, this.restitution);
	}

	transferAngularMomentum(ballA, ballB, normal) {

	}

	resolveEnergyTransfer(ballA, ballB, normal) {

	}

}

