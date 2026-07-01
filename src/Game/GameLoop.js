export class GameLoop {

    constructor({
        debugController,
        sandbox,
        physicsWorld,
        renderer,
        ballMeshMap,
        cueMeshFactory,
        state,
        hud
    }) {

        this.debugController = debugController;
        this.sandbox = sandbox;
        this.physicsWorld = physicsWorld;
        this.renderer = renderer;
        this.ballMeshMap = ballMeshMap;
        this.cueMeshFactory = cueMeshFactory;
        this.state = state;
        this.hud = hud;

        this.lastTime = performance.now();
        this._resetScheduled = false;
        this._resetTimeout = null;
        this.frame = this.frame.bind(this);
    }

    start() {
        requestAnimationFrame(this.frame);
    }

    frame(now) {

        const dt = Math.min(
            (now - this.lastTime) / 1000,
            0.016
        );

        this.lastTime = now;
        this.handleInput();
        this.physicsWorld.step(dt);
        this.updateState();
        this.render();
        this.handleReset();

        if (this.state.running)
            requestAnimationFrame(this.frame);
    }

    updateState() {

        const snapshot =this.physicsWorld.getSnapshot();

        this.state.lastSnapshot = snapshot;

  	 this.state.totalBalls =this.physicsWorld.getBallCount();

		this.state.pocketedBalls = this.physicsWorld.getPocketedCount();
    }

    render() {

        this.renderer.syncPhysicsSnapshot(
            this.state.lastSnapshot,
            this.ballMeshMap
        );

        this.renderer.syncCueSnapshot(
            this.state.lastSnapshot.cue,
            this.cueMeshFactory.cueMesh
        );

        this.hud.update(this.state);

        this.renderer.render();
    }

    handleReset() {

        if ( this.state.totalBalls > 0 &&this.state.totalBalls === this.state.pocketedBalls) {
            if (this._resetScheduled)
                return;

            this._resetScheduled = true;
            this.state.resetting = true;
            this._resetTimeout = setTimeout(() => {

                this.sandbox.reset();

                this.state.resetting = false;

                this._resetScheduled = false;

            },1500);

            return;
        }

        if (this._resetScheduled) {

            clearTimeout(this._resetTimeout);

            this._resetScheduled = false;

            this.state.resetting = false;
        }
    }

    handleInput() {

        this.debugController
            ?.keyboardInput
            ?.update?.();

        const c =
            this.debugController
            ?.getControlState?.();

        if (!c)
            return;

        if (c.reset) this.sandbox.reset();

        if (c.throwCue) this.sandbox.throwCueBall();

        if (c.shootRack) this.sandbox.shootAtRack();

        if (c.shootCushion) this.sandbox.shootAtCushion();

        if (c.explodeAll) this.sandbox.explodeAll();

        if (c.moveLeft) this.sandbox.moveLeft();

        if (c.moveRight) this.sandbox.moveRight();

        if (c.moveUp) this.sandbox.moveUp();

        if (c.moveDown) this.sandbox.moveDown();

        if (c.moveForward) this.sandbox.moveForward();

        if (c.moveBackward) this.sandbox.moveBackward();

        if (c.rotateUp) this.sandbox.rotateUp();

        if (c.rotateDown) this.sandbox.rotateDown();

        if (c.rotateLeft) this.sandbox.rotateLeft();

        if (c.rotateRight) this.sandbox.rotateRight();
    }
}