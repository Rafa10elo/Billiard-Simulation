import * as THREE from 'three';
import { SceneManager } from './SceneManager.js';
import { CameraController } from './CameraController.js';
import { LightManager } from './LightManager.js';
import { PhysicsRenderSync } from './Sync/PhysicsRenderSync.js';

export class Renderer {

	constructor(container) {
		this.container = container;

		this.sceneManager = new SceneManager();
		this.scene = this.sceneManager.getScene();

		this.renderer = new THREE.WebGLRenderer({ antialias: true });
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.renderer.outputColorSpace = THREE.SRGBColorSpace;
		this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
		this.renderer.toneMappingExposure = 1.25;

		this.container.appendChild(this.renderer.domElement);

		this.cameraController = new CameraController(this.renderer.domElement);
		this.lightManager = new LightManager(this.scene);
		this.lightManager.setup();

		this.sync = new PhysicsRenderSync();

		window.addEventListener('resize', () => {
			this.resize(window.innerWidth, window.innerHeight);
		});
	}

	resize(width, height) {
		this.cameraController.resize(width, height);
		this.renderer.setSize(width, height);
	}

	getScene() {
		return this.scene;
	}

	getDomElement() {
		return this.renderer.domElement;
	}

	syncPhysicsSnapshot(snapshot, ballMeshMap) {
		this.sync.syncBallMeshes(snapshot, ballMeshMap);
	}
	syncCueSnapshot(cueSnapshot, cueMesh) {
		this.sync.syncCue(cueSnapshot, cueMesh);
	}

	render() {
		this.cameraController.update();
		this.renderer.render(this.scene, this.cameraController.getCamera());
	}

}
