// Example 13
import {
  WebGLRenderer,
  Scene,
  PerspectiveCamera,
  Color,
  UnsignedByteType,
  PMREMGenerator,
  FogExp2,
  ACESFilmicToneMapping,
  PlaneGeometry,
  BoxGeometry,
  SphereGeometry,
  MeshPhysicalMaterial,
  Mesh,
  TextureLoader,
  RepeatWrapping,
  PointLight,
  Clock,
  PCFSoftShadowMap
} from '/three/build/three.module.js'
import Stats from '/three/tools/jsm/libs/stats.module.js'
import { OrbitControls } from '/three/tools/jsm/controls/OrbitControls.js'
import { RGBELoader } from '/three/tools/jsm/loaders/RGBELoader.js'

// Create WebGL Renderer
const renderer = new WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMap.enabled = true
renderer.shadowMap.type = PCFSoftShadowMap
renderer.toneMapping = ACESFilmicToneMapping
renderer.toneMappingExposure = 1.5

// Show Stats
const stats = new Stats()

// Add domElement to Body
document.body.appendChild(renderer.domElement)
document.body.appendChild(stats.dom)

// Create Scene
const scene = new Scene()
scene.fog = new FogExp2(0x040301, 0.05)

// HDR Map
const pmrem = new PMREMGenerator(renderer)
pmrem.compileEquirectangularShader()

const rgbLoader = new RGBELoader()
rgbLoader.setDataType(UnsignedByteType)
rgbLoader.load('textures/dikhololo_night_1k.hdr', (m) => {
  const hdrMap = pmrem.fromEquirectangular(m)
  m.dispose()
  pmrem.dispose()
  scene.background = hdrMap.texture
  scene.environment = hdrMap.texture
})

// Create Camera
const camera = new PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.01,
  1000.0
)
camera.position.set(0, 2, 5)
camera.lookAt(0, 0, 0)

// Create Object
const loadAndRepeat = (url, s, t) => {
  return textureLoader.load(url, (_t) => {
    _t.wrapS = RepeatWrapping
    _t.wrapT = RepeatWrapping
    _t.repeat.set(s, t)
  })
}

const textureLoader = new TextureLoader()
const floorGeometry = new PlaneGeometry(100, 100, 100, 100)
const floorMaterial = new MeshPhysicalMaterial({
  color: 0xffffff,
  map: loadAndRepeat('textures/floor/diffuse.jpg', 20, 20),
  normalMap: loadAndRepeat('textures/floor/normal.jpg', 20, 20),
  roughnessMap: loadAndRepeat('textures/floor/roughness.jpg', 20, 20),
  displacementMap: loadAndRepeat('textures/floor/displacement.jpg', 20, 20),
  aoMap: loadAndRepeat('textures/floor/ao.jpg', 20, 20),
  roughness: 0.4,
  displacementScale: 0.5,
  displacementBias: -0.1
})
floorMaterial.needUpdate = true
const floor = new Mesh(floorGeometry, floorMaterial)
floor.castShadow = false
floor.receiveShadow = true
floor.rotation.x = -Math.PI / 2
scene.add(floor)

const boxGeometry = new BoxGeometry(1, 1, 1)
const boxMaterial = new MeshPhysicalMaterial({
  color: 0xffffff,
  map: textureLoader.load('textures/wood/diffuse.jpg'),
  normalMap: textureLoader.load('textures/wood/normal.jpg'),
  roughnessMap: textureLoader.load('textures/wood/roughness.jpg'),
  displacementMap: textureLoader.load('textures/wood/displacement.jpg'),
  aoMap: textureLoader.load('textures/wood/ao.jpg'),
  roughness: 0.4,
  displacementScale: 0.23,
  displacementBias: -0.1
})
const box1 = new Mesh(boxGeometry, boxMaterial)
box1.castShadow = true
box1.receiveShadow = true
box1.position.set(-2, 0.5, -1)
box1.rotation.y = (45 * Math.PI) / 180
scene.add(box1)

const box2 = box1.clone()
box2.position.set(2, 0.5, 1)
box2.rotation.y = (-25 * Math.PI) / 180
scene.add(box2)

const ball1Geometry = new SphereGeometry(0.5, 32, 32)
const ball1Material = new MeshPhysicalMaterial({
  color: 0xffffff,
  map: textureLoader.load('textures/wood/diffuse.jpg'),
  normalMap: textureLoader.load('textures/wood/normal.jpg'),
  roughnessMap: textureLoader.load('textures/wood/roughness.jpg'),
  displacementMap: textureLoader.load('textures/wood/displacement.jpg'),
  aoMap: textureLoader.load('textures/wood/ao.jpg'),
  roughness: 0.2,
  displacementScale: 0.22,
  displacementBias: -0.1
})
const ball1 = new Mesh(ball1Geometry, ball1Material)
ball1.castShadow = true
ball1.receiveShadow = true
ball1.position.set(-1, 0.5, 1)
scene.add(ball1)

const ball2Geometry = new SphereGeometry(1, 32, 32)
const ball2Material = new MeshPhysicalMaterial({
  color: 0xffffff,
  map: textureLoader.load('textures/wall/diffuse.jpg'),
  normalMap: textureLoader.load('textures/wall/normal.jpg'),
  roughnessMap: textureLoader.load('textures/wall/roughness.jpg'),
  displacementMap: textureLoader.load('textures/wall/displacement.jpg'),
  aoMap: textureLoader.load('textures/wall/ao.jpg'),
  roughness: 0.3,
  displacementScale: 0.5,
  displacementBias: -0.1
})
const ball2 = new Mesh(ball2Geometry, ball2Material)
ball2.castShadow = true
ball2.receiveShadow = true
ball2.position.set(0, 0, -1)
ball2.rotation.x = (90 * Math.PI) / 180
scene.add(ball2)

// Create Lighting
const LBGeometry = new SphereGeometry(0.05, 32, 32)
const LBMaterial = new MeshPhysicalMaterial({
  color: 0xffffff,
  emissive: 0xffffff,
  emissiveIntensity: 10
})
const LB = new Mesh(LBGeometry, LBMaterial)
LB.position.set(-3, 2, 0)
scene.add(LB)

const PL = new PointLight(0xffffff, 1, 100)
PL.castShadow = true
PL.shadow.mapSize.width = 256
PL.shadow.mapSize.height = 256
PL.position.copy(LB.position)
scene.add(PL)

// OrbitControls
const controls = new OrbitControls(camera, renderer.domElement)
controls.enablePan = false
controls.minDistance = 3.5
controls.maxDistance = 10
controls.maxPolarAngle = Math.PI / 2.1
controls.target = floor.position
controls.update()

let n = 0
const clock = new Clock()

// This function will update every frame
renderer.setAnimationLoop(() => {
  // Action
  stats.update()
  controls.update()

  let delta = clock.getDelta()
  LB.position.x = Math.cos(n) * 3
  LB.position.z = Math.sin(n) * 3
  PL.position.copy(LB.position)
  n += delta

  // Render
  renderer.render(scene, camera)
})

window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight)
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
})
