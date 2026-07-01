import * as THREE from 'three';
import { TableData } from '../../Data/TableData.js';

export class PocketVisualizer {
    constructor(scene) {
        this.scene = scene;
        this.tunnels = [];
        this.createTunnels();
    }
    createTunnels() {
        TableData.pockets.forEach(pocket => {
            const tunnelHeight = pocket.depth;
            const geometry = new THREE.CylinderGeometry(
                pocket.radius, 
                pocket.radius, 
                tunnelHeight, 
                32, 
                1, 
                true
            );
            const material = new THREE.MeshBasicMaterial({
                color: 0x00ff00,
                transparent: true,
                opacity: 0.3,
                side: THREE.DoubleSide,
                wireframe: true
            });
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(
                pocket.x,
                pocket.y - (tunnelHeight / 2),
                pocket.z
            );
            this.scene.add(mesh);
            this.tunnels.push(mesh);
        });
    }
    setVisible(visible) {
        this.tunnels.forEach(t => t.visible = visible);
    }
}
