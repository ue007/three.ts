import * as THREE from '/build/three.module.js';
import { OrbitControls } from '/jsm/controls/OrbitControls';
import { STLLoader } from '/jsm/loaders/STLLoader';
import Stats from '/jsm/libs/stats.module';
const scene: THREE.Scene = new THREE.Scene();

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

var light = new THREE.DirectionalLight();
light.position.set(2.5, 7.5, 15);
scene.add(light);

const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 3;

const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer();
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const envTexture = new THREE.CubeTextureLoader().load([
  'images/px_25.jpg',
  'images/nx_25.jpg',
  'images/py_25.jpg',
  'images/ny_25.jpg',
  'images/pz_25.jpg',
  'images/nz_25.jpg',
]);
envTexture.mapping = THREE.CubeReflectionMapping;

const material = new THREE.MeshPhysicalMaterial({
  color: 0xb2ffc8,
  envMap: envTexture,
  metalness: 0.25,
  roughness: 0.1,
  transparent: true,
  transmission: 1.0,
  side: THREE.DoubleSide,
  clearcoat: 1.0,
  clearcoatRoughness: 0.25,
});

const loader = new STLLoader();
loader.load(
  'models/example.stl',
  function (geometry) {
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
  },
  (xhr) => {
    console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
  },
  (error) => {
    console.log(error);
  }
);

window.addEventListener('resize', onWindowResize, false);
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  render();
}

const stats = Stats();
document.body.appendChild(stats.dom);

var animate = function () {
  requestAnimationFrame(animate);

  controls.update();

  render();

  stats.update();
};

function render() {
  renderer.render(scene, camera);
}
animate();
