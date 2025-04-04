import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { resources } from './blocks.js';

export function createUI(world) {
  const gui = new GUI();

  gui.add(world.size, 'width', 8, 128, 1).name('width');
  gui.add(world.size, 'height', 8, 128, 1).name('height');

  const terrainFolder = gui.addFolder('Terrain');
  terrainFolder.add(world.params.terrain, 'scale', 1, 100, 1).name('scale');
  terrainFolder.add(world.params.terrain, 'magnitude', 0, 1, 0.01).name('magnitude');
  terrainFolder.add(world.params.terrain, 'offset', 0, 1, 0.01).name('offset');

  const resourcesFolder = gui.addFolder('Resources');
  resources.forEach(resource => {
    const resourceFolder = resourcesFolder.addFolder(resource.name);
    resourceFolder.add(resource, 'scarcity', 0, 1, 0.01).name('scarcity');

    const scaleFolder = resourceFolder.addFolder('Scale');
    scaleFolder.add(resource.scale, 'x', 10, 100, 1).name('x - scale');
    scaleFolder.add(resource.scale, 'y', 10, 100, 1).name('y - scale');
    scaleFolder.add(resource.scale, 'z', 10, 100, 1).name('z - scale');
  });

  gui.onChange(() => {
    world.generate();
  });

  return gui;
}
