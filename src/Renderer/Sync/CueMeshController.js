import * as THREE from "three";

export class CueMeshController {

    constructor(cueMesh) {
        this.cueMesh = cueMesh;
        this.distance = 0.65;
        this.forward = new THREE.Vector3();
        this.right = new THREE.Vector3();
        this.up = new THREE.Vector3(0, 1, 0);
        this.velocityThreshold = 0.001;
    }

    update(cueBall, shotController) {
        if (!cueBall || !this.cueMesh) return;

        const currentSpeed = Math.sqrt(
            cueBall.velocity.x * cueBall.velocity.x +
            cueBall.velocity.y * cueBall.velocity.y +
            cueBall.velocity.z * cueBall.velocity.z
        );

        const angularSpeed = Math.sqrt(
            cueBall.angularVelocity.x * cueBall.angularVelocity.x +
            cueBall.angularVelocity.y * cueBall.angularVelocity.y +
            cueBall.angularVelocity.z * cueBall.angularVelocity.z
        );

        if (currentSpeed >this.velocityThreshold ||angularSpeed> this.velocityThreshold) {
            shotController.mode = "FREE";
            this.cueMesh.visible = false;
            return;
        }

        if (shotController.mode === "FREE" || cueBall.isPocketed || cueBall.position.y < 0) {
            this.cueMesh.visible = false;
            return;
        }

        this.cueMesh.visible = true;

        const yaw = shotController.yaw;
        const pitch = shotController.pitch;

        this.forward.set(
            Math.sin(yaw) * Math.cos(pitch),
            Math.sin(pitch),
            Math.cos(yaw) * Math.cos(pitch)
        ).normalize();

        this.right.crossVectors(this.forward, this.up);

        if (this.right.lengthSq() < 0.00001) {
            this.right.set(1, 0, 0);
        } else {
            this.right.normalize();
        }

        const hitPoint = new THREE.Vector3(cueBall.position.x,cueBall.position.y,cueBall.position.z );

        hitPoint.addScaledVector( this.right, shotController.offsetX);

        hitPoint.addScaledVector(this.up,shotController.offsetY);

        const cuePosition = hitPoint.clone();

        cuePosition.addScaledVector(this.forward, -this.distance );

        this.cueMesh.position.copy(cuePosition);
        this.cueMesh.lookAt(hitPoint);
        this.cueMesh.rotateX(Math.PI/ 2);
    }
}
