import * as THREE from 'three';
import { WEBGL } from './webgl.js';

if (WEBGL.isWebGLAvailable()) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x004fff);

  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 3;

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  const geometry = new THREE.IcosahedronGeometry(0.7, 1);
  const material = new THREE.MeshStandardMaterial({
    color: 0x999999,
  });

  const cube1 = new THREE.Mesh(geometry, material);
  cube1.position.x = -1;
  const cube2 = new THREE.Mesh(geometry, material);
  cube2.position.x = 1;
  scene.add(cube1);
  scene.add(cube2);

  function render(time) {
    time *= 0.0005;
    // cube1.rotation.x = time;
    cube1.rotation.y = time;
    // cube2.rotation.x = time;
    cube2.rotation.y = time;

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
