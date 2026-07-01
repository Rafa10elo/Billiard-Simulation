import { PHYSICS_CONSTANTS } from '../Constants/PhysicsConstants.js';
import { BallMotionSystem } from '../Systems/BallMotionSystem.js';
import { BallBallCollisionSystem } from '../Systems/BallBallCollisionSystem.js';
import { CushionCollisionSystem } from '../Systems/CushionCollisionSystem.js';
import { PocketCollisionSystem } from '../Systems/PocketCollisionSystem.js';
import { GroundCollisionSystem } from '../Systems/GroundCollisionSystem.js';

import { BallData } from '../../Data/BallData.js';
import { TableData } from '../../Data/TableData.js';

import { TablePhysics } from './TablePhysics.js';
import { CueStickBody } from '../Bodies/CueStickBody.js';
export class PhysicsWorld {
    constructor(){
        this.balls = [];
        this.cue = null;
        this.config = PHYSICS_CONSTANTS;
        this.tablePhysics = new TablePhysics(TableData);
        this.motionSystem = new BallMotionSystem(this.config, this.tablePhysics, TableData.position.y - 0.06);
        this.ballBallCollisionSystem = new BallBallCollisionSystem(this.config);
        this.cushionCollisionSystem = new CushionCollisionSystem(this.config, this.tablePhysics);
        this.pocketCollisionSystem = new PocketCollisionSystem();
        this.groundCollisionSystem = new GroundCollisionSystem(this.config, TableData.position.y - 0.06);
    }
    addBall(ball){
        this.balls.push(ball);
    }
    addCue(data){
        this.cue = new CueStickBody(data);
    }
    resetCueToStart(){
        const cueData = BallData.find(b => b.isCue);
        const cue = this.balls.find(b => b.isCue);
        if(!cue || !cueData) return;
        cue.position.set(cueData.startPos.x, cueData.startPos.y, cueData.startPos.z);
        cue.velocity.set(0,0,0);
        cue.acceleration.set(0,0,0);
        cue.angularVelocity.set(0,0,0);
        cue.angularAcceleration.set(0,0,0);
        cue.isPocketed = false;
        cue.isActive = true;
        cue._cueGroundHandled = false;
    }
    step(dt){
        this.motionSystem.update(this.balls, dt);
        this.cushionCollisionSystem.update(this.balls);
        this.ballBallCollisionSystem.update(this.balls);
        this.pocketCollisionSystem.update(this.balls, this.tablePhysics);
        this.groundCollisionSystem.update(this.balls);
        const cueBall = this.balls.find(b => b.isCue);
        if (cueBall) {
            const minY = (TableData.position.y - 0.06) + cueBall.radius;
            if (cueBall.position.y <= minY + 1e-5) { 
                this.resetCueToStart();
            }
        }
    }
    getBallCount() {
        return this.balls.length;
    }
    getPocketedCount() {
        let count = 0;
        for(const ball of this.balls){
            if(ball.isPocketed && !ball.isCue) count++;
        }
        return count;
    }
    getSnapshot(){
        return{
            balls: this.balls.map(ball => ball.toSnapshot()),
            cue: this.cue?.toSnapshot() ?? null
        };
    }
}
