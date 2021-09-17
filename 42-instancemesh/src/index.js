import * as THREE from 'three/build/three.module.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
const scene = new THREE.Scene();
const bottomScene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 50);
const renderer = new THREE.WebGLRenderer();
renderer.autoClear = false;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x444444);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

let selectedObjects = [];
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const controls = new OrbitControls(camera, renderer.domElement);
function initScene() {
    const keyLight = new THREE.DirectionalLight(0xffffff, 0.5);
    keyLight.position.set(5, 10, 5);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const gridHelper = new THREE.GridHelper(16, 16, 0x111111);
    scene.add(gridHelper);

    const axesHelper = new THREE.AxesHelper(2);
    axesHelper.position.set(-6, 0, 6);
    scene.add(axesHelper);

    const cameraLookTarget = new THREE.Vector3(0, 0, 0);
    camera.position.set(0, 5, 10);
    camera.lookAt(cameraLookTarget);

    // postprocessing

    const loader = new GLTFLoader();
    loader.load(
        'models/monkey.glb',
        function (gltf) {
            const model = gltf.scene;
            let geometry, material;
            // const _stemMesh = gltf.scene.getObjectByName('Stem');
            const defaultTransform = new THREE.Matrix4();

            gltf.scene.traverse(function (child) {
                if (child.isMesh) {
                    var instancedMesh = new THREE.InstancedMesh(child.geometry, child.material, 10, true, true, true);
                    instancedMesh.setMatrixAt(0, defaultTransform.makeTranslation(1, 1, 1));
                    instancedMesh.setMatrixAt(1, defaultTransform.makeTranslation(4, 1, 1));
                    instancedMesh.setMatrixAt(2, defaultTransform.makeTranslation(7, 1, 1));
                    instancedMesh.setMatrixAt(3, defaultTransform.makeTranslation(10, 1, 1));
                    scene.add(instancedMesh);
                }
            });
            // model.traverse((node) => {
            //     if (node.isMesh) {
            //         geometry = node.geometry;
            //     }
            // });

            // //material that the geometry will use
            // let material = new THREE.MeshPhongMaterial({
            //     color: 0xff0000,
            // });

            // //the instance group
            // let cluster = new THREE.InstancedMesh(
            //     geometry,
            //     material,
            //     10000, //instance count
            //     false, //is it dynamic
            //     false, //does it have color
            //     true //uniform scale
            // );

            // var _v3 = new THREE.Vector3();
            // var _q = new THREE.Quaternion();

            // for (var i; i < 10000; i++) {
            //     cluster.setQuaternionAt(i, _q);
            //     cluster.setPositionAt(i, v3.set(Math.random() * 1000, Math.random() * 1000, Math.random() * 1000));
            //     cluster.setScaleAt(i, v3.set(Math.random(), Math.random(), Math.random()));
            // }
            // scene.add(cluster);
        },
        (xhr) => {
            console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
        },
        (error) => {
            console.log(error);
        }
    );
}

initScene();
function update() {
    controls.update();
}

function handleAnimationFrame() {
    window.requestAnimationFrame(handleAnimationFrame);
    update();
    render();
}

handleAnimationFrame();

function handleResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
}

function debounce(callback, wait) {
    let timeoutId = null;
    return (...args) => {
        window.clearTimeout(timeoutId);
        timeoutId = window.setTimeout(() => {
            callback.apply(null, args);
        }, wait);
    };
}

window.addEventListener('resize', debounce(handleResize, 300), false);
function render() {
    renderer.render(scene, camera);
}
