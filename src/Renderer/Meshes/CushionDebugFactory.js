import * as THREE from 'three';

export class CushionDebugFactory {
    constructor(scene) {
        this.scene = scene;
    }

    createDebugLines(cushions) {
        cushions.forEach(cushion => {
            const material = new THREE.LineBasicMaterial({ color: 0xff0000 });

            const points = [
                new THREE.Vector3(cushion.x1, 0.8, cushion.z1),
                new THREE.Vector3(cushion.x2, 0.8, cushion.z2)
            ];

            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            const line = new THREE.Line(geometry, material);

            this.scene.add(line);
        });
    }
}
