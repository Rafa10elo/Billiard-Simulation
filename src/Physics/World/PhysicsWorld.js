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
import { WoodCollisionSystem } from '../Systems/WoodCollision.js';
export class PhysicsWorld {
    constructor(){
        this.balls = [];
        this.cue = null;
        this.config = PHYSICS_CONSTANTS;
        this.tablePhysics = new TablePhysics(TableData);
        this.motionSystem = new BallMotionSystem(this.config, this.tablePhysics, TableData.position.y+0.023 );
        this.ballBallCollisionSystem = new BallBallCollisionSystem(this.config);
        this.cushionCollisionSystem = new CushionCollisionSystem(this.config, this.tablePhysics);
        this.woodCollisionSystem = new WoodCollisionSystem(this.config, this.tablePhysics);
        this.pocketCollisionSystem = new PocketCollisionSystem();
        this.groundCollisionSystem = new GroundCollisionSystem(this.config, TableData.position.y +0.023);
        this.subSteps = 4;
        this.cueResetTimer = 0;
        this.isCueResetting = false;
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
        this.isCueResetting = false;
        this.cueResetTimer = 0;
    }

        step(dt) {
        const subDt = dt / this.subSteps;
        const cueBall = this.balls.find(b => b.isCue);

        for (let step = 0; step < this.subSteps; step++) {
            this.motionSystem.update(this.balls, subDt);
            this.cushionCollisionSystem.update(this.balls);
            this.ballBallCollisionSystem.update(this.balls);
            this.pocketCollisionSystem.update(this.balls, this.tablePhysics);
            this.groundCollisionSystem.update(this.balls);
            this.woodCollisionSystem.update(this.balls); 
        }

        if (cueBall) {
            if (!this.isCueResetting) {
                const tableSurfaceY = TableData.position.y ;
                const criticalDropY = tableSurfaceY + 0.2;
                if (cueBall.isPocketed || cueBall.position.y < criticalDropY) {
                    console.log("say meow and i'll reset the cue ball , jk i'll reset now");
                    this.isCueResetting = true;
                    this.cueResetTimer = 0;
                }
            } else {
                this.cueResetTimer += dt;
                if (this.cueResetTimer >= 1.0) {
                    this.resetCueToStart();
                }
            }
        }
    }


    getBallCount() {
        return this.balls.length-1;
    }
    updateConfig(newConfig) {
        Object.assign(this.config, newConfig);
        for (const ball of this.balls) {
            this.motionSystem.gravity = this.config.gravity;
            ball.mass = this.config.mass;
            ball.mu_k = this.config.mu_k;
            ball.mu_r = this.config.mu_r;
            ball.mu_sp = this.config.mu_sp;
            ball.restitution = this.config.restitution;
        }
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
