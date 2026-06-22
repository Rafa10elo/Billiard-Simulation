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
            reset: this.keyboardInput.isJustPressed('KeyR')
        };
    }

}
