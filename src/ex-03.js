import * as THREE from 'three';
import { WEBGL } from './webgl.js';

if (WEBGL.isWebGLAvailable()) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x004fff);

  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);

  document.body.appendChild(renderer.domElement);

  function render(time) {
    time = 0.001;
    // cube.rotation.x = time;
    // cube.rocation.y = time;
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
} else {
  const warning = WEBGL.getWebGLErrorMessage();
  document.body.appendChild(warning);
}
