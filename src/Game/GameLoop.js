export class GameLoop {

	constructor({ debugController, sandbox, physicsWorld, renderer, ballMeshMap, cueMeshFactory,state }) {
		this.debugController = debugController;
		this.sandbox = sandbox;
		this.physicsWorld = physicsWorld;
		this.renderer = renderer;
		this.ballMeshMap = ballMeshMap;
		this.cueMeshFactory = cueMeshFactory;
		this.state = state;
		this.lastTime = performance.now();
		this.frame = this.frame.bind(this);
	}


	start() {
		requestAnimationFrame(this.frame);
	}

	frame(now) {
		const deltaTime = Math.min((now - this.lastTime) / 1000, 0.016);
		this.lastTime = now;

		if (this.debugController && typeof this.debugController.keyboardInput?.update === 'function') {
			this.debugController.keyboardInput.update();
		}

		const controlState = this.debugController && typeof this.debugController.getControlState === 'function'
			? this.debugController.getControlState(): null;

		if (controlState) {
			if (controlState.reset) {
				this.sandbox.reset();
			}

			if (controlState.throwCue) {
				this.sandbox.throwCueBall();
			}

			if (controlState.shootRack) {
				this.sandbox.shootAtRack();
			}

			if (controlState.shootCushion) {
				this.sandbox.shootAtCushion();
			}

			if (controlState.explodeAll) {
				this.sandbox.explodeAll();
			}
			if (controlState.moveLeft){
				this.sandbox.moveLeft();
			}
			if (controlState.moveRight){
				this.sandbox.moveRight();
			}
			if (controlState.moveUp){
				this.sandbox.moveUp();
			}
			if (controlState.moveDown){
				this.sandbox.moveDown();
			}
			if (controlState.moveForward){
				this.sandbox.moveForward();
			}
			if (controlState.moveBackward){
				this.sandbox.moveBackward();
			}
			if(controlState.rotateUp){
				this.sandbox.rotateUp();
			}
			if(controlState.rotateDown){
				this.sandbox.rotateDown();
			}
			if(controlState.rotateLeft){
				this.sandbox.rotateLeft();
			}
			if(controlState.rotateRight){
				this.sandbox.rotateRight();
			}
		}
		this.physicsWorld.step(deltaTime);
		const snapshot = this.physicsWorld.getSnapshot();

		this.state.lastSnapshot = snapshot;
		this.renderer.syncPhysicsSnapshot(snapshot, this.ballMeshMap);
		this.renderer.syncCueSnapshot(snapshot.cue, this.cueMeshFactory.cueMesh);
		
		this.renderer.render();

		if (this.state.running) {
			requestAnimationFrame(this.frame);
		}
	}

}
