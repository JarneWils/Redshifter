import * as THREE from 'three';
import { SimplexNoise } from 'three/examples/jsm/math/SimplexNoise.js';
import { blocks, resources } from './blocks.js';
import { RNG } from './rng.js';

const geometry = new THREE.BoxGeometry();

export class World extends THREE.Group {
  // Data
  /**
   * @type {{
   * id: number,
   * instanceId: number
   * }[][][]}
   */
  data = [];

  params = {
    terrain: {
      scale: 30,
      magnitude: 0.6,
      offset: 0.15,
    },
  };

  // Constructor
  constructor(size = { width: 128, height: 20 }) {
    super();
    this.size = size;
  }

  // Generates
  generate() {
    this.initializeTerrain();
    this.generateResources();
    this.generateTerrain();
    this.generateMeshes();
  }

  /**
   * Initialize the world terrain data
   */
  initializeTerrain() {
    this.data = [];
    for (let x = 0; x < this.size.width; x++) {
      const slice = [];
      for (let y = 0; y < this.size.height; y++) {
        const row = [];
        for (let z = 0; z < this.size.width; z++) {
          row.push({
            id: blocks.empty.id,
            instanceId: null,
          });
        }
        slice.push(row);
      }
      this.data.push(slice);
    }
  }

  /**
   * Generate the resources
   */
  generateResources() {
    const simplex = new SimplexNoise();
    resources.forEach(resource => {
      for (let x = 0; x < this.size.width; x++) {
        for (let y = 0; y < this.size.height; y++) {
          for (let z = 0; z < this.size.width; z++) {
            const value = simplex.noise3d(
              x / resource.scale.x,
              y / resource.scale.y,
              z / resource.scale.z
            );
            if (value > resource.scarcity) {
              this.setBlockId(x, y, z, resource.id);
            }
          }
        }
      }
    });
  }
  /**
   * Generate the world terrain data
   */
  generateTerrain() {
    const simplex = new SimplexNoise();

    for (let x = 0; x < this.size.width; x++) {
      for (let z = 0; z < this.size.width; z++) {
        // get the noise value
        const value = simplex.noise(x / this.params.terrain.scale, z / this.params.terrain.scale);

        // scale the noise value to the height of the world
        const scaledNoise = this.params.terrain.offset + this.params.terrain.magnitude * value;
        let height = Math.floor(this.size.height * scaledNoise);
        height = Math.max(0, Math.min(height, this.size.height - 1));

        for (let y = 0; y <= this.size.height; y++) {
          if (y < height && this.getBlock(x, y, z).id === blocks.empty.id) {
            this.setBlockId(x, y, z, blocks.dirt.id);
          } else if (y === height) {
            this.setBlockId(x, y, z, blocks.grass.id);
          } else if (y > height) {
            this.setBlockId(x, y, z, blocks.empty.id);
          }
        }
      }
    }
  }

  /**
   * Generates the 3D meshes from the world data
   */
  generateMeshes() {
    this.clear();

    const maxCount = this.size.width * this.size.height * this.size.width;

    const meshes = {};
    Object.values(blocks)
      .filter(blockType => blockType.id !== blocks.empty.id)
      .forEach(blockType => {
        const mesh = new THREE.InstancedMesh(geometry, blockType.material, maxCount);
        mesh.name = blockType.name;
        mesh.count = 0;
        meshes[blockType.id] = mesh;
      });

    const matrix = new THREE.Matrix4();
    for (let x = 0; x < this.size.width; x++) {
      for (let y = 0; y < this.size.height; y++) {
        for (let z = 0; z < this.size.width; z++) {
          const blockId = this.getBlock(x, y, z).id;

          if (blockId === blocks.empty.id) continue;

          const mesh = meshes[blockId];
          const instanceId = mesh.count;

          if (!this.isBlockObscured(x, y, z)) {
            matrix.setPosition(x + 0.5, y + 0.5, z + 0.5);
            mesh.setMatrixAt(instanceId, matrix);
            this.setBlockInstanceId(x, y, z, instanceId);
            mesh.count++;
          }
        }
      }
    }

    this.add(...Object.values(meshes));
  }

  /**
   * Get the data for the block at the given position
   * @param {number} x - The x position
   * @param {number} y - The y position
   * @param {number} z - The z position
   * @returns {{id: number, instanceId: number}}
   */

  getBlock(x, y, z) {
    if (this.inBounds(x, y, z)) {
      return this.data[x][y][z];
    } else {
      return null;
    }
  }

  /**
   *  Set the block id for the block at the given position
   * @param {number} x - The x position
   * @param {number} y - The y position
   * @param {number} z - The z position
   * @param {number} id - The block id
   */
  setBlockId(x, y, z, id) {
    if (this.inBounds(x, y, z)) {
      this.data[x][y][z].id = id;
    }
  }

  /**
   * Set the instance id for the block at the given position
   * @param {number} x - The x position
   * @param {number} y - The y position
   * @param {number} z - The z position
   * @param {number} instanceId - The instance id
   */
  setBlockInstanceId(x, y, z, instanceId) {
    if (this.inBounds(x, y, z)) {
      this.data[x][y][z].instanceId = instanceId;
    }
  }

  /**
   * Check if the given position is within the bounds of the world
   * @param {number} x - The x position
   * @param {number} y - The y position
   * @param {number} z - The z position
   * @returns {boolean}
   */
  inBounds(x, y, z) {
    if (
      x >= 0 &&
      x < this.size.width &&
      y >= 0 &&
      y < this.size.height &&
      z >= 0 &&
      z < this.size.width
    ) {
      return true;
    } else {
      return false;
    }
  }

  isBlockObscured(x, y, z) {
    // Get the block id's around the player
    const up = this.getBlock(x, y + 1, z)?.id ?? blocks.empty.id;
    const down = this.getBlock(x, y - 1, z)?.id ?? blocks.empty.id;
    const left = this.getBlock(x - 1, y, z)?.id ?? blocks.empty.id;
    const right = this.getBlock(x + 1, y, z)?.id ?? blocks.empty.id;
    const forward = this.getBlock(x, y, z + 1)?.id ?? blocks.empty.id;
    const back = this.getBlock(x, y, z - 1)?.id ?? blocks.empty.id;

    // If any of the blocks are empty, the block is not obscured
    if (
      up === blocks.empty.id ||
      down === blocks.empty.id ||
      left === blocks.empty.id ||
      right === blocks.empty.id ||
      forward === blocks.empty.id ||
      back === blocks.empty.id
    ) {
      return false;
    } else {
      return true;
    }
  }
}
