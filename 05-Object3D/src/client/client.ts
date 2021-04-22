import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'three/examples/jsm/libs/stats.module';
import { GUI } from 'three/examples/jsm/libs/dat.gui.module';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.x = -2;
camera.position.y = 4;
camera.position.z = 5;
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(7, 0, 0);
var light1 = new THREE.PointLight();
light1.position.set(10, 10, 10);
scene.add(light1);
var light2 = new THREE.PointLight();
light2.position.set(-10, 10, 10);
scene.add(light2);

// father
const father = new THREE.Mesh(
  new THREE.SphereBufferGeometry(),
  new THREE.MeshPhongMaterial({ color: 0xff0000 })
);
father.position.set(0, 0, 0);
scene.add(father);
father.add(new THREE.AxesHelper(5));

// myself
const myself = new THREE.Mesh(
  new THREE.SphereBufferGeometry(),
  new THREE.MeshPhongMaterial({ color: 0x00ff00 })
);
myself.position.set(4, 0, 0);
father.add(myself);
myself.add(new THREE.AxesHelper(5));

// son
const son = new THREE.Mesh(
  new THREE.SphereBufferGeometry(),
  new THREE.MeshPhongMaterial({ color: 0x0000ff })
);
son.position.set(4, 0, 0);
myself.add(son);
son.add(new THREE.AxesHelper(5));

window.addEventListener('resize', onWindowResize, false);
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  render();
}

// gui
const gui = new GUI();
const fatherFolder = gui.addFolder('父亲');
fatherFolder.add(father.position, 'x', 0, 10, 0.01).name('X Position');
fatherFolder.add(father.rotation, 'x', 0, Math.PI * 2, 0.01).name('X Rotation');
fatherFolder.add(father.scale, 'x', 0, 2, 0.01).name('X Scale');
fatherFolder.open();
const myselfFolder = gui.addFolder('我');
myselfFolder.add(myself.position, 'x', 0, 10, 0.01).name('X Position');
myselfFolder.add(myself.rotation, 'x', 0, Math.PI * 2, 0.01).name('X Rotation');
myselfFolder.add(myself.scale, 'x', 0, 2, 0.01).name('X Scale');
myselfFolder.open();
const sonFolder = gui.addFolder('儿子');
sonFolder.add(son.position, 'x', 0, 10, 0.01).name('X Position');
sonFolder.add(son.rotation, 'x', 0, Math.PI * 2, 0.01).name('X Rotation');
sonFolder.add(son.scale, 'x', 0, 2, 0.01).name('X Scale');
sonFolder.open();

// stats
const stats = Stats();
document.body.appendChild(stats.dom);
const debug = document.getElementById('debug1');
var animate = function () {
  requestAnimationFrame(animate);
  controls.update();
  render();
  const fatherWorldPosition = new THREE.Vector3();
  father.getWorldPosition(fatherWorldPosition);
  const myselfWorldPosition = new THREE.Vector3();
  myself.getWorldPosition(myselfWorldPosition);
  const sonWorldPosition = new THREE.Vector3();
  son.getWorldPosition(sonWorldPosition);
  if (debug) {
    debug.innerText =
      'Red\n' +
      'Local Pos X : ' +
      father.position.x.toFixed(2) +
      '\n' +
      'World Pos X : ' +
      fatherWorldPosition.x.toFixed(2) +
      '\n' +
      '\nGreen\n' +
      'Local Pos X : ' +
      myself.position.x.toFixed(2) +
      '\n' +
      'World Pos X : ' +
      myselfWorldPosition.x.toFixed(2) +
      '\n' +
      '\nBlue\n' +
      'Local Pos X : ' +
      son.position.x.toFixed(2) +
      '\n' +
      'World Pos X : ' +
      sonWorldPosition.x.toFixed(2) +
      '\n';
  }
  stats.update();
};
function render() {
  renderer.render(scene, camera);
}
animate();
