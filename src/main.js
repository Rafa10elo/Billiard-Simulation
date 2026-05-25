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
const loader = new GLTFLoader()
loader.load(
  '/models/scene.gltf',
  (gltf) => {
    const model = gltf.scene;
    model.scale.set(1.5, 1.5, 1.5);
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
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

const gridHelper = new THREE.GridHelper(20, 20);
scene.add(gridHelper);
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
dirLight.position.set(5, 10, 7);
scene.add(dirLight);

const renderer = new THREE.WebGLRenderer({antialias : true})
renderer.setSize(window.innerWidth, window.innerHeight)

document.getElementById('poolTable').appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true


function animate() {
  requestAnimationFrame(animate)
  controls.update()
  renderer.render(scene, camera)
}

animate()