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

  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 3;

  const renderer = initRenderer();

  const pointLight = new THREE.PointLight(0xffffff, 1);
  pointLight.position.set(0, 2, 12);
  scene.add(pointLight);

  const textureLoader = new THREE.TextureLoader();
  const textureBaseColor = textureLoader.load('../static/img/Dried_Soil_001_COLOR.jpg');
  const textureDISPColor = textureLoader.load('../static/img/Dried_Soil_001_DISP.png');
  const textureNRMColor = textureLoader.load('../static/img/Dried_Soil_001_NRM.jpg');
  const textureOCCColor = textureLoader.load('../static/img/Dried_Soil_001_OCC.jpg');
  const textureSPECColor = textureLoader.load('../static/img/Dried_Soil_001_SPEC.jpg');

  const geometry = new THREE.SphereGeometry(0.3, 32, 16);
  // const geometry = new THREE.PlaneGeometry(1, 1);
  const materials = [
    new THREE.MeshStandardMaterial({
      map: textureBaseColor,
    }),
    new THREE.MeshStandardMaterial({
      map: textureBaseColor,
      normalMap: textureNRMColor,
    }),
    new THREE.MeshStandardMaterial({
      map: textureBaseColor,
      normalMap: textureNRMColor,
      displacementMap: textureDISPColor, //톤에 따라서 높낮이 구현
      displacementScale: 0.1,
    }),
    new THREE.MeshStandardMaterial({
      map: textureBaseColor,
      normalMap: textureNRMColor,
      displacementMap: textureDISPColor, //톤에 따라서 높낮이 구현
      displacementScale: 0.1,
      roughnessMap: textureOCCColor,
      roughness: 0.8, // 빛의 반짝거림
    }),
    new THREE.MeshStandardMaterial({
      map: textureBaseColor,
    }),
  ];

  const x = [-2, -1, 0, 1, 2];

  materials
    .map((material) => new THREE.Mesh(geometry, material))
    .map((obj, index) => moveXGeometry(obj, x[index]))
    .forEach((obj) => scene.add(obj));

  // toruses.forEach((torus) => {
  //   scene.add(torus);
  // });

  function render(time) {
    time *= 0.001;

    // toruses.forEach((torus) => {
    //   // torus.rotation.x = time;
    //   torus.rotation.y = time;
    // });

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
