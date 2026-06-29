export class PhysicsRenderSync {

	syncBallMeshes(snapshot, ballMeshMap) {
		snapshot.balls.forEach((ball) => {
			const mesh = ballMeshMap.get(ball.id);

			if (!mesh) {
				return;
			}

			mesh.position.set(
				ball.position.x,
				ball.position.y,
				ball.position.z
			);

			mesh.quaternion.set(
				ball.rotation.x,
				ball.rotation.y,
				ball.rotation.z,
				ball.rotation.w
			);
		});
	}


	syncCue(cueSnapshot, cueMesh) {
		if (!cueSnapshot || !cueMesh) return;
		cueMesh.position.set(
			cueSnapshot.position.x,
			cueSnapshot.position.y,
			cueSnapshot.position.z
		);
    	cueMesh.rotation.y = cueSnapshot.rotationY; 
    	cueMesh.rotation.x = cueSnapshot.rotationX;	}

}

