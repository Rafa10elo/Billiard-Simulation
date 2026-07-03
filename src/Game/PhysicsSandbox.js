import { BallData } from '../Data/BallData.js';
import { Vector3 } from '../Physics/Math/Vector3.js';

export class PhysicsSandbox {

    constructor(physicsWorld) {
        this.physicsWorld = physicsWorld;
        this.initialBallData = BallData;
    }

    reset() {
        this.physicsWorld.balls.forEach((ball) => {
            const data = this.initialBallData.find(d => d.id === ball.id);
            if (data) {
                ball.position.x = data.startPos.x;
                ball.position.y = data.startPos.y;
                ball.position.z = data.startPos.z;
            }
            ball.velocity.set(0, 0, 0);
            ball.acceleration.set(0, 0, 0);
            ball.angularVelocity.set(0, 0, 0);
            ball.angularAcceleration.set(0, 0, 0);
            // clear internal flags
            ball.isPocketed = false;
            ball.isActive = true;
            ball._cueGroundHandled = false;
        });
        
    }
    aimAtCue(){
        const cueBall = this.physicsWorld.balls.find(b => b.isCue);
        if(this.physicsWorld.cue){
            this.physicsWorld.cue.aimAt(cueBall);
        }
    }
    moveLeft(){
        const cueBall = this.physicsWorld.balls.find(b => b.isCue);
        if (this.physicsWorld.cue && this.physicsWorld.cue.position.x >cueBall.position.x - 0.026) {
            console.log("Moving left");
            this.physicsWorld.cue.position.x -= 0.001;
        }
    }
    moveRight(){
        const cueBall = this.physicsWorld.balls.find(b => b.isCue);
        if (this.physicsWorld.cue && this.physicsWorld.cue.position.x <cueBall.position.x + 0.026) {
            console.log("Moving right");
            this.physicsWorld.cue.position.x += 0.001;}
    }
    moveUp(){
        const cueBall = this.physicsWorld.balls.find(b => b.isCue);
        if (this.physicsWorld.cue && this.physicsWorld.cue.position.y <cueBall.position.y + 0.026) {
            this.physicsWorld.cue.position.y += 0.001;}
    }
    moveDown(){
        const cueBall = this.physicsWorld.balls.find(b => b.isCue);
        if (this.physicsWorld.cue && this.physicsWorld.cue.position.y >cueBall.position.y - 0.026) {
            this.physicsWorld.cue.position.y -= 0.001;}
    }
rotateLeft() {

}

rotateRight() {

}


    rotateUp() {
        if (this.physicsWorld.cue && this.physicsWorld.cue.rotationX >1.52) {
            this.physicsWorld.cue.rotationX -= 0.001;
            console.log(this.physicsWorld.cue.rotationX);
            // this.physicsWorld.cue.aimAt(this.physicsWorld.balls.find(b => b.isCue));
            console.log("Rotating down");
        }

    }
    rotateDown() {
        if (this.physicsWorld.cue && this.physicsWorld.cue.rotationX <1.6) {
            this.physicsWorld.cue.rotationX += 0.001;
            console.log(this.physicsWorld.cue.rotationX);
            // this.physicsWorld.cue.aimAt(this.physicsWorld.balls.find(b => b.isCue));
            console.log("Rotating UP");
        }
        
        }

    throwCueBall() {
        const cue = this.physicsWorld.balls.find(b => b.isCue);
        if (!cue) return;
        cue.velocity.x = 1.5;
        cue.velocity.z = 0.5;
    }

    shootAtRack() {
        const cue = this.physicsWorld.balls.find(b => b.isCue);
        if (!cue) return;
        cue.velocity.x = 0;
        cue.velocity.z = -2.0;
    }

    shootAtCushion() {
        const cue = this.physicsWorld.balls.find(b => b.isCue);
        if (!cue) return;
        cue.velocity.x = 1.2;
        cue.velocity.z = -0.6;
    }

    explodeAll() {
        this.physicsWorld.balls.forEach((ball, i) => {
            ball.velocity.x += (Math.random() - 0.5) * 1.6;
            ball.velocity.z += (Math.random() - 0.5) * 1.6;
        });
    }

    shootTopSpin() {
    const cue = this.physicsWorld.balls.find(b => b.isCue);
        if (!cue) return;

    const impulse = new Vector3(0, 0, -0.05);

    //Under the center (TopSpin)
    // const hitPoint = new Vector3(0, -0.02, 0);

    // above the center (BackSpin)
    // const hitPoint = new Vector3(0, 0.02, 0);

    //LeftEnglish
    const hitPoint = new Vector3(-0.02, 0, 0);

    //RightEnglish
    // const hitPoint = new Vector3(0.02, 0, 0);

    cue.applyImpulse(impulse);

    const torque = hitPoint.cross(impulse);
    cue.applyAngularImpulse(torque);
}

}
