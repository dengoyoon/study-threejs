import * as THREE from 'three';
import { WEBGL } from './webgl.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const initRenderer = () => {
  const renderer = new THREE.WebGLRenderer({
    // alpha: true,
    antialias: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  document.body.appendChild(renderer.domElement);
  return renderer;
};

const initCamera = () => {
  const fov = 100;
  const aspect = window.innerWidth / window.innerHeight;
  const near = 0.1;
  const far = 100;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(20, 10, 0);
  camera.lookAt(new THREE.Vector3(0, 10, 0));
  return camera;
};

const initSpotLight = () => {
  const spotLight = new THREE.SpotLight(0x0000ff, 20);
  spotLight.position.set(-20, 60, 20);
  spotLight.angle = Math.PI / 8;
  spotLight.penumbra = 1;
  spotLight.decay = 2;
  spotLight.distance = 100;

  spotLight.castShadow = true;
  spotLight.shadow.mapSize.width = 4096;
  spotLight.shadow.mapSize.height = 4096;
  spotLight.shadow.camera.near = 10;
  spotLight.shadow.camera.far = 200;
  spotLight.shadow.bias = -0.0005;

  return spotLight;
};

if (!WEBGL.isWebGLAvailable()) {
  const warning = WEBGL.getWebGLErrorMessage();
  document.body.appendChild(warning);
}

const scene = new THREE.Scene();
const camera = initCamera();
const renderer = initRenderer();

const spotLight = initSpotLight();
const slHelper = new THREE.SpotLightHelper(spotLight, 0xffffff);
// scene.add(slHelper);
scene.add(spotLight);

let model;
new GLTFLoader().load('../static/model/girl-sculpture.glb', (gltf) => {
  model = gltf.scene;
  model.traverse((obj3d) => {
    obj3d.castShadow = true;
    obj3d.receiveShadow = true;
  });
  model.scale.set(0.6, 0.6, 0.6);
  scene.add(model);
});

const floor = new THREE.Mesh(new THREE.CircleGeometry(50, 64), new THREE.MeshPhongMaterial({ color: 0x454545 }));
floor.receiveShadow = true;
floor.rotation.x = -Math.PI / 2;
scene.add(floor);

requestAnimationFrame(render);

function render(time) {
  time *= 0.0006;

  if (model) model.rotation.y = time;

  renderer.render(scene, camera);
  requestAnimationFrame(render);
}

// 반응형 처리
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', onWindowResize);
