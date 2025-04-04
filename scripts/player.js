import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

// player with pointer lock api

export class Player {
  camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 200);
  controls = new PointerLockControls(this.camera, document.body);
  constructor(scene) {
    this.camera.position.set(64, 16, 64);
    scene.add(this.camera);
  }
}
