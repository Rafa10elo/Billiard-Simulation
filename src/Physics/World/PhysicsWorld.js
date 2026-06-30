import { PHYSICS_CONSTANTS } from '../Constants/PhysicsConstants.js';
import { BallMotionSystem } from '../Systems/BallMotionSystem.js';
import { BallBallCollisionSystem } from '../Systems/BallBallCollisionSystem.js';
import { CushionCollisionSystem } from '../Systems/CushionCollisionSystem.js';
import { PocketCollisionSystem } from '../Systems/PocketCollisionSystem.js';
import { TablePhysics } from './TablePhysics.js';
import { TableData } from '../../Data/TableData.js';
import {CueStickBody} from '../Bodies/CueStickBody.js';

export class PhysicsWorld {

    constructor() {

        this.balls = [];
        this.cue = null;
        this.config = PHYSICS_CONSTANTS;
        this.tablePhysics = new TablePhysics(TableData);
        this.motionSystem =new BallMotionSystem(this.config, this.tablePhysics);
        this.ballBallCollisionSystem =new BallBallCollisionSystem(this.config);
        this.cushionCollisionSystem =new CushionCollisionSystem(this.config, this.tablePhysics);
        this.pocketCollisionSystem =new PocketCollisionSystem();
    }

    addCue(CueData){
        this.cue= new CueStickBody(CueData)
    }

    addBall(ball) {
		this.balls.push(ball);
	}

    step(dt) {

        this.motionSystem.update(this.balls,dt );
        this.cushionCollisionSystem.update(this.balls);
        this.ballBallCollisionSystem.update(this.balls);
        this.pocketCollisionSystem.update(this.balls, this.tablePhysics, dt );
  
    }

    getSnapshot() {
        return {
            balls: this.balls.map((ball) => ball.toSnapshot()),
            cue: this.cue?.toSnapshot() ?? null 
        };
    }

}