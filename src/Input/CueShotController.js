export class CueShotController {

    constructor(keyboard) {
        this.keyboard = keyboard;
        this.mode = "FREE";
        this.yaw = Math.PI; 
        
        this.minPitch = -1.0 * (Math.PI / 180); 
        this.maxPitch = -180.0 * (Math.PI / 180);
        this.pitch = this.minPitch;

        this.offsetX = 0;
        this.offsetY = 0;
        this.power = 1;
        this.rotationSpeed = 0.02;
        this.offsetSpeed = 0.0015;
        this.powerSpeed = 0.05;
        
        this.maxOffset = 0.032;
        this.maxPower = 5.0;
        this.minPower = 0.0;
    }

    update() {
        if (this.keyboard.isJustPressed("Enter")) {
            switch (this.mode) {
                case "FREE": this.mode = "AIM"; break;
                case "AIM": this.mode = "OFFSET"; break;
                case "OFFSET": this.mode = "POWER"; break;
                case "POWER": return true;
            }
        }

        switch (this.mode) {
            case "AIM": this.updateAim(); break;
            case "OFFSET": this.updateOffset(); break;
            case "POWER": this.updatePower(); break;
        }

        return false;
    }

    updateAim() {
        if (this.keyboard.isPressed("ArrowLeft"))
            this.yaw -= this.rotationSpeed;

        if (this.keyboard.isPressed("ArrowRight"))
            this.yaw += this.rotationSpeed;

        if (this.keyboard.isPressed("ArrowUp"))
            this.pitch -= this.rotationSpeed;

        if (this.keyboard.isPressed("ArrowDown"))
            this.pitch += this.rotationSpeed;

        this.pitch = Math.max(this.maxPitch,Math.min(this.minPitch, this.pitch));
    }

    updateOffset() {
        if (this.keyboard.isPressed("ArrowLeft"))
            this.offsetX += this.offsetSpeed;

        if (this.keyboard.isPressed("ArrowRight"))
            this.offsetX -= this.offsetSpeed;

        if (this.keyboard.isPressed("ArrowUp"))
            this.offsetY -= this.offsetSpeed;

        if (this.keyboard.isPressed("ArrowDown"))
            this.offsetY += this.offsetSpeed;

        const len = Math.sqrt( this.offsetX * this.offsetX + this.offsetY * this.offsetY);
        if (len > this.maxOffset) {
            const s = this.maxOffset /len;
            this.offsetX *= s;
            this.offsetY *= s;
        }
    }

    updatePower() {
        if (this.keyboard.isPressed("ArrowUp"))
            this.power += this.powerSpeed;

        if (this.keyboard.isPressed("ArrowDown"))
            this.power -= this.powerSpeed;

        this.power = Math.max(this.minPower, Math.min(this.maxPower, this.power));
    }

    consumeShot() {
        const shot = {
            angleX: Math.sin(this.yaw) * Math.cos(this.pitch),
            angely: Math.sin(this.pitch),
            angleZ: Math.cos(this.yaw) * Math.cos(this.pitch),
            power: this.power,
            offsetX: this.offsetX,
            offsetY: this.offsetY
        };

        this.mode = "FREE";
        this.offsetX = 0;
        this.offsetY = 0;
        this.power = 1;
        this.pitch = this.minPitch;

        return shot;
    }
}
