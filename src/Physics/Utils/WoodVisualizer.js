import * as THREE from 'three';

export class WoodVisualizer {
  constructor(scene, tableData) {
    this.scene = scene;
    this.tableData = tableData;
    this.meshes = [];
    
      this.init();
  }

  init() {
    const woods = this.tableData.woods ?? [];
    const brown = 0x8B5A2B;

    woods.forEach((w) => {
      const y = w.y ?? this.tableData.surfaceY;
      const thickness = w.thickness ?? 0.11;
      const height = w.height ?? 0.08;

      const p1 = new THREE.Vector3(w.x1, y, w.z1);
      const p2 = new THREE.Vector3(w.x2, y, w.z2);

      const dir = new THREE.Vector3().subVectors(p2, p1);
      const length = dir.length();
      dir.normalize();

      const geom = new THREE.BoxGeometry(thickness, height, length);
      const mat = new THREE.MeshBasicMaterial({
        color: brown,
        transparent: true,
        opacity: 0.65
      });

      const mesh = new THREE.Mesh(geom, mat);

      const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
      mesh.position.copy(mid);
      mesh.position.y += height * 0.5;

      const angle = Math.atan2(dir.x, dir.z);
      mesh.rotation.y = angle;

      this.scene.add(mesh);
      this.meshes.push(mesh);
    });
  }

  destroy() {
    this.meshes.forEach(m => this.scene.remove(m));
    this.meshes = [];
  }
}