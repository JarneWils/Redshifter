import * as THREE from 'three';

const textureLoader = new THREE.TextureLoader();

function loadTexture(path) {
  const texture = textureLoader.load(path);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.NearestFilter;
  texture.magFilter = THREE.NearestFilter;
  return texture;
}

const textures = {
  grassTop: loadTexture('blocks/grass-top3.0.jpg'),
  grassSide: loadTexture('blocks/grass-side3.0.jpg'),
  dirt: loadTexture('blocks/dirt3.0.jpg'),
  stone: loadTexture('blocks/stone.jpg'),
  coalOre: loadTexture('blocks/coalOre.jpg'),
};

const material = new THREE.MeshLambertMaterial();

export const blocks = {
  empty: {
    id: 0,
    name: 'Empty',
  },
  grass: {
    id: 1,
    name: 'Grass',
    color: 'rgb(225, 85, 20)',
    material: [
      new THREE.MeshLambertMaterial({ map: textures.grassSide }), //rechts
      new THREE.MeshLambertMaterial({ map: textures.grassSide }), //links
      new THREE.MeshLambertMaterial({ map: textures.grassTop }), //op
      new THREE.MeshLambertMaterial({ map: textures.dirt }), // onder
      new THREE.MeshLambertMaterial({ map: textures.grassSide }), //voor
      new THREE.MeshLambertMaterial({ map: textures.grassSide }), //achter
    ],
  },
  dirt: {
    id: 2,
    name: 'Dirt',
    color: 'rgb(170, 60, 10)',
    material: new THREE.MeshLambertMaterial({ map: textures.dirt }),
  },
  stone: {
    id: 3,
    name: 'Stone',
    color: 'rgb(226, 109, 50)',
    scale: { x: 30, y: 30, z: 30 },
    scarcity: 0.3,
    material: new THREE.MeshLambertMaterial({ map: textures.stone }),
  },
  coalOre: {
    id: 4,
    name: 'Coal Ore',
    color: 'rgb(255, 195, 165)',
    scale: { x: 30, y: 30, z: 30 },
    scarcity: 0.7,
    material: new THREE.MeshLambertMaterial({ map: textures.coalOre }),
  },
};

export const resources = [blocks.stone, blocks.coalOre];
