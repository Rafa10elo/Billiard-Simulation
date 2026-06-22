import * as THREE from 'three';

export class SceneManager {

	constructor() {
		this.scene = new THREE.Scene();
		this.scene.background = new THREE.Color(0x999212);
	}

	getScene() {
		return this.scene;
	}

}
