export class DebugPhysicsController {

    constructor(keyboardInput) {
        this.keyboardInput = keyboardInput;
    }

    getControlState() {
        return {
            explodeAll: this.keyboardInput.isJustPressed('KeyL'),
            reset: this.keyboardInput.isJustPressed('KeyR')
        };
    }

}