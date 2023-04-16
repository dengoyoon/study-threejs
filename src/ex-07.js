import * as THREE from 'three';
import { WEBGL } from './webgl.js';

const initRenderer = () => {
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  return renderer;
};

const moveXGeometry = (geo, x) => {
  geo.position.x = x;
  return geo;
};

if (WEBGL.isWebGLAvailable()) {
  const scene = new THREE.Scene();

  /*
  광각 렌즈 : 35mm이하
  표준 렌즈 : 50mm
  망원 렌즈 : 85mm이상

  즉,
  가까운 사물 : 망원렌즈의 화각 8 ~ 28도
  인간의 눈과 비슷하게 : 표준렌즈의 화각 47도
  넒은 범위 : 광각 렌즈 화각 63도 이상
  */
  const fov = 80; //시야각 혹은 화각
  const aspect = window.innerWidth / window.innerHeight; // 종횡비, 가로세로의 비율
  const near = 0.1; // 카메라의 시점이 시작되는 위치
  const far = 1000; // 카메라의 시점이 끝나는 위치
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(1, 2, 1); // 나보다 앞에 있으면 양수, 뒤에있으면 음수, 카메라의 위치
  camera.lookAt(new THREE.Vector3(0, 0, 0)); // 카메라가 0, 0, 0을 바라보게 함

  const renderer = initRenderer();

  const pointLight = new THREE.PointLight(0xffffbb, 1);
  pointLight.position.set(0, 2, 12);
  scene.add(pointLight);

  const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
  const material = new THREE.MeshStandardMaterial({
    color: 0xff7f00,
  });

  const cube = new THREE.Mesh(geometry, material);
  cube.rotation.y = 10;
  scene.add(cube);

  const planeGeometry = new THREE.PlaneGeometry(30, 30, 1, 1);
  const planeMaterial = new THREE.MeshStandardMaterial({
    color: 0xeeeeee,
  });
  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.rotation.x = -0.5 * Math.PI;
  plane.position.y = -0.5;
  scene.add(plane);

  function render(time) {
    time *= 0.001;

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
