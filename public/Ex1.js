// Example 1
import {
  WebGLRenderer,
  Scene,
  PerspectiveCamera,
  Color,
  BoxGeometry,
  MeshBasicMaterial,
  Mesh
} from '/three/build/three.module.js'
import Stats from '/three/tools/jsm/libs/stats.module.js'

// Create WebGL Renderer
const renderer = new WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)

// Show Stats
const stats = new Stats()

// Add domElement to Body
document.body.appendChild(renderer.domElement)
document.body.appendChild(stats.dom)

// Create Scene
const scene = new Scene()
scene.background = new Color(0x202020)

// Create Camera
const camera = new PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.01,
  100.0
)
camera.position.set(0, 1, 3)
camera.lookAt(0, 0, 0)

// Create Object
const boxGeometry = new BoxGeometry(1, 1, 1)
const boxMaterial = new MeshBasicMaterial({ color: 0xffff00 })
const boxMesh = new Mesh(boxGeometry, boxMaterial)
scene.add(boxMesh)

let speed = 0

// This function will update every frame
const updateFrame = () => {
  requestAnimationFrame(updateFrame)

  // Action
  stats.update()

  boxMesh.position.y = Math.cos(speed) * 0.5
  boxMesh.rotation.x += 0.01
  boxMesh.rotation.y += 0.01
  boxMesh.rotation.z += 0.01
  speed += 0.05

  // Render
  renderer.render(scene, camera)
}

window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight)
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
})

updateFrame()
