import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export class CameraController {

	constructor(rendererDomElement) {
		this.camera = new THREE.PerspectiveCamera(
			75,
			window.innerWidth / window.innerHeight,
			0.1,
			1000
		);

		this.camera.position.set(0, 3, 2);

		this.controls = new OrbitControls(this.camera, rendererDomElement);
		this.controls.enableDamping = true;
	}

	update() {
		this.controls.update();
	}

	resize(width, height) {
		this.camera.aspect = width / height;
		this.camera.updateProjectionMatrix();
	}

	getCamera() {
		return this.camera;
	}

}
