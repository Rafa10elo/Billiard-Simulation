import * as THREE from 'three';

export class BarMeshFactory {

    constructor(scene, modelLoader) {
        this.scene = scene;
        this.modelLoader = modelLoader;
    }

    async createBarMesh() {

        try {
            const model = await this.modelLoader.load('/models/Bar/bar.glb');

            model.scale.set(0.2,0.2,0.2);
            model.rotation.set(0,-Math.PI/2,0);
            model.position.set(1,1,0);

            model.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });
            this.scene.add(model);
            return model;
        } catch {
            
        }
    }

}

