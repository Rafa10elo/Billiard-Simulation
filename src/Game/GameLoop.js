import { CueMeshController } from '../Renderer/Sync/CueMeshController.js';

export class GameLoop {

    constructor({
        debugController,
        sandbox,
        physicsWorld,
        renderer,
        ballMeshMap,
        cueMeshFactory,
        state,
        hud,
        cueShotController,
        cueShotSystem,
        cueMeshController,
        shotInputPanel
    }) {
        this.debugController = debugController;
        this.sandbox = sandbox;
        this.physicsWorld = physicsWorld;
        this.renderer = renderer;
        this.ballMeshMap = ballMeshMap;
        this.cueMeshFactory = cueMeshFactory;
        this.state = state;
        this.hud = hud;
        this.cueShotController = cueShotController;
        this.cueShotSystem = cueShotSystem;
        this.lastTime = performance.now();
        this._resetScheduled = false;
        this._resetTimeout = null;
        this.frame = this.frame.bind(this);
        this.cueMeshController = cueMeshController;
        this.shotInputPanel = shotInputPanel;

        this.state.lastSnapshot = this.physicsWorld.getSnapshot();
    }

    start() {
        requestAnimationFrame(this.frame);
    }

    frame(now) {
        let dt = Math.min(
            (now - this.lastTime) / 1000,
            0.016
        );

        this.lastTime = now;
        const sliderEl = document.getElementById('timeScale');
        const timeScale = sliderEl ? parseFloat(sliderEl.value) : 1.0;
        dt = dt * timeScale;
        this.handleInput();
        this.physicsWorld.step(dt);
        this.updateState();
        this.render();
        this.handleReset();

        if (this.state.running)
            requestAnimationFrame(this.frame);
    }

    updateState() {
        const snapshot = this.physicsWorld.getSnapshot();
        this.state.lastSnapshot = snapshot;
        this.state.totalBalls = this.physicsWorld.getBallCount();
        this.state.pocketedBalls = this.physicsWorld.getPocketedCount();
    }

    render() {
        const currentSnapshot = this.physicsWorld.getSnapshot();

        this.renderer.syncPhysicsSnapshot(
            currentSnapshot,
            this.ballMeshMap
        );

        const cueBall = this.physicsWorld.balls.find(b => b.isCue);
        this.cueMeshController.update(cueBall, this.cueShotController);

        this.hud.update(this.state);
        this.renderer.render();
    }

    handleReset() {
        if (this.state.totalBalls > 0 && this.state.totalBalls === this.state.pocketedBalls) {
            if (this._resetScheduled)
                return;

            this._resetScheduled = true;
            this.state.resetting = true;
            this._resetTimeout = setTimeout(() => {
                this.sandbox.reset();
                this.state.resetting = false;
                this._resetScheduled = false;
            }, 1500);

            return;
        }

        if (this._resetScheduled) {
            clearTimeout(this._resetTimeout);
            this._resetScheduled = false;
            this.state.resetting = false;
        }
    }

    handleInput() {
        this.debugController?.keyboardInput?.update?.();
        const debug = this.debugController?.getControlState?.();
        const shouldShoot = this.cueShotController.update();
        if (this.shotInputPanel) {
            this.shotInputPanel.updateFields({
                angleX: Math.sin(this.cueShotController.yaw) * Math.cos(this.cueShotController.pitch),
                angely: Math.sin(this.cueShotController.pitch),
                angleZ: Math.cos(this.cueShotController.yaw) * Math.cos(this.cueShotController.pitch),
                power: this.cueShotController.power,
                offsetX: this.cueShotController.offsetX,
                offsetY: this.cueShotController.offsetY
            });
        }
        const cueBall = this.physicsWorld.balls.find(b => b.isCue);

        if (shouldShoot && cueBall) {
            this.cueShotSystem.strike(
                cueBall,
                this.cueShotController.consumeShot()
            );
        }

        if (!debug)
            return;

        if (debug.reset) this.sandbox.reset();
        if (debug.throwCue) this.sandbox.throwCueBall();
        if (debug.shootRack) this.sandbox.shootAtRack();
        if (debug.shootCushion) this.sandbox.shootAtCushion();
        if (debug.explodeAll) this.sandbox.explodeAll();
        if (debug.shootTopSpin) this.sandbox.shootTopSpin();

        const isBallMoving = cueBall && (
            Math.abs(cueBall.velocity.x) > 0.001 || 
            Math.abs(cueBall.velocity.y) > 0.001 || 
            Math.abs(cueBall.velocity.z) > 0.001
        );

        if (isBallMoving || this.cueShotController.mode !== "FREE") {
            return;
        }

        if (debug.moveLeft) this.sandbox.moveLeft();
        if (debug.moveRight) this.sandbox.moveRight();
        if (debug.moveUp) this.sandbox.moveUp();
        if (debug.moveDown) this.sandbox.moveDown();
        if (debug.moveForward) this.sandbox.moveForward();
        if (debug.moveBackward) this.sandbox.moveBackward();
        if (debug.rotateUp) this.sandbox.rotateUp();
        if (debug.rotateDown) this.sandbox.rotateDown();
        if (debug.rotateLeft) this.sandbox.rotateLeft();
        if (debug.rotateRight) this.sandbox.rotateRight();
        if (debug.aimAt) this.sandbox.aimAtCue();
    }
}
