import * as THREE from 'three';

export class CushionVisualizer {
    constructor(scene, tableData) {
        this.scene = scene;
        this.tableData = tableData;
        this.visualMeshes = [];
        
        this.colors = {
            line: 0x00ff00,
            arc: 0xff00ff,
            pocket: 0xff0000,
            normal: 0xffff00
        };

        this.init();
    }

    init() {
        this.generatePocketCushions();
        this.visualizeLines3D();
        this.visualizeArcs3D();
    }

    generatePocketCushions() {
    }

    visualizeLines3D() {
        const cushions = this.tableData.cushions;
        const defaultThickness = 0.02;
        const defaultHeight = 0.05;
        const tableSurfaceY = this.tableData.surfaceY;

        const mat = new THREE.MeshPhongMaterial({
            color: this.colors.line,
            transparent: true,
            opacity: 0.4,
            side: THREE.DoubleSide
        });

        cushions.forEach(c => {
            const thickness = c.thickness ?? defaultThickness;
            const height = c.height ?? defaultHeight;
            
            const topY = tableSurfaceY + height;
            const bottomY = tableSurfaceY - height;
            const totalH = topY - bottomY;
            const midY = bottomY + totalH * 0.5;

            const A = new THREE.Vector3(c.x1, tableSurfaceY, c.z1);
            const B = new THREE.Vector3(c.x2, tableSurfaceY, c.z2);
            const dir = B.clone().sub(A);
            const length = dir.length();
            if (length <= 1e-12) return;

            const boxGeo = new THREE.BoxGeometry(length, totalH, thickness);
            const boxMesh = new THREE.Mesh(boxGeo, mat);
            const mid = A.clone().add(B).multiplyScalar(0.5);
            
            boxMesh.position.set(mid.x, midY, mid.z);
            boxMesh.rotation.y = -Math.atan2(dir.z, dir.x);
            
            this.scene.add(boxMesh);
            this.visualMeshes.push(boxMesh);
        });
    }

    visualizeArcs3D() {
    }
}
