import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import GUI from 'lil-gui';
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {RGBELoader} from "three/examples/jsm/loaders/RGBELoader";
import {EXRLoader} from "three/examples/jsm/loaders/EXRLoader";

/**
 * Loaders
 */
const gltfLoader = new GLTFLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();
const rgbeLoader = new RGBELoader();
// const exrLoader = new THREE.EXRLoader();
const textureLoader = new THREE.TextureLoader();

/**
 * Base
 */
// Debug
const gui = new GUI();

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

/**
 * Environment map
 */
scene.environmentIntensity = 4;
scene.backgroundBlurriness = 0;
scene.backgroundIntensity = 1;
// scene.backgroundRotation.x = 1;
// scene.environmentRotation.x = 2;

gui.add(scene, 'environmentIntensity').min(0).max(10).step(0.001).name('environment intensity');
gui.add(scene, 'backgroundBlurriness').min(0).max(1).step(0.001).name('background blurriness');
gui.add(scene, 'backgroundIntensity').min(0).max(10).step(0.001).name('background intensity');
gui.add(scene.backgroundRotation, 'x').min(0).max(Math.PI * 2).step(0.001).name('background rotation x');
gui.add(scene.backgroundRotation, 'y').min(0).max(Math.PI * 2).step(0.001).name('background rotation y');

// LDR cube texture
// const environmentMap = cubeTextureLoader.load([
//     '/environmentMaps/0/px.png',
//     '/environmentMaps/0/nx.png',
//     '/environmentMaps/0/py.png',
//     '/environmentMaps/0/ny.png',
//     '/environmentMaps/0/pz.png',
//     '/environmentMaps/0/nz.png'
// ]);
//
// scene.environment = environmentMap;
// scene.background = environmentMap;

// HDR cube texture
// rgbeLoader.load('/environmentMaps/0/2k.hdr', (environmentMap) => {
//     environmentMap.mapping = THREE.EquirectangularReflectionMapping;
//
//     scene.environment = environmentMap;
//     scene.background = environmentMap;
// });

// HDR equirectangular texture
// exrLoader.load('/environmentMaps/nvidiaCanvas-4k.exr', (environmentMap) => {
//     environmentMap.mapping = THREE.EquirectangularReflectionMapping;
//
//     scene.environment = environmentMap;
//     scene.background = environmentMap;
// });

// LDR equirectangular texture
const environmentMap = textureLoader.load('/environmentMaps/blockadesLabsSkybox/fantasy_lands_castles_at_night.jpg');
environmentMap.mapping = THREE.EquirectangularReflectionMapping;
environmentMap.colorSpace = THREE.SRGBColorSpace;

scene.environment = environmentMap;
scene.background = environmentMap;
/**
 * Torus Knot
 */
const torusKnot = new THREE.Mesh(
    new THREE.TorusKnotGeometry(1, 0.4, 100, 16),
    new THREE.MeshStandardMaterial({
        metalness: 1,
        roughness: 0.3,
        color: 0xaaaaaa
    })
);
torusKnot.position.x = -4;
torusKnot.position.y = 4;
scene.add(torusKnot);

/**
 * Models
 */
gltfLoader.load(
    'models/FlightHelmet/glTF/FlightHelmet.gltf',
    (gltf) =>
    {
        gltf.scene.scale.set(10, 10, 10);
        scene.add(gltf.scene);
    }
);

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.set(4, 5, 4);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.target.y = 3.5;
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();
const tick = () =>
{
    // Time
    const elapsedTime = clock.getElapsedTime();

    // Update controls
    controls.update();

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
}

tick();