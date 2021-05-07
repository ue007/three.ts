import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'three/examples/jsm/libs/stats.module';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
const scene: THREE.Scene = new THREE.Scene();
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

var light = new THREE.SpotLight();
light.position.set(5, 5, 5);
scene.add(light);

const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 2;

const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer();
//renderer.physicallyCorrectLights = true
//renderer.shadowMap.enabled = true
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

const loader = new GLTFLoader();
loader.load(
  'models/monkey.glb',
  function (gltf) {
    // gltf.scene.traverse(function (child) {
    //     if ((<THREE.Mesh>child).isMesh) {
    //         let m = <THREE.Mesh>child
    //         m.receiveShadow = true
    //         m.castShadow = true
    //     }
    //     if ((<THREE.Light>child).isLight) {
    //         let l = <THREE.Light>child
    //         l.castShadow = true
    //         //l.shadow.bias = -.003
    //         l.shadow.mapSize.width = 2048
    //         l.shadow.mapSize.height = 2048
    //     }
    // })
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
