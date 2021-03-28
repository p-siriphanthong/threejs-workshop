// Example 9
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

let animationIndex = 0
let mixer1,
  mixer2,
  tmr = 0
const mixers = []

gltfLoader.load('models/vibrantRex.glb', (obj) => {
  const model1 = cloneModel(obj)
  model1.scene.position.set(-5, 0, 0)
  mixer1 = new AnimationMixer(model1.scene)
  mixer1.clipAction(model1.animations[animationIndex]).play()
  mixers.push(mixer1)
  scene.add(model1.scene)

  const model2 = cloneModel(obj)
  model2.scene.position.set(5, 0, 0)
  mixer2 = new AnimationMixer(model2.scene)
  mixer2.clipAction(model2.animations[animationIndex]).play()
  mixers.push(mixer2)
  scene.add(model2.scene)

  function changeAnimation() {
    mixer1.clipAction(model1.animations[animationIndex]).stop()
    mixer2.clipAction(model1.animations[animationIndex]).fadeOut(0.2)

    animationIndex++
    if (animationIndex >= 5) {
      animationIndex = 0
    }

    mixer1.clipAction(model1.animations[animationIndex]).play()
    mixer2
      .clipAction(model2.animations[animationIndex])
      .reset()
      .setEffectiveTimeScale(1)
      .setEffectiveWeight(1)
      .fadeIn(0.2)
      .play()
  }

  document.addEventListener('keydown', (e) => {
    if (e.code == 'Space') {
      changeAnimation()
    }
  })

  document.addEventListener('click', (e) => {
    if (Date.now() - tmr < 300) {
      changeAnimation()
    }
    tmr = Date.now()
  })

  document.addEventListener('touchstart', (e) => {
    let touches = e.targetTouches
    if (Date.now() - tmr < 300 && touches.length == 1) {
      changeAnimation()
    }
    tmr = Date.now()
  })
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
  if (mixer1 != undefined) {
    mixer1.update(delta)
  }
  if (mixer2 != undefined) {
    mixer2.update(delta)
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
