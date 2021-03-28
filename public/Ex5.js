// Example 5
import {
  WebGLRenderer,
  Scene,
  PerspectiveCamera,
  Color,
  DirectionalLight,
  PointLight
  //BoxGeometry, MeshBasicMaterial, Mesh
} from '/three/build/three.module.js'
import Stats from '/three/tools/jsm/libs/stats.module.js'
import { GLTFLoader } from '/three/tools/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from '/three/tools/jsm/controls/OrbitControls.js'

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
camera.position.set(10, 30, 40)
camera.lookAt(0, 0, 0)

// Create Object
const gltfLoader = new GLTFLoader()
let model
gltfLoader.load('models/VikingRoom/scene.gltf', (obj) => {
  model = obj.scene
  scene.add(model)
  //console.log(model);
})

// Create Lighting
const dirLight = new DirectionalLight(0xffffff, 0.5)
dirLight.position.set(0, 10, 0)
scene.add(dirLight)

const pL1 = new PointLight(0xffff00, 1, 0, 10)
pL1.position.set(-10, 12, -4)
scene.add(pL1)

const pL2 = new PointLight(0xffff00, 1, 0, 10)
pL2.position.set(11, 11, -3)
scene.add(pL2)

const pL3 = new PointLight(0x0000ff, 2, 0, 50)
pL3.position.set(5, 5, 5)
scene.add(pL3)

/*let boxG = new BoxGeometry(1, 1, 1);
let boxM = new MeshBasicMaterial({color: 0xffff00});
let box = new Mesh(boxG, boxM);
box.position.copy(pL3.position);
scene.add(box);*/

// OrbitControls
const controls = new OrbitControls(camera, renderer.domElement)
controls.update()

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
