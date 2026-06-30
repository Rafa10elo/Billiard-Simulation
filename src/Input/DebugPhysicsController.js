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
            strike : this.keyboardInput.isJustPressed('Space'),
            moveLeft: this.keyboardInput.isPressed('ArrowLeft'),
            moveRight: this.keyboardInput.isPressed('ArrowRight'),
            moveUp : this.keyboardInput.isPressed('ArrowUp'),
            moveDown: this.keyboardInput.isPressed('ArrowDown'),
            moveForward : this.keyboardInput.isPressed('KeyT'),
            moveBackward: this.keyboardInput.isPressed('Space'),
            rotateUp: this.keyboardInput.isPressed('KeyZ'),
            rotateDown: this.keyboardInput.isPressed('KeyG'),
            rotateRight: this.keyboardInput.isPressed('KeyQ'),
            rotateLeft: this.keyboardInput.isPressed('KeyE')
        };
    }

}
