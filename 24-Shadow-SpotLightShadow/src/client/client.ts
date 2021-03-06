import * as THREE from 'three';
import { Geometry } from 'three/examples/jsm/deprecated/Geometry';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'three/examples/jsm/libs/stats.module';
import { GUI } from 'three/examples/jsm/libs/dat.gui.module';

const scene: THREE.Scene = new THREE.Scene();
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

const light = new THREE.SpotLight();
light.castShadow = true;
light.shadow.mapSize.width = 512;
light.shadow.mapSize.height = 512;
light.shadow.camera.near = 0.5;
light.shadow.camera.far = 100;
scene.add(light);

//const helper = new THREE.SpotLightHelper(light);
const helper = new THREE.CameraHelper(light.shadow.camera);
scene.add(helper);

const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
//renderer.shadowMap.type = THREE.BasicShadowMap  Standard Shadow map最基本的shadow map，即从光源处渲染场景深度到shadow map中，计算shadow时将pixel深度值z与light projection space下的深度值d作比较
//renderer.shadowMap.type = THREE.PCFShadowMap PCF的基本原理是在像素周围区域内多次采样并进行深度值比较，然后对结果进行加权平均
//renderer.shadowMap.type = THREE.VSMShadowMap Variance Shadow MapVSM由Donnelly和Lauritzen于2006年提出[4]，它用一种基于统计的方法来计算shadow。核心原理是，将shadow map看成深度的分布F，Donnelly和Lauritzen证明了当shadow receiver为平面时，shadow的值等于F的切比雪夫不等式的上界

document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

const planeGeometry: THREE.PlaneGeometry = new THREE.PlaneGeometry(100, 20);
const plane: THREE.Mesh = new THREE.Mesh(
  planeGeometry,
  new THREE.MeshPhongMaterial()
);
plane.rotateX(-Math.PI / 2);
plane.position.y = -1.75;
plane.receiveShadow = true;
scene.add(plane);

const torusGeometry: THREE.TorusGeometry[] = [
  new THREE.TorusGeometry(),
  new THREE.TorusGeometry(),
  new THREE.TorusGeometry(),
  new THREE.TorusGeometry(),
  new THREE.TorusGeometry(),
];

const material: (
  | THREE.MeshBasicMaterial
  | THREE.MeshLambertMaterial
  | THREE.MeshPhongMaterial
  | THREE.MeshPhysicalMaterial
  | THREE.MeshToonMaterial
)[] = [
  new THREE.MeshBasicMaterial(),
  new THREE.MeshLambertMaterial(),
  new THREE.MeshPhongMaterial(),
  new THREE.MeshPhysicalMaterial({}),
  new THREE.MeshToonMaterial(),
];

const torus: THREE.Mesh[] = [
  new THREE.Mesh(torusGeometry[0], material[0]),
  new THREE.Mesh(torusGeometry[1], material[1]),
  new THREE.Mesh(torusGeometry[2], material[2]),
  new THREE.Mesh(torusGeometry[3], material[3]),
  new THREE.Mesh(torusGeometry[4], material[4]),
];

const texture = new THREE.TextureLoader().load('images/grid_25.jpg');
material[0].map = texture;
material[1].map = texture;
material[2].map = texture;
material[3].map = texture;
material[4].map = texture;

torus[0].position.x = -8;
torus[1].position.x = -4;
torus[2].position.x = 0;
torus[3].position.x = 4;
torus[4].position.x = 8;

torus[0].castShadow = true;
torus[1].castShadow = true;
torus[2].castShadow = true;
torus[3].castShadow = true;
torus[4].castShadow = true;

torus[0].receiveShadow = true;
torus[1].receiveShadow = true;
torus[2].receiveShadow = true;
torus[3].receiveShadow = true;
torus[4].receiveShadow = true;

scene.add(torus[0]);
scene.add(torus[1]);
scene.add(torus[2]);
scene.add(torus[3]);
scene.add(torus[4]);

camera.position.z = 7;

window.addEventListener('resize', onWindowResize, false);
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  render();
}

const stats = Stats();
document.body.appendChild(stats.dom);

var data = {
  color: light.color.getHex(),
  mapsEnabled: true,
  shadowMapSizeWidth: 512,
  shadowMapSizeHeight: 512,
};
const gui = new GUI();
const lightFolder = gui.addFolder('THREE.Light');
lightFolder.addColor(data, 'color').onChange(() => {
  light.color.setHex(Number(data.color.toString().replace('#', '0x')));
});
lightFolder.add(light, 'intensity', 0, 1, 0.01);
lightFolder.open();

const spotLightFolder = gui.addFolder('THREE.SpotLight');
spotLightFolder.add(light, 'distance', 0, 100, 0.01);
spotLightFolder.add(light, 'decay', 0, 4, 0.1);
spotLightFolder.add(light, 'angle', 0, 1, 0.1);
spotLightFolder.add(light, 'penumbra', 0, 1, 0.1);
spotLightFolder
  .add(light.shadow.camera, 'near', 0.1, 100)
  .onChange(() => light.shadow.camera.updateProjectionMatrix());
spotLightFolder
  .add(light.shadow.camera, 'far', 0.1, 100)
  .onChange(() => light.shadow.camera.updateProjectionMatrix());
spotLightFolder
  .add(data, 'shadowMapSizeWidth', [256, 512, 1024, 2048, 4096])
  .onChange(() => updateShadowMapSize());
spotLightFolder
  .add(data, 'shadowMapSizeHeight', [256, 512, 1024, 2048, 4096])
  .onChange(() => updateShadowMapSize());
spotLightFolder.add(light.position, 'x', -50, 50, 0.01);
spotLightFolder.add(light.position, 'y', -50, 50, 0.01);
spotLightFolder.add(light.position, 'z', -50, 50, 0.01);
spotLightFolder.open();

function updateShadowMapSize() {
  light.shadow.mapSize.width = data.shadowMapSizeWidth;
  light.shadow.mapSize.height = data.shadowMapSizeHeight;
  (light.shadow.map as any) = null;
}

const meshesFolder = gui.addFolder('Meshes');
meshesFolder.add(data, 'mapsEnabled').onChange(() => {
  material.forEach((m) => {
    if (data.mapsEnabled) {
      m.map = texture;
    } else {
      m.map = null;
    }
    m.needsUpdate = true;
  });
});

var animate = function () {
  requestAnimationFrame(animate);

  helper.update();

  torus.forEach((t) => {
    t.rotation.y += 0.01;
  });

  render();

  stats.update();
};

function render() {
  renderer.render(scene, camera);
}
animate();
