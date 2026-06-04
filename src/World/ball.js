import * as THREE from 'three';

export class Ball {
    constructor(scene, data , geometry){
        this.scene = scene;
        this.id = data.id;
        this.isCue = data.isCue;
        this.position = new THREE.Vector3(
            data.startPos.x,
            data.startPos.y,
            data.startPos.z
        );
        this.velocity = new THREE.Vector3(0,0,0);
        this.acceleration = new THREE.Vector3(0,0,0);
        this.radius = 0.04;
        this.mass = 0.1;
        this.restitution = 0.95;
        this.friction = 0.2;
        
        const material = new THREE.MeshStandardMaterial({
            color: data.color,
            roughness: 0.1,
            metalness: 0.2,
        });

        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.castShadow = true;
        this.mesh.receiveShadow= true;
        
        this.scene.add(this.mesh)
        this.syncMesh();
    }
    syncMesh(){
        this.mesh.position.copy(this.position);
    }
    update(){
        this.velocity.add(this.velocity);
        this.syncMesh();
    }
}