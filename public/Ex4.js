// Example 1
import {
  WebGLRenderer,
  Scene,
  PerspectiveCamera,
  Color,
  Clock,
  PlaneGeometry,
  BoxGeometry,
  MeshStandardMaterial,
  Mesh,
  DirectionalLight,
  PointLight,
  SpotLight,
  PCFSoftShadowMap
} from '/three/build/three.module.js'
import Stats from '/three/tools/jsm/libs/stats.module.js'
import { OrbitControls } from '/three/tools/jsm/controls/OrbitControls.js'

// Create WebGL Renderer
const renderer = new WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMap.enabled = true
renderer.shadowMap.type = PCFSoftShadowMap

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
camera.position.set(0, 2, 5)
camera.lookAt(0, 0, 0)

// Create Lighting
const dirLight = new DirectionalLight(0xffffff, 0.5, 0, 0.5)
dirLight.castShadow = false
dirLight.shadow.mapSize.width = 32
dirLight.shadow.mapSize.height = 32
dirLight.position.set(10, 10, 5)
scene.add(dirLight)

const spotLight = new SpotLight(0xffffff, 0.5, 0, 0.3, 1)
spotLight.castShadow = true
spotLight.shadow.mapSize.width = 32
spotLight.shadow.mapSize.height = 32
spotLight.position.set(0, 10, 0)
scene.add(spotLight)

const pL1 = new PointLight(0xff0000, 0.5, 50)
pL1.castShadow = false
pL1.shadow.mapSize.width = 32
pL1.shadow.mapSize.height = 32
pL1.position.set(3, 2, 3)
scene.add(pL1)

const pL2 = new PointLight(0x0000ff, 0.5, 50)
pL2.castShadow = false
pL2.shadow.mapSize.width = 32
pL2.shadow.mapSize.height = 32
pL2.position.set(-3, 2, 1)
scene.add(pL2)

// Create Object
const floorGeometry = new PlaneGeometry(10, 10)
const floorMaterial = new MeshStandardMaterial({ color: 0xffffff })
const floor = new Mesh(floorGeometry, floorMaterial)
floor.castShadow = false
floor.receiveShadow = true
floor.rotation.x = -Math.PI / 2
scene.add(floor)

const boxGeometry = new BoxGeometry(1, 1, 1)
const boxMaterial = new MeshStandardMaterial({ color: 0xffff00 })
const boxMesh = new Mesh(boxGeometry, boxMaterial)
boxMesh.castShadow = true
boxMesh.receiveShadow = true
scene.add(boxMesh)

let speed = 0
let clock = new Clock()

// OrbitControls
const controls = new OrbitControls(camera, renderer.domElement)

// This function will update every frame
const updateFrame = () => {
  requestAnimationFrame(updateFrame)

  // Action
  stats.update()
  controls.update()

  let dt = clock.getDelta()
  boxMesh.position.y = Math.cos(speed) * 0.5 + 1.5
  boxMesh.rotation.x += dt
  boxMesh.rotation.y += dt
  boxMesh.rotation.z += dt
  speed += 2 * dt

  // Render
  renderer.render(scene, camera)
}

window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight)
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
})

updateFrame()
