import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { World } from './world';
import { createUI } from './ui';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
import { Player } from './player';
// Globals
const skyColor = 'rgb(10, 25, 50)';

const stats = new Stats();
document.body.appendChild(stats.dom);

// Renderer setup
const renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(skyColor);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement); // Of gebruik document.getElementById("app") als je de div bedoelt

// Camera setup
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight);
camera.position.set(32, 16, 32);
camera.lookAt(0, 0, 0);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(64, 0, 64);
controls.update();

// Scene setup
const scene = new THREE.Scene();
const world = new World();
world.generate();
scene.add(world);

// const player = new Player(scene);
// scene.add(player.camera);

// Fog
let fog = true;
if (fog) {
  scene.fog = new THREE.Fog(skyColor, 1, 64);
}

// Lights
function setupLights() {
  const sun = new THREE.DirectionalLight(0xffffff, 4);

  sun.position.set(64, 64, 64);
  const target = new THREE.Object3D();
  target.position.set(0, 0, 0);
  scene.add(target);

  sun.target = target;
  sun.castShadow = true;
  sun.shadow.camera.left = -100;
  sun.shadow.camera.right = 100;
  sun.shadow.camera.top = 100;
  sun.shadow.camera.bottom = -100;
  sun.shadow.camera.near = 0.5;
  sun.shadow.camera.far = 256;
  sun.shadow.bias = 0.0001;
  sun.shadow.normalBias = 0.01;
  scene.add(sun);

  const shadowHelper = new THREE.CameraHelper(sun.shadow.camera);
  scene.add(shadowHelper);

  const ambient = new THREE.AmbientLight(0xffffff, 1);
  scene.add(ambient);
}

// Renderer loop
function animate() {
  requestAnimationFrame(animate);
  stats.update();
  renderer.render(scene, camera);
}

// Resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  renderer.setSize(window.innerWidth, window.innerHeight);
});

setupLights();
createUI(world);
animate();
