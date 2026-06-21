import * as THREE from 'three';

export class Cue{
    constructor(scene, loader){
        this.scene= scene;
        this.model=null;

        loader.load(
          '/models/cueStick/stick.glb',
          (gltf) => {
            this.model = gltf.scene;
            this.model.scale.set(0.8, 0.8, 0.8);
            this.model.position.set(1, 0, 0);

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