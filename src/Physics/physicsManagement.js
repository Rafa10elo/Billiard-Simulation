import * as THREE from 'three';

import { Collision } from './collision.js';
import { WorldPhysics } from './worldPhysics.js';

export class PhysicsManagement {
    constructor(balls){
        this.balls = balls;

        const gravity = -9.81;
        const friction = 0.98;
        const surfaceY = 0.8;
        const restitution = 0.9;

        const tablebounds = {
            minX:-0.52 , maxX:0.52,
            minZ:-1.08 , maxZ:1.08 
        };
        this.WorldPhysics = new WorldPhysics(gravity, friction, surfaceY);
        this.Collision = new Collision(tablebounds, restitution);
    }
    update(deltaTime){
        this.WorldPhysics.addgravity(this.balls, deltaTime);
        this.Collision.allCollisions(this.balls);
    }
}
