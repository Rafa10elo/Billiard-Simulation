import * as THREE from 'three';

export class BallMeshFactory {

	constructor(scene) {
		this.scene = scene;
		this.geometry = new THREE.SphereGeometry(0.04, 32, 32);
	}

	createBallMeshes(ballDataList) {
		const meshMap = new Map();

		ballDataList.forEach((ballData) => {
			const material = new THREE.MeshStandardMaterial({
				color: ballData.color,
				roughness: 0.1,
				metalness: 0.2
			});

			const mesh = new THREE.Mesh(this.geometry, material);
			mesh.castShadow = true;
			mesh.receiveShadow = true;
			mesh.position.set(
				ballData.startPos.x,
				ballData.startPos.y,
				ballData.startPos.z
			);
			this.scene.add(mesh);
			meshMap.set(ballData.id, mesh);
			console.log(ballData.startPos.x)
		});

		return meshMap;
	}

}

