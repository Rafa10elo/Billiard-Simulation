import * as THREE from 'three';
import { CueData } from '../../Data/TableData.js';
import { TextureLoader } from '../../Assets/TextureLoader.js';

export class CueMeshFactory {

	constructor(scene, modelLoader) {
		this.scene = scene;
		this.modelLoader = modelLoader;
		this.textureLoader = new TextureLoader();
	}

	async createCueMesh() {
		const fallbackGeometry = new THREE.CylinderGeometry(0.01, 0.015, 1.2, 16);
		const fallbackMaterial = new THREE.MeshStandardMaterial({ color: 0x9f6b3f });
		const cueMesh = new THREE.Mesh(fallbackGeometry, fallbackMaterial);

		cueMesh.rotation.z = Math.PI / 2;
		cueMesh.position.set(0.72, 0.9, 0.52);
		this.scene.add(cueMesh);

		let cueTexture = null;

		try {
			cueTexture = await this.textureLoader.load(CueData.texturePath);
			cueTexture.colorSpace = THREE.SRGBColorSpace;
			cueTexture.needsUpdate = true;
			fallbackMaterial.map = cueTexture;
			fallbackMaterial.needsUpdate = true;
		} catch {
			// Keep the fallback material if the texture path is unavailable.
		}

		try {
			const model = await this.modelLoader.load(CueData.modelPath);
			model.scale.set(CueData.scale.x, CueData.scale.y, CueData.scale.z);
			model.position.set(0.72, 0.9, 0.52);
			model.rotation.y = Math.PI * 0.5;
			model.traverse((child) => {
				if (!child.isMesh) {
					return;
				}

				child.castShadow = true;
				child.receiveShadow = true;

				if (cueTexture && child.material) {
					child.material = child.material.clone();
					child.material.map = cueTexture;
					child.material.needsUpdate = true;
				}
			});

			this.scene.remove(cueMesh);
			this.scene.add(model);
			return model;
		} catch {
			return cueMesh;
		}
	}

}
