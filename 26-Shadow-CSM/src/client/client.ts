import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'three/examples/jsm/libs/stats.module';
import { GUI } from 'three/examples/jsm/libs/dat.gui.module';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { CSM } from 'three/examples/jsm/csm/CSM';
import { CSMHelper } from 'three/examples/jsm/csm/CSMHelper';

const scene: THREE.Scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);

const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.x = 4;
camera.position.y = 1;
camera.position.z = 7;

const csm = new CSM({
  maxFar: 1000,
  fade: true,
  far: camera.far,
  cascades: 4,
  shadowMapSize: 8192,
  lightDirection: new THREE.Vector3(-1, -1, 0),
  camera: camera,
  parent: scene,
  lightIntensity: 0.5,
});

console.log(csm);

const csmHelper = new CSMHelper(csm);
csmHelper.displayFrustum = true;
csmHelper.displayPlanes = true;
csmHelper.displayShadowBounds = true;
scene.add(csmHelper as any);

const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({
  antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.dampingFactor = 0.05;
controls.enableDamping = true;

const trees = ['birchTreeWithLeaves', 'saplingTree', 'tree1WithLeaves'];
const material = new THREE.MeshPhongMaterial({ color: 0x567d46 });

const mtlLoader = new MTLLoader();
trees.forEach((tree) => {
  mtlLoader.load(
    'models/' + tree + '.mtl',
    (materials) => {
      materials.preload();

      const objLoader: OBJLoader = new OBJLoader();
      objLoader.setMaterials(materials);
      objLoader.load(
        'models/' + tree + '.obj',
        (object) => {
          object.traverse(function (child) {
            if ((<THREE.Mesh>child).isMesh) {
              child.castShadow = true;
            }
          });
          for (let i = 0; i < 20; i++) {
            const copy = object.clone();
            copy.scale.multiplyScalar(Math.max(Math.random() / 50, 0.01));
            copy.rotateY(Math.random() * Math.PI * 2);
            copy.position.set(
              Math.random() * 20 - 10,
              0,
              Math.random() * 20 - 10
            );
            scene.add(copy);
          }
        },
        (xhr) => {
          console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
        },
        (error) => {
          console.log('An error happened');
        }
      );
    },
    (xhr) => {
      console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
    },
    (error) => {
      console.log('An error happened');
    }
  );
});

const planeGeometry: THREE.PlaneGeometry = new THREE.PlaneGeometry(25, 25);
const planeMesh: THREE.Mesh = new THREE.Mesh(planeGeometry, material);
planeMesh.rotateX(-Math.PI / 2);
planeMesh.receiveShadow = true;
scene.add(planeMesh);

window.addEventListener('resize', onWindowResize, false);
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  render();
}

const gui = new GUI();
const csmFolder = gui.addFolder('CSM');
csmFolder.add(csm.lightDirection, 'x', -1, 1, 0.01);
csmFolder.add(csm.lightDirection, 'y', -1, 1, 0.01);
csmFolder.add(csm.lightDirection, 'z', -1, 1, 0.01);
csmFolder.add(csm, 'lightNear', 1, 1000, 1).onChange(function (value) {
  for (var i = 0; i < csm.lights.length; i++) {
    csm.lights[i].shadow.camera.near = value;
    csm.lights[i].shadow.camera.updateProjectionMatrix();
  }
});
csmFolder.add(csm, 'lightFar', 1, 1000, 1).onChange(function (value) {
  for (var i = 0; i < csm.lights.length; i++) {
    csm.lights[i].shadow.camera.far = value;
    csm.lights[i].shadow.camera.updateProjectionMatrix();
  }
});
csmFolder.add(csm, 'lightIntensity', 0.1, 2, 0.1).onChange(function (value) {
  for (var i = 0; i < csm.lights.length; i++) {
    csm.lights[i].intensity = value;
  }
});
csmFolder.open();

const stats = Stats();
document.body.appendChild(stats.dom);

var animate = function () {
  requestAnimationFrame(animate);

  controls.update();

  csm.update();
  csmHelper.update();

  render();

  stats.update();
};

function render() {
  renderer.render(scene, camera);
}
animate();
