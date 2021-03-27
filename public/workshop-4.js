import * as THREE from '/three/build/three.module.js'
import Stats from '/three/tools/jsm/libs/stats.module.js'
import { OrbitControls } from '/three/tools/jsm/controls/OrbitControls.js'

// Create WebGL Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

// Show Stats
const stats = new Stats()

// Add domElement to Body
document.body.appendChild(renderer.domElement)
document.body.appendChild(stats.dom)

// Create Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color(0x202020)
scene.fog = new THREE.FogExp2(0x202020, 0.085)

// Create Camera
const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.01,
  100.0
)
camera.position.set(0, 2, 10)
camera.lookAt(0, 0, 0)

// Create control
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

// Create sun object
const sunGeometry = new THREE.SphereGeometry(1, 32, 32)
const sunMaterial = new THREE.MeshStandardMaterial({
  color: 0xffff00,
  emissive: 0xffff00
})
const sunMesh = new THREE.Mesh(sunGeometry, sunMaterial)
sunMesh.castShadow = true
scene.add(sunMesh)

// Create planet object
const planetGeometry = new THREE.SphereGeometry(0.3, 32, 32)
const planetMaterial = new THREE.MeshStandardMaterial({ color: 0x79a6ed })
const planetMesh = new THREE.Mesh(planetGeometry, planetMaterial)
planetMesh.position.x = 3
planetMesh.position.z = 3
scene.add(planetMesh)

// Create star objects
const starGeometry = new THREE.SphereGeometry(1, 32, 32)
const starMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff })
const starMesh = new THREE.Mesh(starGeometry, starMaterial)
for (let i = 0; i < 1000; i++) {
  const star = starMesh.clone()
  const scale = Math.random() * 0.02
  star.scale.set(scale, scale, scale)
  star.position.x = (Math.random() - 0.5) * 15
  star.position.y = (Math.random() - 0.5) * 15
  star.position.z = (Math.random() - 0.5) * 15
  scene.add(star)
}

// Create floor object
const floorGeometry = new THREE.PlaneGeometry(50, 50)
const floorMaterial = new THREE.MeshStandardMaterial({ color: 0xc4e6a8 })
const floorMesh = new THREE.Mesh(floorGeometry, floorMaterial)
floorMesh.rotation.x = -Math.PI / 2
floorMesh.position.y = -5
floorMesh.receiveShadow = true
scene.add(floorMesh)

// Create ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3)
scene.add(ambientLight)

// Create point light
const pointLight = new THREE.PointLight(0xffffff, 1, 50)
scene.add(pointLight)

// Create directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2)
directionalLight.position.set(0, 10, 0)
directionalLight.castShadow = true
scene.add(directionalLight)

// This function will update every frame
let planetV = 0
const updateFrame = () => {
  requestAnimationFrame(updateFrame)

  planetMesh.position.x = Math.cos(planetV) * 3
  planetMesh.position.z = Math.sin(planetV) * 3
  planetV += 0.02

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
