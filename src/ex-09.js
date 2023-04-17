import * as THREE from 'three';
import { WEBGL } from './webgl.js';

const initRenderer = () => {
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  renderer.shadowMap.enabled = true;
  return renderer;
};

const moveXGeometry = (geo, x) => {
  geo.position.x = x;
  return geo;
};

if (WEBGL.isWebGLAvailable()) {
  const scene = new THREE.Scene();

  const fov = 120; //시야각 혹은 화각
  const aspect = window.innerWidth / window.innerHeight; // 종횡비, 가로세로의 비율
  const near = 0.1; // 카메라의 시점이 시작되는 위치
  const far = 1000; // 카메라의 시점이 끝나는 위치
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(0, 1, 2); // 나보다 앞에 있으면 양수, 뒤에있으면 음수, 카메라의 위치
  camera.lookAt(new THREE.Vector3(0, 0, 0)); // 카메라가 0, 0, 0을 바라보게 함

  const renderer = initRenderer();

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // 그림자가 생기지 않는 빛
  // ambientLight.castShadow = true 그림자 안먹음
  // scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
  directionalLight.position.set(-1, 1, -1);
  directionalLight.castShadow = true;
  // directionalLight.shadow.mapSize.width = 2048; 그림자의 해상도 올려줌, 대신에 렌더링에 소요되는 리소스 상승
  // directionalLight.shadow.mapSize.height = 2048;
  scene.add(directionalLight);
  const dlHelper = new THREE.DirectionalLightHelper(directionalLight, 0.2, 0x0000ff); // 빛이 어디에서 나오는지 보여줌
  scene.add(dlHelper);

  const hemisphereLight = new THREE.HemisphereLight(0x0000ff, 0xff0000, 1); // 하늘의 색상과 바닥의 색상을 받는다?

  const pointLight = new THREE.PointLight(0xffffff, 1); // 전구를 위치시키는 느낌임
  const plHelper = new THREE.PointLightHelper(pointLight, 0.1);
  pointLight.position.set(-2, 0.5, 0.5);
  // scene.add(plHelper);

  const rectLight = new THREE.RectAreaLight(0xffffff, 2, 1, 1);
  rectLight.position.set(0.5, 0.5, 1);
  rectLight.lookAt(0, 0, 0);

  const spotLight = new THREE.SpotLight(0xffffff, 0.5); // 말그래도 공연장에서 쓰는 그 스포트라이트

  // scene.add(spotLight);

  // const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
  const geometry = new THREE.SphereGeometry(0.5, 32, 16);
  // const geometry = new THREE.IcosahedronGeometry(0.5, 0);
  // const geometry = new THREE.ConeGeometry(0.4, 0.7, 6);
  const material = new THREE.MeshStandardMaterial({
    color: 0x004fff,
  });

  const cube = new THREE.Mesh(geometry, material);
  cube.rotation.y = 10;
  scene.add(cube);
  cube.castShadow = true;

  const planeGeometry = new THREE.PlaneGeometry(30, 30, 1, 1);
  const planeMaterial = new THREE.MeshStandardMaterial({
    color: 0xeeeeee,
  });
  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.rotation.x = -0.5 * Math.PI;
  plane.position.y = -0.5;
  scene.add(plane);
  plane.receiveShadow = true;

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
