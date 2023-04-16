import * as THREE from 'three';
import { WEBGL } from './webgl.js';

const initRenderer = () => {
  const renderer = new THREE.WebGLRenderer({
    // alpha: true,
    antialias: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  return renderer;
};

const makeTorus = (texture) => {
  const geometry = new THREE.TorusGeometry(0.3, 0.15, 16, 40);
  const material = new THREE.MeshStandardMaterial({
    color: 0x0019f4,
    metalness: 1,
    roughness: 0,
    // transparent: true,
    // opacity: 0.9,
  });
  const torus = new THREE.Mesh(geometry, material);
  return torus;
};

const moveXGeometry = (geo, x) => {
  geo.position.x = x;
  return geo;
};

if (WEBGL.isWebGLAvailable()) {
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 3;

  const renderer = initRenderer();

  const pointLight = new THREE.PointLight(0xffffff, 1);
  pointLight.position.set(0, 2, 12);
  scene.add(pointLight);

  const toruses = [-2, -1, 0, 1, 2].map((x) => [makeTorus(), x]).map(([torus, x]) => moveXGeometry(torus, x));

  toruses.forEach((torus) => {
    scene.add(torus);
  });

  function render(time) {
    time *= 0.001;

    toruses.forEach((torus) => {
      torus.rotation.y = time;
    });

    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);

  // 반응형 처리
  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  window.addEventListener('resize', onWindowResize);
} else {
  const warning = WEBGL.getWebGLErrorMessage();
  document.body.appendChild(warning);
}
