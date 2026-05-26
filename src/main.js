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