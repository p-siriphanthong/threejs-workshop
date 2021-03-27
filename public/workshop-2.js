import * as dat from '/dat.gui/build/dat.gui.module.js'
import * as THREE from '/three/build/three.module.js'
import Stats from '/three/tools/jsm/libs/stats.module.js'

// Debuger
const gui = new dat.GUI()

// Create WebGL Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)

// Show Stats
const stats = new Stats()

// Add domElement to Body
document.body.appendChild(renderer.domElement)
document.body.appendChild(stats.dom)

// Create Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color(0x202020)

// Create AxesHelper
const axesHelper = new THREE.AxesHelper()
scene.add(axesHelper)

// Create Camera
const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.01,
  100.0
)
camera.position.set(0, 1, 5)
camera.lookAt(0, -1, 0)
gui.add(camera.position, 'x').name('Camera X').min(-3).max(3)
gui.add(camera.position, 'y').name('Camera Y').min(-3).max(3)
gui.add(camera.position, 'z').name('Camera Z').min(1).max(10)

// Create box object
const boxGeometry = new THREE.BoxGeometry(1, 1, 1)
const boxMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial)
scene.add(boxMesh)

// Create plane object
const planeGeometry = new THREE.PlaneGeometry(5, 5)
const planeMaterial = new THREE.MeshBasicMaterial({
  color: 0x55ff55,
  side: THREE.DoubleSide
})
const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial)
planeMesh.rotation.x = Math.PI / 2
planeMesh.position.y = -1.5
scene.add(planeMesh)

// Create sphere object
const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32)
const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff })
const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial)
sphereMesh.position.x = 1
sphereMesh.position.y = -1
scene.add(sphereMesh)

// This function will update every frame
let planeSpeed = 0,
  boxSpeed = 0,
  sphereSpeed = 0
const updateFrame = () => {
  requestAnimationFrame(updateFrame)

  // Action
  stats.update()

  boxMesh.position.y = Math.cos(boxSpeed) * 0.5
  boxMesh.rotation.x += 0.01
  boxMesh.rotation.y += 0.01
  boxMesh.rotation.z += 0.01
  boxSpeed += 0.05

  const planeScale = Math.cos(planeSpeed) * 0.1 + 1
  planeMesh.scale.set(planeScale, planeScale, planeScale)
  planeSpeed += 0.025

  sphereMesh.position.x = Math.cos(sphereSpeed) * 2
  sphereMesh.position.z = Math.sin(sphereSpeed) * 2
  sphereSpeed += 0.04

  // Render
  renderer.render(scene, camera)
}

window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight)
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
})

updateFrame()
