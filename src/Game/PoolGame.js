import { BallData } from '../Data/BallData.js';
import { BallBody } from '../Physics/Bodies/BallBody.js';
import { CueData, TableData } from '../Data/TableData.js';
import { PhysicsWorld } from '../Physics/World/PhysicsWorld.js';
import { Renderer } from '../Renderer/Renderer.js';
import { BallMeshFactory } from '../Renderer/Meshes/BallMeshFactory.js';
import { TableMeshFactory } from '../Renderer/Meshes/TableMeshFactory.js';
import { CueMeshFactory } from '../Renderer/Meshes/CueMeshFactory.js';
import { BarMeshFactory } from '../Renderer/Meshes/BarMeshFactory.js';
import { ModelLoader } from '../Assets/ModelLoader.js';
import { KeyboardInput } from '../Input/KeyboardInput.js';
import { MouseInput } from '../Input/MouseInput.js';
import { DebugPhysicsController } from '../Input/DebugPhysicsController.js';
import { PhysicsSandbox } from './PhysicsSandbox.js';
import { GameLoop } from './GameLoop.js';
import { GameState } from './GameState.js';
import { GameHUD } from '../UI/GameHUD.js';
import { PocketVisualizer } from '../Physics/Utils/PocketVisualizer.js';
import { CushionVisualizer } from '../Physics/Utils/CushionVisualizer.js';
import {PHYSICS_CONSTANTS} from '../Physics/Constants/PhysicsConstants.js';

import { WoodVisualizer } from '../Physics/Utils/WoodVisualizer.js';

import { Scene } from 'three';
import { ShotInputPanel } from '../Input/ShotInputPanel.js';
import { CueShotSystem } from './CueShotSystem .js';
import { CueShotController } from '../Input/CueShotController.js';
import { CueMeshController } from '../Renderer/Sync/CueMeshController.js';


export class PoolGame {
	constructor(container) {
		this.container = container;
		this.state = new GameState();
	}
	async start() {
		this.renderer = new Renderer(this.container);
		this.modelLoader = new ModelLoader();
		this.keyboardInput = new KeyboardInput();
		this.cueShotController =new CueShotController(this.keyboardInput);
		this.mouseInput = new MouseInput(this.renderer.getDomElement());
		this.debugController = new DebugPhysicsController(this.keyboardInput);


		this.container.style.position = 'relative';
		this.uiContainer = document.createElement('div');
		this.uiContainer.id = 'shot-ui';
		this.uiContainer.style.position = 'absolute';
		this.uiContainer.style.top = '16px';
		this.uiContainer.style.left = '16px';
		this.uiContainer.style.zIndex = '10';
		this.container.appendChild(this.uiContainer);

		this.physicsWorld = new PhysicsWorld();
		this.config = PHYSICS_CONSTANTS;
		BallData.forEach((ballData) => {
			this.physicsWorld.addBall(new BallBody(this.config,ballData));
		});
		this.physicsWorld.addCue(CueData)
		this.physicsSandbox = new PhysicsSandbox(this.physicsWorld);
		this.physicsSandbox.reset();
		this.ballMeshFactory = new BallMeshFactory(this.renderer.getScene());
		this.ballMeshMap = this.ballMeshFactory.createBallMeshes(BallData);
		this.tableMeshFactory = new TableMeshFactory(this.renderer.getScene(), this.modelLoader);
		this.cueMeshFactory = new CueMeshFactory(this.renderer.getScene(), this.modelLoader);
		this.barMeshFactory = new BarMeshFactory(this.renderer.getScene(), this.modelLoader);
		// const pocketVisualizer = new PocketVisualizer(this.renderer.getScene());
		// const cusionVisualizer= new CushionVisualizer(this.renderer.getScene(),TableData);
		// const woodVisualizer = new WoodVisualizer(this.renderer.getScene(), TableData);
		
		// pocketVisualizer.setVisible(true);
		await Promise.all([
			this.tableMeshFactory.createTableMesh(),
			this.cueMeshFactory.createCueMesh(),
			this.barMeshFactory.createBarMesh()
		]);

		this.cueMeshController = new CueMeshController(this.cueMeshFactory.cueMesh);

		this.renderer.syncPhysicsSnapshot(
			this.physicsWorld.getSnapshot(),
			this.ballMeshMap
		);
		this.hud = new GameHUD(this.container);
				this.cueShotSystem = new CueShotSystem();

		this.loop = new GameLoop({
    debugController: this.debugController,
    sandbox: this.physicsSandbox,
    physicsWorld: this.physicsWorld,
    renderer: this.renderer,
    ballMeshMap: this.ballMeshMap,
    cueMeshFactory: this.cueMeshFactory,
    state: this.state,
    hud: this.hud,

    cueShotController: this.cueShotController,
    cueShotSystem: this.cueShotSystem,
    cueMeshController: this.cueMeshController
});

		this.shotInputPanel = new ShotInputPanel(this.uiContainer, (params) => {
			const cueBall = this.physicsWorld.balls.find(b => b.isCue);
			if (!cueBall) return;

			this.cueShotSystem.strike(cueBall, params);
		});

		this.loop.start();
	}
}
