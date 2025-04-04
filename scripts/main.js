import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { World } from './world';
import { createUI } from './ui';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
// Globals
const skyColor = 'rgb(10, 25, 50)';

const stats = new Stats();
document.body.appendChild(stats.dom);

// Renderer setup
const renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(skyColor);
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
// Fog
scene.fog = new THREE.Fog(skyColor, 1, 64);

// Lights
function setupLights() {
  const light1 = new THREE.DirectionalLight({ color: 'rgb(255,255,255)' }, 3);
  light1.position.set(1, 1, 1);
  scene.add(light1);

  const light2 = new THREE.DirectionalLight({ color: 'rgb(255,255,255)' }, 2);
  light2.position.set(-1, 1, -0.5);
  scene.add(light2);

  const ambient = new THREE.AmbientLight({ color: 'rgb(255,255,255)' }, 0.5);
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
