import * as THREE from 'three';

export class CushionDebugFactory {
    constructor(scene) {
        this.scene = scene;
        this.cushionHeight = 0.0125;
        this.rectangleHeight = 0.06;
    }
    createDebugCushions(cushions) {
        cushions.forEach(c => {
            if (c.type === 'arc') {
                this.createArcCushion(c);
            }  else if (c.type === 'rectangle') {
            this.createRectangle(c);
            }
            else if (c.type === 'line') {
                this.createLineCushion(c);
            }
        });
    }
     createDebugRectangles(rectangles) {
        rectangles.forEach(r => {
            this.createRectangle(r);
        });
    }

    createLineCushion(c) {
        const cushionY = c.y ?? 0.8;
        const thickness = c.thickness ?? 0.02;
        const A = new THREE.Vector3(c.x1, cushionY, c.z1);
        const B = new THREE.Vector3(c.x2, cushionY, c.z2);
        const dir = new THREE.Vector3().subVectors(B, A);
        const length = dir.length();
        const geometry = new THREE.BoxGeometry(
            length,
            this.cushionHeight,
            thickness
        );
        const material = new THREE.MeshPhongMaterial({
            color: 0x00ff00,
            transparent: true,
            opacity: 0.6,
            side: THREE.DoubleSide
        });
        const mesh = new THREE.Mesh(geometry, material);
        const mid = new THREE.Vector3().addVectors(A, B).multiplyScalar(0.5);
        mesh.position.copy(mid);
        const angle = Math.atan2(dir.z, dir.x);
        mesh.rotation.y = -angle;
        this.scene.add(mesh);
    }
    createArcCushion(c) {
        const arcY = c.cy ?? 0.8;
        const thickness = c.thickness ?? 0.04;
        const radius = c.radius ?? 0.05;
        const start = -c.endAngle;
        const end = -c.startAngle;
        const arc = new THREE.ArcCurve(
            0, 0,
            radius,
            start,
            end,
            false
        );
        const points2 = arc.getPoints(24);
        const points3 = points2.map(p => new THREE.Vector3(p.x, 0, -p.y));
        const path = new THREE.CatmullRomCurve3(points3);
        const geometry = new THREE.TubeGeometry(path, 24, thickness * 0.5, 6, false);
        const material = new THREE.MeshPhongMaterial({
            color: 0x00ff00,
            transparent: true,
            opacity: 0.7,
            side: THREE.DoubleSide
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(c.cx, arcY, c.cz);
        this.scene.add(mesh);
    }
   
    createRectangle(r) {
        const cushionY = r.y ?? 0.8;

        const height = this.rectangleHeight;
        const thickness = r.thickness ?? 0.08;

        const A = new THREE.Vector3(r.x1, cushionY, r.z1);
        const B = new THREE.Vector3(r.x2, cushionY, r.z2);

        const dir = new THREE.Vector3().subVectors(B, A);
        const length = dir.length();

        const geometry = new THREE.BoxGeometry(
            length,
            height,
            thickness
        );

        const material = new THREE.MeshPhongMaterial({
            color: new THREE.Color(0x6A3A12),
            shininess: 40,
            specular: new THREE.Color(0x222222)
        }); 

        const mesh = new THREE.Mesh(geometry, material);

        const mid = new THREE.Vector3().addVectors(A, B).multiplyScalar(0.5);
        mesh.position.copy(mid);

        const angle = Math.atan2(dir.z, dir.x);
        mesh.rotation.y = -angle;

        this.scene.add(mesh);
    }
    
}
