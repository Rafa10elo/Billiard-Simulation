import * as THREE from 'three';

export class BallMeshFactory {

	constructor(scene) {
		this.scene = scene;
		this.geometry = new THREE.SphereGeometry(0.04, 32, 32);
	}

	createBallMeshes(ballDataList) {
		const meshMap = new Map();
		const totalIndices = this.geometry.index.count;
const half = totalIndices / 2;

this.geometry.clearGroups();
this.geometry.addGroup(0, half, 0);
this.geometry.addGroup(half, half, 1);

		ballDataList.forEach((ballData) => {
			const material1 = new THREE.MeshStandardMaterial({
				color: ballData.color1,
				roughness: 0.1,
				metalness: 0.2
			});
			const material2 = new THREE.MeshStandardMaterial({
				color: ballData.color2,
				roughness: 0.1,
				metalness: 0.2				
			});
			const mesh = new THREE.Mesh(this.geometry, [ material1, material2 ]);
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

