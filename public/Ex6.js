// Example 6
import {
  WebGLRenderer,
  Scene,
  PerspectiveCamera,
  Color,
  Vector3,
  AnimationMixer,
  Clock,
  DirectionalLight,
  PointLight
} from '/three/build/three.module.js'
import Stats from '/three/tools/jsm/libs/stats.module.js'
import { GLTFLoader } from '/three/tools/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from '/three/tools/jsm/controls/OrbitControls.js'

// Create WebGL Renderer
const renderer = new WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)

// Show Stats
let stats = new Stats()

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
camera.position.set(-6, 5, 10)

// Create Object
const gltfLoader = new GLTFLoader()
let model, mixer
gltfLoader.load('models/vibrantRex.glb', (obj) => {
  model = obj.scene
  mixer = new AnimationMixer(model)
  mixer.clipAction(obj.animations[0]).play()
  scene.add(model)
  //console.log(model);
  console.log(obj.animations)
  //console.log(obj.animations[0].name);
})

// Create Lighting
const dirLight = new DirectionalLight(0xffffff, 1.5)
dirLight.position.set(5, 20, 10)
scene.add(dirLight)

const pL1 = new PointLight(0xff0000, 0.5, 0, 50)
pL1.position.set(-10, 5, -5)
scene.add(pL1)

const pL2 = new PointLight(0x0000ff, 0.5, 0, 50)
pL2.position.set(10, 5, 10)
scene.add(pL2)

// OrbitControls
const controls = new OrbitControls(camera, renderer.domElement)
controls.target = new Vector3(0, 2, 0)
controls.update()

const clock = new Clock()

// This function will update every frame
const updateFrame = () => {
  requestAnimationFrame(updateFrame)

  // Action
  stats.update()
  controls.update()

  if (mixer != undefined) {
    mixer.update(clock.getDelta())
  }

  // Render
  renderer.render(scene, camera)
}

window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight)
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
})

updateFrame()
