import * as THREE from 'three';

export class BarMeshFactory {

    constructor(scene, modelLoader) {
        this.scene = scene;
        this.modelLoader = modelLoader;
    }

    async createBarMesh() {

        try {
            const model = await this.modelLoader.load('/models/Bar/bar.glb');

            model.scale.set(0.1,0.1,0.1);
            model.rotation.set(0,Math.PI/2,0);
            model.position.set(-0.7,0.5,0);

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

