import * as THREE from 'three';

export class SceneManager {

	constructor() {
		this.scene = new THREE.Scene();
		// set background to blue
		this.scene.background = new THREE.Color(0x87CEEB);
	}

	getScene() {
		return this.scene;
	}

}
