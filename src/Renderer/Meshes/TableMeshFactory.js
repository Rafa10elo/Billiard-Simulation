import { TableData } from '../../Data/TableData.js';
import * as THREE from 'three';
import { TextureLoader } from '../../Assets/TextureLoader.js';

export class TableMeshFactory {

	constructor(scene, modelLoader) {
		this.scene = scene;
		this.modelLoader = modelLoader;
		this.textureLoader = new TextureLoader();
	}

	async createTableMesh() {
		const fallbackGeometry = new THREE.BoxGeometry(2.2, 0.2, 4.4);
		const fallbackMaterial = new THREE.MeshStandardMaterial({ color: 0x2f6b3d });
		const tableMesh = new THREE.Mesh(fallbackGeometry, fallbackMaterial);

		tableMesh.position.set(TableData.position.x, TableData.surfaceY - 0.1, TableData.position.z);
		tableMesh.receiveShadow = true;
		this.scene.add(tableMesh);

		const groundY = TableData.position.y - 0.06;
		const groundGeo = new THREE.PlaneGeometry(200, 200);
		//made it black yo 
		const groundMat = new THREE.MeshStandardMaterial({ color: 0x0000000 });
		//const groundMat = new THREE.MeshStandardMaterial({ color: 0xFFD700	,transparent: true, opacity: 0 });
		const ground = new THREE.Mesh(groundGeo, groundMat);
		ground.rotation.x = -Math.PI / 2;
		ground.position.y = groundY;
		ground.receiveShadow = true;
		this.scene.add(ground);

		try {
			const tableTexture = await this.textureLoader.load(TableData.texturePath);
			tableTexture.colorSpace = THREE.SRGBColorSpace;
			tableTexture.needsUpdate = true;
			fallbackMaterial.map = tableTexture;
			fallbackMaterial.needsUpdate = true;
		} catch {
		}

		try {
			const model = await this.modelLoader.load(TableData.modelPath);

			model.scale.set(TableData.scale.x, TableData.scale.y, TableData.scale.z);
			model.position.set(TableData.position.x, TableData.position.y, TableData.position.z);

			model.traverse((child) => {
				if (child.isMesh) {
					child.castShadow = true;
					child.receiveShadow = true;
				}
			});

			this.scene.remove(tableMesh);
			this.scene.add(model);
			return model;
		} catch {
			return tableMesh;
		}
	}

}

