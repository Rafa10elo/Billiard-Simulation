import { BallData } from '../Data/BallData.js';
import { BallBody } from '../Physics/Bodies/BallBody.js';
import { PhysicsWorld } from '../Physics/World/PhysicsWorld.js';
import { Renderer } from '../Renderer/Renderer.js';
import { BallMeshFactory } from '../Renderer/Meshes/BallMeshFactory.js';
import { TableMeshFactory } from '../Renderer/Meshes/TableMeshFactory.js';
import { CueMeshFactory } from '../Renderer/Meshes/CueMeshFactory.js';
import { ModelLoader } from '../Assets/ModelLoader.js';
import { KeyboardInput } from '../Input/KeyboardInput.js';
import { MouseInput } from '../Input/MouseInput.js';
import { DebugPhysicsController } from '../Input/DebugPhysicsController.js';
import { PhysicsSandbox } from './PhysicsSandbox.js';
import { GameLoop } from './GameLoop.js';
import { GameState } from './GameState.js';
import { CushionDebugFactory } from '../Renderer/Meshes/CushionDebugFactory.js';

export class PoolGame {

	constructor(container) {
		this.container = container;
		this.state = new GameState();
	}

	async start() {
		this.renderer = new Renderer(this.container);
		this.modelLoader = new ModelLoader();
		this.keyboardInput = new KeyboardInput();
		this.mouseInput = new MouseInput(this.renderer.getDomElement());
		this.debugController = new DebugPhysicsController(this.keyboardInput);
		this.physicsWorld = new PhysicsWorld();
		BallData.forEach((ballData) => {
			this.physicsWorld.addBall(new BallBody(ballData));
		});

		this.physicsSandbox = new PhysicsSandbox(this.physicsWorld);
		this.physicsSandbox.reset();

		this.ballMeshFactory = new BallMeshFactory(this.renderer.getScene());
		this.ballMeshMap = this.ballMeshFactory.createBallMeshes(BallData);

		this.tableMeshFactory = new TableMeshFactory(this.renderer.getScene(), this.modelLoader);
		this.cueMeshFactory = new CueMeshFactory(this.renderer.getScene(), this.modelLoader);
		await Promise.all([
			this.tableMeshFactory.createTableMesh(),
			this.cueMeshFactory.createCueMesh()
		]);
		//debug only
		this.cushionDebugFactory = new CushionDebugFactory(this.renderer.getScene());
		this.cushionDebugFactory.createDebugLines(this.physicsWorld.tablePhysics.cushions);
		//
		this.renderer.syncPhysicsSnapshot(
			this.physicsWorld.getSnapshot(),
			this.ballMeshMap
		);

		this.loop = new GameLoop({
			debugController: this.debugController,
			sandbox: this.physicsSandbox,
			physicsWorld: this.physicsWorld,
			renderer: this.renderer,
			ballMeshMap: this.ballMeshMap,
			state: this.state
		});

		this.loop.start();
	}

}
