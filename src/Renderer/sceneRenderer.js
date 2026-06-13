import * as THREE from 'three' ;

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import { BallData } from '../usedData/ballsData.js';
import { Ball } from '../World/ball.js';
import { Table } from '../World/table.js';
import { Cue } from '../World/cue.js';   

import { PhysicsManagement } from '../Physics/physicsManagement.js';

export class SceneRenderer{
    constructor(container){
        this.container = container;

        this.sceneControls();
        this.lights();
        this.worldinit();
        this.resize();

        this.physicsManagement = new PhysicsManagement(this.balls);
        this.clock = new THREE.Clock();

        this.animate = this.animate.bind(this);
        this.animate();
    }
    //everything about the renderer and the camera
    sceneControls(){
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x999999);
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth/window.innerHeight ,
            0.1,
            1000 
        );
        this.camera.position.set(0, 3, 2);

        this.renderer = new THREE.WebGLRenderer({antialias: true});
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.outputColorSpace= THREE.SRGBColorSpace;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.25;
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.container.appendChild(this.renderer.domElement);

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;

        this.gltfLoader = new GLTFLoader();
    }

    lights(){
        this.ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
        this.dirLight.position.set(5, 10, 7);
        this.dirLight.castShadow = true;

        this.scene.add(this.ambientLight);
        this.scene.add(this.dirLight);
    }
    // adding the table and balls to the scene 
    worldinit(){
        this.table = new Table(this.scene, this.gltfLoader);
        this.cue = new Cue(this.scene, this.gltfLoader);

        this.balls = [];
        const ballGeo = new THREE.SphereGeometry(0.04, 32, 32);

        BallData.forEach((data) =>{
            const ball = new Ball(this.scene, data , ballGeo);
            this.balls.push(ball);
        });
    }
    resize(){
        window.addEventListener('resize', () =>{
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }
    animate(){
        requestAnimationFrame(this.animate);
        const deltaTime = Math.min(this.clock.getDelta(), 0.1);
        this.controls.update();
        this.physicsManagement.update(deltaTime);
        this.renderer.render(this.scene, this.camera);
    }

}