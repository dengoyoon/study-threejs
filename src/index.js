import * as THREE from 'three'
import { WEBGL } from './webgl.js'

if (WEBGL.isWebGLAvailable()) {
  console.log(THREE)
} else {
  var warning = WEBGL.getWebGLErrorMessage()
  document.body.appendChild(warning)
}
