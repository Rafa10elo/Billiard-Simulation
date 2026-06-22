export function separateOverlappingBalls(ballA, ballB, normal, overlap) {
	ballA.position.addScaledVector(normal, -overlap / 2);
	ballB.position.addScaledVector(normal, overlap / 2);
}

export function resolveElasticImpulse(ballA, ballB, normal, restitution) {
	const relVel = ballB.velocity.clone().sub(ballA.velocity);
	const velNormal = relVel.dot(normal);

	if (velNormal >= 0) {
		return;
	}

	const impulse =
		(-(1 + restitution) * velNormal) /
		((1 / ballA.mass) + (1 / ballB.mass));

	ballA.velocity.addScaledVector(normal, -impulse / ballA.mass);
	ballB.velocity.addScaledVector(normal, impulse / ballB.mass);
}

