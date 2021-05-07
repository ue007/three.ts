import * as THREE from '/build/three.module.js';
import { OrbitControls } from '/jsm/controls/OrbitControls';
import { FBXLoader } from '/jsm/loaders/FBXLoader';
import { GLTFLoader } from '/jsm/loaders/GLTFLoader';
import Stats from '/jsm/libs/stats.module';
import { GUI } from '/jsm/libs/dat.gui.module';
const scene: THREE.Scene = new THREE.Scene();
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

var light = new THREE.SpotLight();
light.position.set(12.5, 12.5, 12.5);
light.castShadow = true;
light.shadow.mapSize.width = 1024;
light.shadow.mapSize.height = 1024;
scene.add(light);

const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.x = 15;
camera.position.y = 15;
camera.position.z = 15;

const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

const pickableObjects: THREE.Mesh[] = new Array();
let intersectedObject: THREE.Object3D | null;
let originalMaterials: { [id: string]: THREE.Material | THREE.Material[] } = {};
const highlightedMaterial = new THREE.MeshBasicMaterial({
  wireframe: true,
  color: 0x00ff00,
});

const loader = new GLTFLoader();
loader.load(
  'models/simplescene.glb',
  function (gltf) {
    gltf.scene.traverse(function (child) {
      if ((<THREE.Mesh>child).isMesh) {
        let m = <THREE.Mesh>child;
        //the sphere and plane will not be mouse picked. THe plane will receive shadows while everything else casts shadows.
        switch (m.name) {
          case 'Plane':
            m.receiveShadow = true;
            break;
          case 'Sphere':
            m.castShadow = true;
            break;
          default:
            m.castShadow = true;
            pickableObjects.push(m);
            //store reference to original materials for later
            originalMaterials[m.name] = (m as THREE.Mesh).material;
        }
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

const raycaster = new THREE.Raycaster();
let intersects: THREE.Intersection[];

document.addEventListener('mousemove', onDocumentMouseMove, false);
function onDocumentMouseMove(event: MouseEvent) {
  raycaster.setFromCamera(
    {
      x: (event.clientX / renderer.domElement.clientWidth) * 2 - 1,
      y: -(event.clientY / renderer.domElement.clientHeight) * 2 + 1,
    },
    camera
  );
  intersects = raycaster.intersectObjects(pickableObjects, false);

  if (intersects.length > 0) {
    intersectedObject = intersects[0].object;
  } else {
    intersectedObject = null;
  }
  pickableObjects.forEach((o: THREE.Mesh, i) => {
    if (intersectedObject && intersectedObject.name === o.name) {
      pickableObjects[i].material = highlightedMaterial;
    } else {
      pickableObjects[i].material = originalMaterials[o.name];
    }
  });
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
