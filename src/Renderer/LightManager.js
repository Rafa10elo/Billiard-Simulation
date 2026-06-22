import * as THREE from 'three';

export class LightManager {

	constructor(scene) {
		this.scene = scene;
	}

	setup() {
		const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
		const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);

		directionalLight.position.set(5, 10, 7);
		directionalLight.castShadow = true;

		this.scene.add(ambientLight);
		this.scene.add(directionalLight);
	}

}
