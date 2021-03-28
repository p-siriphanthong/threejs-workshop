// See example 5
import * as THREE from '/three/build/three.module.js'
import Stats from '/three/tools/jsm/libs/stats.module.js'
import { OrbitControls } from '/three/tools/jsm/controls/OrbitControls.js'
import { GLTFLoader } from '/three/tools/jsm/loaders/GLTFLoader.js'

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

// Create Camera
const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.01,
  100.0
)
camera.position.set(10, 30, 40)

// Create control
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

// Create Object
const gltfLoader = new GLTFLoader()
gltfLoader.load('models/VikingRoom/scene.gltf', (model) => {
  scene.add(model.scene)
})

// Create ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

// Create direactional light
const direactionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
direactionalLight.position.set(0, 10, 0)
scene.add(direactionalLight)

// Create point light
const pointLight = new THREE.PointLight(0xffffff, 1, 0, 10)
pointLight.position.set(-10, 12, -4)
scene.add(pointLight)

// This function will update every frame
const updateFrame = () => {
  requestAnimationFrame(updateFrame)

  // Action
  stats.update()
  controls.update()

  // Render
  renderer.render(scene, camera)
}

window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight)
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
})

updateFrame()
