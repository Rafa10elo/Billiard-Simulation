export class CueStickBody {
    constructor(data) {
        this.position = { ...data.position };
        this.rotationX = 0; 
        this.rotationY = 0;
        this.power = 0;
    }

    aimAt(cueBall) {
        this.position.x = cueBall.position.x;
        this.position.z = cueBall.position.z;
    }

    toSnapshot() {
        return {
            position: { ...this.position },
            rotationX: this.rotationX,
            rotationY: this.rotationY,
            power: this.power,
        };
    }
}