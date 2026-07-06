export class CueStickBody {
    constructor(data) {
        this.position = { ...data.position };
        this.rotationX = Math.PI/2; 
        this.rotationY = Math.PI/2;
        this.rotationZ = 0;
        this.power = 0;
        this.length = 1.2;
    }

    aimAt(cueBall) {
        const dx = cueBall.position.x - this.position.x;
        const dy = cueBall.position.y - this.position.y;
        const dz = cueBall.position.z - this.position.z;
        const horizontal = Math.sqrt(dx * dx + dz * dz);
        const shotDirection = this.getForwardVector();
        this.position.x = cueBall.position.x + shotDirection.x * 0.7;
        this.position.y = cueBall.position.y ;
        this.position.z = cueBall.position.z + shotDirection.z * 0.7+0.7;
    }
    getForwardVector() {

        const cp= Math.cos(this.rotationX);
        const sp =Math.sin( this.rotationX);

        const cy=Math.cos(this.rotationY);
        const sy = Math.sin(this.rotationY );

        return {
            x: sy * cp,
            y: sp,
            z: cy * cp
        };
    }
    getTipPosition() {

        const dir = this.getForwardVector();

        return {
            x: this.position.x + dir.x * this.length,
            y: this.position.y + dir.y * this.length,
            z: this.position.z + dir.z * this.length
        };

    }
    syncWithStrike(cueBall,{ angleX, angely ,angleZ, power, offsetX = 0, offsetY = 0 }) {
                this.rotationX = angleX;
                this.rotationY= angely;
                this.rotationZ=angleZ;
                this.power = power;
                this.position.x = offsetX;
                // this.position.y = offsetY;
                this.position.z = cueBall.position.z - 0.7;
    }

    toSnapshot() {
        return {
            position: { ...this.position },
            rotationX: this.rotationX,
            rotationY: this.rotationY,
            rotationZ: this.rotationZ,
            power: this.power,

        };
    }
}