import * as THREE from 'three';

export class TextureLoader {

	constructor() {
		this.loader = new THREE.TextureLoader();
	}

	load(path) {
		return new Promise((resolve, reject) => {
			this.loader.load(
				path,
				(texture) => resolve(texture),
				undefined,
				(error) => reject(error)
			);
		});
	}

}
