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

if (WEBGL.isWebGLAvailable()) {
  const scene = new THREE.Scene();

  const fov = 75; //시야각 혹은 화각
  const aspect = window.innerWidth / window.innerHeight; // 종횡비, 가로세로의 비율
  const near = 0.1; // 카메라의 시점이 시작되는 위치
  const far = 100; // 카메라의 시점이 끝나는 위치
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(0, 0, 2); // 나보다 앞에 있으면 양수, 뒤에있으면 음수, 카메라의 위치
  camera.lookAt(new THREE.Vector3(0, 0, 0)); // 카메라가 0, 0, 0을 바라보게 함

  const renderer = initRenderer();

  // const pointLight = new THREE.PointLight(0xffffff, 1);
  // pointLight.position.set(0, 2, 12);
  // scene.add(pointLight);

  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(-1, 2, 4);
  scene.add(light);

  // const geometry = new THREE.SphereGeometry(0.3, 32, 16);
  // const material = new THREE.MeshStandardMaterial({
  //   color: 0x004fff,
  // });

  const loader = new THREE.FontLoader();
  loader.load('../static/font/NanumMyeongjo_Bold.json', (font) => {
    const geometry = new THREE.TextGeometry('3', {
      font: font,
      size: 0.6,
      height: 2,
      curveSegments: 1,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.06,
      bevelOffset: 0.003,
      bevelSegments: 1,
    }).center();

    const material = new THREE.MeshStandardMaterial({
      color: '#689F38',
      roughness: 0.3,
      metalness: 0.7,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
  });

  // const cube1 = new THREE.Mesh(geometry, material);
  // cube1.position.set(-1, 0, 0);
  // scene.add(cube1);

  // const planeGeometry = new THREE.PlaneGeometry(30, 30, 1, 1);
  // const planeMaterial = new THREE.MeshStandardMaterial({
  //   color: 0xeeeeee,
  // });
  // const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  // plane.rotation.x = -0.5 * Math.PI;
  // plane.position.y = -0.5;
  // scene.add(plane);

  function render(time) {
    time *= 0.001;

    // cube1.rotation.x = time;
    // cube1.rotation.y = time;

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
