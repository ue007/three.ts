
import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'three/examples/jsm/libs/stats.module';
import { GUI } from 'three/examples/jsm/libs/dat.gui.module';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';


const scene: THREE.Scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);

const light = new THREE.DirectionalLight(0xffffff, 2.0);
light.position.set(100, 100, 100);
light.castShadow = true;
light.shadow.mapSize.width = 4096;
light.shadow.mapSize.height = 4096;
light.shadow.camera.near = 0.5;
light.shadow.camera.far = 500;
light.shadow.camera.left = -500;
light.shadow.camera.right = 500;
light.shadow.camera.top = 500;
light.shadow.camera.bottom = -500;
scene.add(light);

const helper = new THREE.CameraHelper(light.shadow.camera);
scene.add(helper);

const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  200
);
camera.position.x = 4;
camera.position.y = 5;
camera.position.z = 7;

const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({
  antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.dampingFactor = 0.05;
controls.enableDamping = true;
controls.screenSpacePanning = false;

const raycaster = new THREE.Raycaster();
const sceneMeshes = new Array();

const material = new THREE.MeshPhongMaterial({ color: 0x567d46 });
const planeGeometry: THREE.PlaneGeometry = new THREE.PlaneGeometry(1, 1);
planeGeometry.scale(500, 500, 1);
const planeMesh: THREE.Mesh = new THREE.Mesh(planeGeometry, material);
planeMesh.rotateX(-Math.PI / 2);
planeMesh.receiveShadow = true;
scene.add(planeMesh);
sceneMeshes.push(planeMesh);

let childObjectCount = 2; //how many child meshes are in the tree model. The trunk and leaves are different meshes
const treeCount = 1200; //this many trees are drawn
let treeCounter = 0;

const positions = new Array();
for (let i = 0; i < treeCount; i++) {
  positions.push({
    x: Math.random() * 400 - 200,
    y: 0,
    z: Math.random() * 400 - 200,
  });
}
const scales = new Array();
for (let i = 0; i < treeCount; i++) {
  scales.push({
    x: Math.random() * 2 + 1,
    y: Math.random() * 5 + 1,
    z: Math.random() * 2 + 1,
  });
}

const treesTypes = ['saplingTree', 'birchTreeWithLeaves', 'tree1WithLeaves'];
treesTypes.forEach((treeType) => {
  let treeHighDetail = new THREE.Object3D();
  let treeMediumDetail = new THREE.Object3D();
  let treeLowDetail = new THREE.Object3D();

  const glTFLoader = new GLTFLoader();
  glTFLoader.load('models/' + treeType + '_high.glb', (gltf) => {
    for (let j = 0; j < childObjectCount; j++) {
      const geometry = (gltf.scene.children[0].children[j] as THREE.Mesh)
        .geometry;
      treeHighDetail.add(
        new THREE.Mesh(
          geometry,
          (gltf.scene.children[0].children[j] as THREE.Mesh).material
        )
      );
    }
    treeHighDetail.traverse(function (child) {
      if ((<THREE.Mesh>child).isMesh) {
        child.castShadow = true;
      }
    });

    glTFLoader.load('models/' + treeType + '_medium.glb', (gltf) => {
      for (let j = 0; j < childObjectCount; j++) {
        const geometry = (gltf.scene.children[0].children[j] as THREE.Mesh)
          .geometry;
        treeMediumDetail.add(
          new THREE.Mesh(
            geometry,
            (gltf.scene.children[0].children[j] as THREE.Mesh).material
          )
        );
      }
      treeMediumDetail.traverse((child) => {
        if ((<THREE.Mesh>child).isMesh) {
          child.castShadow = true;
        }
      });

      glTFLoader.load('models/' + treeType + '_low.glb', (gltf) => {
        for (let j = 0; j < childObjectCount; j++) {
          const geometry = (gltf.scene.children[0].children[j] as THREE.Mesh)
            .geometry;
          treeLowDetail.add(
            new THREE.Mesh(
              geometry,
              (gltf.scene.children[0].children[j] as THREE.Mesh).material
            )
          );
        }
        treeLowDetail.traverse(function (child) {
          if ((<THREE.Mesh>child).isMesh) {
            child.castShadow = true;
          }
        });

        for (let i = 0; i < treeCount / treesTypes.length; i++) {
          const lod = new THREE.LOD();
          let mesh = treeHighDetail.clone();
          mesh.scale.copy(scales[treeCounter]);
          lod.addLevel(mesh, 5);

          mesh = treeMediumDetail.clone();
          mesh.scale.copy(scales[treeCounter]);
          lod.addLevel(mesh, 10);

          mesh = treeLowDetail.clone();
          mesh.scale.copy(scales[treeCounter]);
          lod.addLevel(mesh, 30);

          lod.position.copy(positions[treeCounter]);
          scene.add(lod);

          treeCounter++;
        }
      });
    });
  });
});

window.addEventListener('resize', onWindowResize, false);
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  render();
}

renderer.domElement.addEventListener('dblclick', onDoubleClick, false);
function onDoubleClick(event: MouseEvent) {
  const mouse = {
    x: (event.clientX / renderer.domElement.clientWidth) * 2 - 1,
    y: -(event.clientY / renderer.domElement.clientHeight) * 2 + 1,
  };
  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(sceneMeshes, false);

  if (intersects.length > 0) {
    const p = intersects[0].point;
    new TWEEN.Tween(controls.target)
      .to(
        {
          x: p.x,
          y: p.y,
          z: p.z,
        },
        500
      )
      .easing(TWEEN.Easing.Cubic.Out)
      .start();
  }
}

const stats = Stats();
document.body.appendChild(stats.dom);

var data = {
  color: light.color.getHex(),
  shadowMapSizeWidth: 4096,
  shadowMapSizeHeight: 4096,
  mapsEnabled: true,
};
const gui = new GUI();
const lightFolder = gui.addFolder('THREE.Light');
lightFolder.addColor(data, 'color').onChange(() => {
  light.color.setHex(Number(data.color.toString().replace('#', '0x')));
});
lightFolder.add(light, 'intensity', 0, 2, 0.01);
lightFolder.open();

const directionalLightFolder = gui.addFolder('THREE.DirectionalLight');
directionalLightFolder
  .add(light.shadow.camera, 'left', -500, 1, 1)
  .onChange(() => light.shadow.camera.updateProjectionMatrix());
directionalLightFolder
  .add(light.shadow.camera, 'right', 1, 500, 1)
  .onChange(() => light.shadow.camera.updateProjectionMatrix());
directionalLightFolder
  .add(light.shadow.camera, 'top', 1, 500, 1)
  .onChange(() => light.shadow.camera.updateProjectionMatrix());
directionalLightFolder
  .add(light.shadow.camera, 'bottom', -500, -1, 1)
  .onChange(() => light.shadow.camera.updateProjectionMatrix());
directionalLightFolder
  .add(light.shadow.camera, 'near', 0.1, 500)
  .onChange(() => light.shadow.camera.updateProjectionMatrix());
directionalLightFolder
  .add(light.shadow.camera, 'far', 0.1, 500)
  .onChange(() => light.shadow.camera.updateProjectionMatrix());
directionalLightFolder
  .add(data, 'shadowMapSizeWidth', [256, 512, 1024, 2048, 4096])
  .onChange(() => updateShadowMapSize());
directionalLightFolder
  .add(data, 'shadowMapSizeHeight', [256, 512, 1024, 2048, 4096])
  .onChange(() => updateShadowMapSize());
directionalLightFolder.add(light.position, 'x', -50, 50, 0.01);
directionalLightFolder.add(light.position, 'y', -50, 50, 0.01);
directionalLightFolder.add(light.position, 'z', -50, 50, 0.01);
directionalLightFolder.open();

function updateShadowMapSize() {
  light.shadow.mapSize.width = data.shadowMapSizeWidth;
  light.shadow.mapSize.height = data.shadowMapSizeHeight;
  (light.shadow.map as any) = null;
}

var animate = function () {
  requestAnimationFrame(animate);

  controls.update();

  TWEEN.update();

  helper.update();

  render();

  stats.update();
};

function render() {
  renderer.render(scene, camera);
}
animate();
