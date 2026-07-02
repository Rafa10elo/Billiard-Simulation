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
        this.visualizeLines3D();
        this.visualizeArcs3D();
        this.visualizePockets();
    }

    visualizeLines3D() {
        const cushions = this.tableData.cushions.filter(c => c.type === 'line');
        const defaultThickness = 0.02;

        cushions.forEach((cushion) => {
            const y = cushion.y ?? this.tableData.surfaceY;
            const thickness = cushion.thickness ?? defaultThickness;
            const height = cushion.height ?? 0.08;

            const p1 = new THREE.Vector3(cushion.x1, y, cushion.z1);
            const p2 = new THREE.Vector3(cushion.x2, y, cushion.z2);
            
            const direction = new THREE.Vector3().subVectors(p2, p1);
            const length = direction.length();
            direction.normalize();

            const geomLength = length + (cushion.borderRadius ? cushion.borderRadius * 2 : 0);
            const geometry = new THREE.BoxGeometry(thickness, height, geomLength);
            const material = new THREE.MeshBasicMaterial({
                color: this.colors.line,
                wireframe: false,
                transparent: true,
                opacity: 0.6
            });

            const mesh = new THREE.Mesh(geometry, material);

            const midPoint = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
            mesh.position.copy(midPoint);
            mesh.position.y += height * 0.5;

            const angle = Math.atan2(direction.x, direction.z);
            mesh.rotation.y = angle;

            this.scene.add(mesh);
            this.visualMeshes.push(mesh);

            let inwardNormal = new THREE.Vector3(-direction.z, 0, direction.x).normalize();
            if (midPoint.dot(inwardNormal) > 0) {
                inwardNormal.multiplyScalar(-1);
            }
            const arrowHelper = new THREE.ArrowHelper(inwardNormal, midPoint, 0.15, this.colors.normal);
            this.scene.add(arrowHelper);
            this.visualMeshes.push(arrowHelper);
        });
    }

    visualizeArcs3D() {
        const arcs = this.tableData.cushions.filter(c => c.type === 'arc');
        const defaultThickness = 0.02;

        arcs.forEach((arc) => {
            const y = arc.cy ?? this.tableData.surfaceY;
            const thickness = arc.thickness ?? defaultThickness;
            const height = arc.height ?? 0.08;

            let start = arc.startAngle;
            let end = arc.endAngle;
            if (end < start) end += Math.PI * 2;
            const sweep = end - start;

            const innerRadius = arc.radius - (thickness * 0.5);
            const outerRadius = arc.radius + (thickness * 0.5);

            const outerGeom = new THREE.CylinderGeometry(
                outerRadius, outerRadius, height, 32, 1, true, start, sweep
            );
            const material = new THREE.MeshBasicMaterial({
                color: this.colors.arc,
                side: THREE.DoubleSide,
                wireframe: true
            });

            const outerMesh = new THREE.Mesh(outerGeom, material);
            outerMesh.position.set(arc.cx, y + (height * 0.5), arc.cz);
            this.scene.add(outerMesh);
            this.visualMeshes.push(outerMesh);

            const innerGeom = new THREE.CylinderGeometry(
                innerRadius, innerRadius, height, 32, 1, true, start, sweep
            );
            const innerMesh = new THREE.Mesh(innerGeom, material);
            innerMesh.position.copy(outerMesh.position);
            this.scene.add(innerMesh);
            this.visualMeshes.push(innerMesh);

            const capGeom = new THREE.BufferGeometry();
            const midAngle = start + (sweep * 0.5);
            const edgeX = arc.cx + Math.cos(midAngle) * arc.radius;
            const edgeZ = arc.cz + Math.sin(midAngle) * arc.radius;
            const edgePoint = new THREE.Vector3(edgeX, y + (height * 0.5), edgeZ);

            let arcNormal = new THREE.Vector3(Math.cos(midAngle), 0, Math.sin(midAngle));
            if (Math.hypot(edgeX, edgeZ) > arc.radius) {
                arcNormal.multiplyScalar(-1);
            }
            
            const arrowHelper = new THREE.ArrowHelper(arcNormal, edgePoint, 0.15, this.colors.normal);
            this.scene.add(arrowHelper);
            this.visualMeshes.push(arrowHelper);
        });
    }

    visualizePockets() {
        this.tableData.pockets.forEach((pocket) => {
            const geometry = new THREE.CylinderGeometry(pocket.radius, pocket.radius, pocket.depth, 16);
            const material = new THREE.MeshBasicMaterial({
                color: this.colors.pocket,
                wireframe: true,
                transparent: true,
                opacity: 0.4
            });
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(pocket.x, pocket.y - (pocket.depth * 0.5), pocket.z);
            
            this.scene.add(mesh);
            this.visualMeshes.push(mesh);
        });
    }

    destroy() {
        this.visualMeshes.forEach(mesh => this.scene.remove(mesh));
        this.visualMeshes = [];
    }
}
