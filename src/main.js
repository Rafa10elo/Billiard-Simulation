import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

const scene = new THREE.Scene()
scene.background = new THREE.Color(0x222222)

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)
camera.position.set(0, 5,10 )

// loading the model
// loading yhe table 
const loader = new GLTFLoader()
loader.load(
  '/models/poolTable/pooltable.glb',
  (gltf) => {
    const model = gltf.scene;
    model.scale.set(1.0, 1.0, 1.0);
    model.position.set(0, 0, 0);
    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);

    const gridHelper = new THREE.GridHelper(20, 20);
    scene.add(gridHelper);
    model.traverse((child) => {
      if (child.isMesh) {
        child.castShadow  = true;
        child.receiveShadow = true;
      }
    });
    scene.add(model);
    console.log('success niggas',model);
  },
  (xhr) => {
     console.log((xhr.loaded / xhr.total * 100) + '% loaded');
  },
  (error) => {
    console.log(error);
  }
);

//loading the stick 
loader.load(
  '/models/cueStick/stick.glb',
  (gltf) => {
    const model = gltf.scene;
    model.scale.set(0.8, 0.8, 0.8);
    model.position.set(1, 0, 0);
    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);

    const gridHelper = new THREE.GridHelper(20, 20);
    scene.add(gridHelper);
    model.traverse((child) => {
      if (child.isMesh) {
        child.castShadow  = true;
        child.receiveShadow = true;
      }
    });
    scene.add(model);
    console.log('success niggas',model);
  },
  (xhr) => {
     console.log((xhr.loaded / xhr.total * 100) + '% loaded');
  },
  (error) => {
    console.log(error);
  }
);

// balls uploading 
const ballData =[
  {id:0 ,color: 0xffffff, isCue: true,startPos:{x: 0, y: 0.8, z: 0.7}},
  {id:1 ,color: 0xebdb34, isCue: false,startPos:{x: 0, y: 0.8, z: -0.8}},
  {id:2 ,color: 0xd69754, isCue: false,startPos:{x: 0.08, y: 0.8, z: -0.8}},
  {id:3 ,color: 0x7d5327, isCue: false,startPos:{x: 0.16, y: 0.8, z: -0.8}},
  {id:4 ,color: 0x690f0f, isCue: false,startPos:{x: -0.08, y: 0.8, z: -0.8}},
  {id:5 ,color: 0x6dcf83, isCue: false,startPos:{x: -0.16, y: 0.8, z: -0.8}},
  {id:6 ,color: 0x8442f5, isCue: false,startPos:{x: 0.04, y: 0.8, z: -0.72}},
  {id:7 ,color: 0xf54275, isCue: false,startPos:{x: -0.04, y: 0.8, z: -0.72}},
  {id:8 ,color: 0x4287f5, isCue: false,startPos:{x: 0.12, y: 0.8, z: -0.72}},
  {id:9 ,color: 0x3fa831, isCue: false,startPos:{x: -0.12, y: 0.8, z: -0.72}},
  {id:10 ,color: 0x262626, isCue: false,startPos:{x: 0, y: 0.8, z: -0.64}},
  {id:11 ,color: 0xb86c2a, isCue: false,startPos:{x: 0.08, y: 0.8, z: -0.64}},
  {id:12 ,color: 0x952ab8, isCue: false,startPos:{x: -0.08, y: 0.8, z: -0.64}},
  {id:13 ,color: 0xb82a3f, isCue: false,startPos:{x:0.04, y: 0.8, z: -0.56}},
  {id:14 ,color: 0x2a44b8, isCue: false,startPos:{x:-0.04, y: 0.8, z: -0.56}},
  {id:15 ,color: 0xebdb34, isCue: false,startPos:{x: 0, y: 0.8, z: -0.49}},
]
// attributes change velocity radius and material and shit (:
const balls = [];
const radius = 0.04;
const ballGeo = new THREE.SphereGeometry(radius, 32, 32);
ballData.forEach((data) => {
  const ballMat = new THREE.MeshStandardMaterial({
    color: data.color,
    roughness: 0.1,
    metalness: 0.2,
    });
    const  ballMesh = new THREE.Mesh(ballGeo, ballMat);
    ballMesh.position.set(data.startPos.x, data.startPos.y, data.startPos.z);
    ballMesh.castShadow = true;
    ballMesh.receiveShadow = true;
    scene.add(ballMesh);
    balls.push({id: data.id, mesh: ballMesh, isCue: data.isCue , velocity : new THREE.Vector3(0, 0, 0)});
});
// axes helper and grid helper optional we can delete them later 
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

const gridHelper = new THREE.GridHelper(20, 20);
scene.add(gridHelper);

// random lights def want to change them later
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
dirLight.position.set(5, 10, 7);
scene.add(dirLight);

//renderer and orbit control maybe we need to change the tone mapping and shadow map it is just for now
const renderer = new THREE.WebGLRenderer({antialias : true})
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setPixelRatio(window.devicePixelRatio);

document.getElementById('poolTable').appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true


function animate() {
  requestAnimationFrame(animate)
  controls.update()
  renderer.render(scene, camera)
}

animate()