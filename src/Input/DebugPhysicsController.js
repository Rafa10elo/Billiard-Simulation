export class DebugPhysicsController {

    constructor(keyboardInput) {
        this.keyboardInput = keyboardInput;
    }

    getControlState() {
        return {
            throwCue: this.keyboardInput.isJustPressed('Digit1'),
            shootRack: this.keyboardInput.isJustPressed('Digit2'),
            shootCushion: this.keyboardInput.isJustPressed('Digit3'),
            explodeAll: this.keyboardInput.isJustPressed('Digit4'),
            reset: this.keyboardInput.isJustPressed('KeyR'),
            strike : this.keyboardInput.isJustPressed('Enter'),
            moveLeft: this.keyboardInput.isPressed('ArrowLeft'),
            moveRight: this.keyboardInput.isPressed('ArrowRight'),
            moveUp : this.keyboardInput.isPressed('ArrowUp'),
            moveDown: this.keyboardInput.isPressed('ArrowDown'),
            rotateUp: this.keyboardInput.isPressed('KeyW'),
            rotateDown: this.keyboardInput.isPressed('KeyS'),
            rotateRight: this.keyboardInput.isPressed('KeyA'),
            rotateLeft: this.keyboardInput.isPressed('KeyD'),
            shootTopSpin: this.keyboardInput.isPressed('Digit5'),
            aimAt: this.keyboardInput.isPressed('KeyF'),
        };
    }

}