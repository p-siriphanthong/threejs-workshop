// Example 8
import {
  WebGLRenderer,
  Scene,
  PerspectiveCamera,
  Color,
  Vector3,
  AnimationMixer,
  Clock,
  Skeleton,
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
camera.position.set(0, 5, 20)

// Create Object
const gltfLoader = new GLTFLoader()

const cloneModel = (obj) => {
  const clone = {
    animations: obj.animations,
    scene: obj.scene.clone(true)
  }

  const skinnedMeshes = {}

  obj.scene.traverse((c) => {
    if (c.isSkinnedMesh) {
      skinnedMeshes[c.name] = c
    }
  })

  const cloneBones = {}
  const cloneSkinnedMeshs = {}

  clone.scene.traverse((c) => {
    if (c.isBone) {
      cloneBones[c.name] = c
    }
    if (c.isSkinnedMesh) {
      cloneSkinnedMeshs[c.name] = c
    }
  })

  for (let n in skinnedMeshes) {
    const skinnedMesh = skinnedMeshes[n]
    const skeleton = skinnedMesh.skeleton
    const cloneSkinnedMesh = cloneSkinnedMeshs[n]

    const orderedCloneBone = []

    for (let i = 0; i < skeleton.bones.length; i++) {
      const cloneBone = cloneBones[skeleton.bones[i].name]
      orderedCloneBone.push(cloneBone)
    }

    cloneSkinnedMesh.bind(
      new Skeleton(orderedCloneBone, skeleton.boneInverses),
      cloneSkinnedMesh.matrixWorld
    )
  }

  return clone
}

const mixers = []

gltfLoader.load('models/vibrantRex.glb', (obj) => {
  for (let i = 0; i < 5; i++) {
    const model = cloneModel(obj)
    model.scene.position.set(i * 5 - 10, 0, i % 2 == 0 ? 0 : -10)
    const mixer = new AnimationMixer(model.scene)
    mixer.clipAction(model.animations[i]).play()
    mixers.push(mixer)
    scene.add(model.scene)
  }
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

  let delta = clock.getDelta()
  for (let i = 0; i < mixers.length; i++) {
    mixers[i].update(delta)
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
