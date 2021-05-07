import * as THREE from '/build/three.module.js';
import { OrbitControls } from '/jsm/controls/OrbitControls';
import { GLTFLoader } from '/jsm/loaders/GLTFLoader';
import { DRACOLoader } from '/jsm/loaders/DRACOLoader';
import Stats from '/jsm/libs/stats.module';

const scene: THREE.Scene = new THREE.Scene();
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 2;

const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer();
renderer.physicallyCorrectLights = true;
renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

var dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('/js/libs/draco/');
dracoLoader.setDecoderConfig({ type: 'js' });

const loader = new GLTFLoader();
loader.setDRACOLoader(dracoLoader);
loader.load(
  'models/monkey_compressed.glb',
  function (gltf) {
    gltf.scene.traverse(function (child) {
      if ((<THREE.Mesh>child).isMesh) {
        let m = <THREE.Mesh>child;
        m.receiveShadow = true;
        m.castShadow = true;
      }
      if ((<THREE.Light>child).isLight) {
        let l = <THREE.Light>child;
        l.castShadow = true;
        l.shadow.bias = -0.003;
        l.shadow.mapSize.width = 2048;
        l.shadow.mapSize.height = 2048;
      }
    });
    scene.add(gltf.scene);
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
