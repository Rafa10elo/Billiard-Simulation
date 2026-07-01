import * as THREE from 'three';

export class CushionDebugFactory {
    constructor(scene) {
        this.scene = scene;
        this.debugY = 0.78;
        this.cushionThickness = 0.02;
        this.cushionHeight = 0.05;
    }

    createDebugCushions(cushions) {
        cushions.forEach(c => {
            if (c.type === 'arc') {
                this.createArcCushion(c);
            } else {
                this.createLineCushion(c);
            }
        });
    }

    createLineCushion(c) {
        const A = new THREE.Vector3(c.x1, this.debugY, c.z1);
        const B = new THREE.Vector3(c.x2, this.debugY, c.z2);

        const dir = new THREE.Vector3().subVectors(B, A);
        const length = dir.length();

        const geometry = new THREE.BoxGeometry(
            length,
            this.cushionHeight,
            this.cushionThickness
        );

        const material = new THREE.MeshPhongMaterial({
            color: 0x00ff00,
            transparent: true,
            opacity: 0.6
        });

        const mesh = new THREE.Mesh(geometry, material);

        const mid = new THREE.Vector3().addVectors(A, B).multiplyScalar(0.5);
        mesh.position.copy(mid);

        const angle = Math.atan2(dir.z, dir.x);
        mesh.rotation.y = -angle;

        this.scene.add(mesh);
    }

    createArcCushion(c) {
        const radius = c.radius;
        const tube = this.cushionThickness * 0.5;

        const arc = new THREE.ArcCurve(
            c.cx, c.cz,
            radius,
            c.startAngle,
            c.endAngle,
            false
        );

        const curve3 = new THREE.CurvePath();
        curve3.add(new THREE.Curve());

        const points2 = arc.getPoints(32);
        const points3 = points2.map(p => new THREE.Vector3(p.x, this.debugY, p.y));
        const path = new THREE.CatmullRomCurve3(points3);

        const geometry = new THREE.TubeGeometry(path, 32, tube, 8, false);
        const material = new THREE.MeshPhongMaterial({
            color: 0x00ff00,
            transparent: true,
            opacity: 0.7
        });

        const mesh = new THREE.Mesh(geometry, material);
        this.scene.add(mesh);
    }
}