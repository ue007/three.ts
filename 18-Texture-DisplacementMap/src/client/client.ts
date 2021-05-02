import * as THREE from 'three';
import { Geometry } from 'three/examples/jsm/deprecated/Geometry';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'three/examples/jsm/libs/stats.module';
import { GUI } from 'three/examples/jsm/libs/dat.gui.module';

const scene: THREE.Scene = new THREE.Scene();
//scene.background = new THREE.Color(0xff0000)

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

const light = new THREE.PointLight(0xffffff, 2);
light.position.set(0, 5, 10);
scene.add(light);

const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.screenSpacePanning = true; //so that panning up and down doesn't zoom in/out
//controls.addEventListener('change', render)

const planeGeometry: THREE.PlaneGeometry = new THREE.PlaneGeometry(
  3.6,
  1.8,
  360,
  180
);

const material: THREE.MeshPhongMaterial = new THREE.MeshPhongMaterial();

//const texture = new THREE.TextureLoader().load("img/grid.png")
const texture = new THREE.TextureLoader().load(
  'images/worldColour.2700x1350.jpg'
);
material.map = texture;
// const envTexture = new THREE.CubeTextureLoader().load(["img/px_eso0932a.jpg", "img/nx_eso0932a.jpg", "img/py_eso0932a.jpg", "img/ny_eso0932a.jpg", "img/pz_eso0932a.jpg", "img/nz_eso0932a.jpg"])
// envTexture.mapping = THREE.CubeReflectionMapping
// material.envMap = envTexture

//const specularTexture = new THREE.TextureLoader().load("img/earthSpecular.jpg")
// material.specularMap = specularTexture

const displacementMap = new THREE.TextureLoader().load(
  'images/gebco_bathy.2700x1350_8bit.jpg'
);
material.displacementMap = displacementMap;

const plane: THREE.Mesh = new THREE.Mesh(planeGeometry, material);
scene.add(plane);

camera.position.z = 3;

window.addEventListener('resize', onWindowResize, false);
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  render();
}

const stats = Stats();
document.body.appendChild(stats.dom);

var options = {
  side: {
    FrontSide: THREE.FrontSide,
    BackSide: THREE.BackSide,
    DoubleSide: THREE.DoubleSide,
  },
};
const gui = new GUI();

const materialFolder = gui.addFolder('THREE.Material');
materialFolder.add(material, 'transparent');
materialFolder.add(material, 'opacity', 0, 1, 0.01);
materialFolder.add(material, 'depthTest');
materialFolder.add(material, 'depthWrite');
materialFolder
  .add(material, 'alphaTest', 0, 1, 0.01)
  .onChange(() => updateMaterial());
materialFolder.add(material, 'visible');
materialFolder
  .add(material, 'side', options.side)
  .onChange(() => updateMaterial());
//materialFolder.open()

var data = {
  color: material.color.getHex(),
  emissive: material.emissive.getHex(),
  specular: material.specular.getHex(),
};

var meshPhongMaterialFolder = gui.addFolder('THREE.meshPhongMaterialFolder');

meshPhongMaterialFolder.addColor(data, 'color').onChange(() => {
  material.color.setHex(Number(data.color.toString().replace('#', '0x')));
});
meshPhongMaterialFolder.addColor(data, 'emissive').onChange(() => {
  material.emissive.setHex(Number(data.emissive.toString().replace('#', '0x')));
});
meshPhongMaterialFolder.addColor(data, 'specular').onChange(() => {
  material.specular.setHex(Number(data.specular.toString().replace('#', '0x')));
});
meshPhongMaterialFolder.add(material, 'shininess', 0, 1024);
meshPhongMaterialFolder.add(material, 'wireframe');
meshPhongMaterialFolder
  .add(material, 'flatShading')
  .onChange(() => updateMaterial());
meshPhongMaterialFolder.add(material, 'reflectivity', 0, 1);
meshPhongMaterialFolder.add(material, 'refractionRatio', 0, 1);
meshPhongMaterialFolder.add(material, 'displacementScale', -1, 1, 0.01);
meshPhongMaterialFolder.add(material, 'displacementBias', -1, 1, 0.01);
meshPhongMaterialFolder.open();

var planeData = {
  width: 3.6,
  height: 1.8,
  widthSegments: 360,
  heightSegments: 180,
};
const planePropertiesFolder = gui.addFolder('PlaneGeometry');
//planePropertiesFolder.add(planeData, 'width', 1, 30).onChange(regeneratePlaneGeometry)
//planePropertiesFolder.add(planeData, 'height', 1, 30).onChange(regeneratePlaneGeometry)
planePropertiesFolder
  .add(planeData, 'widthSegments', 1, 360)
  .onChange(regeneratePlaneGeometry);
planePropertiesFolder
  .add(planeData, 'heightSegments', 1, 180)
  .onChange(regeneratePlaneGeometry);
planePropertiesFolder.open();

function regeneratePlaneGeometry() {
  let newGeometry = new THREE.PlaneGeometry(
    planeData.width,
    planeData.height,
    planeData.widthSegments,
    planeData.heightSegments
  );
  plane.geometry.dispose();
  plane.geometry = newGeometry;
}

function updateMaterial() {
  material.side = Number(material.side);
  material.needsUpdate = true;
}

var animate = function () {
  requestAnimationFrame(animate);

  render();

  stats.update();
};

function render() {
  renderer.render(scene, camera);
}
animate();
