import * as THREE from 'three/build/three.module.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

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

let composer = new EffectComposer(renderer),
    effectFXAA,
    outlinePass1,
    outlinePass2;
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

    const group = new THREE.Group();
    scene.add(group);
    const geometry = new THREE.SphereGeometry(3, 48, 24);

    for (let i = 0; i < 20; i++) {
        const material = new THREE.MeshLambertMaterial();
        material.color.setHSL(Math.random(), 1.0, 0.3);

        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.x = Math.random() * 4 - 2;
        mesh.position.y = Math.random() * 4 - 2;
        mesh.position.z = Math.random() * 4 - 2;
        mesh.receiveShadow = true;
        mesh.castShadow = true;
        mesh.scale.multiplyScalar(Math.random() * 0.3 + 0.1);
        group.add(mesh);
    }
}

function initBottomScene() {
    const keyLight = new THREE.DirectionalLight(0xffffff, 0.5);
    keyLight.position.set(5, 10, 5);
    keyLight.castShadow = true;
    bottomScene.add(keyLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    bottomScene.add(ambientLight);

    const gridHelper = new THREE.GridHelper(16, 16, 0x111111);
    bottomScene.add(gridHelper);

    const axesHelper = new THREE.AxesHelper(2);
    axesHelper.position.set(-6, 0, 6);
    bottomScene.add(axesHelper);

    const cameraLookTarget = new THREE.Vector3(0, 0, 0);
    camera.position.set(0, 5, 10);
    camera.lookAt(cameraLookTarget);

    // postprocessing

    const group = new THREE.Group();
    bottomScene.add(group);
    const geometry = new THREE.SphereGeometry(3, 48, 24);

    for (let i = 0; i < 20; i++) {
        const material = new THREE.MeshLambertMaterial();
        material.color.setHSL(Math.random(), 1.0, 0.3);

        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.x = 10 + Math.random() * 4 - 2;
        mesh.position.y = Math.random() * 4 - 2;
        mesh.position.z = Math.random() * 4 - 2;
        mesh.receiveShadow = true;
        mesh.castShadow = true;
        mesh.scale.multiplyScalar(Math.random() * 0.3 + 0.1);
        group.add(mesh);
    }
}

initScene();
initBottomScene();
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
    // renderer.render(scene, camera);
    // renderer.render(bottomScene, camera);
    composer.render();
}

const renderPass = new RenderPass(scene, camera);
renderPass.clear = true;
renderPass.renderToScreen = false;
composer.addPass(renderPass);

outlinePass1 = new OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), scene, camera);
outlinePass1.renderToScreen = false;
outlinePass1.clear = false;
composer.addPass(outlinePass1);

const renderPass2 = new RenderPass(bottomScene, camera);
renderPass2.clear = false;
renderPass2.renderToScreen = false;
composer.addPass(renderPass2);

outlinePass2 = new OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), bottomScene, camera);
outlinePass2.renderToScreen = false;
outlinePass2.clear = false;
composer.addPass(outlinePass2);

effectFXAA = new ShaderPass(FXAAShader);
effectFXAA.uniforms['resolution'].value.set(1 / window.innerWidth, 1 / window.innerHeight);
effectFXAA.renderToScreen = true;
effectFXAA.readColorBuffer = true;
composer.addPass(effectFXAA);

renderer.domElement.style.touchAction = 'none';
renderer.domElement.addEventListener('pointermove', onPointerMove);

function onPointerMove(event) {
    if (event.isPrimary === false) return;

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    checkIntersection();
}

function addSelectedObject(object) {
    selectedObjects = [];
    selectedObjects.push(object);
}

function checkIntersection() {
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObject(scene, true);

    if (intersects.length > 0) {
        const selectedObject = intersects[0].object;
        addSelectedObject(selectedObject);
        outlinePass1.selectedObjects = selectedObjects;
    } else {
        // outlinePass1.selectedObjects = [];
    }

    const intersects2 = raycaster.intersectObject(bottomScene, true);

    if (intersects2.length > 0) {
        const selectedObject = intersects2[0].object;
        addSelectedObject(selectedObject);
        outlinePass2.selectedObjects = selectedObjects;
    } else {
        // outlinePass2.selectedObjects = [];
    }
}
