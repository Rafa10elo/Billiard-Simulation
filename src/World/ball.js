import * as THREE from 'three';

export const BALLSTATE = {
    STATIONARY : 'STATIONARY' ,
    SPINNING : 'SPINNING',
    SLIDING: 'SLIDING',
    ROLLING : 'ROLLING',
    MIDAIR :'MIDAIR'
}
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
        this.velocity = new THREE.Vector3(0,0,1);
        this.acceleration = new THREE.Vector3(0,0,0);
        this.angularVelocity = new THREE.Vector3(0,0,0);
        this.angularAcceleration = new THREE.Vector3(0,0,0);
        this.state =BALLSTATE.STATIONARY
        this.radius = 0.04;
        this.mass = 0.1;
        //coeffeicients kinetic rolling and spinning
        this.mu_k = 0.2;    
        this.mu_r = 0.01;    
        this.mu_sp = 0.02;
        
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
        //TODo : convert angular velocity vector into mesh quaternion rotations
    }
    
    update(dt=0.016){
        this.applyState(dt);
        this.checkState();
        this.velocity.add(this.acceleration.clone().multiplyScalar(dt));
        this.position.add(this.velocity.clone().multiplyScalar(dt));
        this.angularVelocity.add(this.angularAcceleration.clone().multiplyScalar(dt));
        this.syncMesh();
    }
    applyState(dt){
        //reset before calcualting 
        //this.velocity.set(0,0,0);
        //this.angularVelocity.set(0,0,0);
        switch(this.state){
            case BALLSTATE.STATIONARY:
                //shofoo elequations bil diraseh bitfeed mwaah <3
                // this.velocity.set(0,0,0);
                // this.angularVelocity.set(0,0,0);
                break;
            case BALLSTATE.ROLLING:
                //elrolling bdo friction brdo shofoo eldiraseh la tnsoo el coefficients
                break;
            case BALLSTATE.SPINNING:
                //elspin 3al vertical axis ma btt7rk linearly la tnsoo el coefficients
                break;
            case BALLSTATE.SLIDING :
                // hoon el relative velocity != 0
                break;
            case BALLSTATE.MIDAIR :
                //mafee friction bas fee gravity 
                break;
        }
    }
    checkState(){
        //calculate elrelative contact velocity , check midair ball is on the table change state to rolling or sliding accordigly :')
    }
}