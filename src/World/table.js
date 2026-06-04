import * as THREE from 'three';

export class Table{
    constructor(scene, loader){
        this.scene =scene;
        this.model= null;

        loader.load(
          '/models/poolTable/pooltable.glb',
          (gltf) => {
            this.model = gltf.scene;
            this.model.scale.set(1.0, 1.0, 1.0);
            this.model.position.set(0, 0, 0);

            this.model.traverse((child) => {
              if (child.isMesh) {
                child.castShadow  = true;
                child.receiveShadow = true;
              }
            });
            this.scene.add(this.model);
            console.log('success niggas',this.model);
          },
          (xhr) => {
             console.log((xhr.loaded / xhr.total * 100) + '% loaded');
          },
          (error) => {
            console.log(error);
          }
        );
    }
}