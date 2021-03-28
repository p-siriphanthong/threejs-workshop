import * as THREE from '/three/build/three.module.js'
import Stats from '/three/tools/jsm/libs/stats.module.js'
import { OrbitControls } from '/three/tools/jsm/controls/OrbitControls.js'
import { GLTFLoader } from '/three/tools/jsm/loaders/GLTFLoader.js'

const cloneModel = (obj) => {
  const clone = {
    ...obj,
    scene: obj.scene.clone(true)
  }

  const skinnedMeshes = {}
  const cloneSkinnedMeshs = {}
  const cloneBones = {}

  clone.scene.traverse((c) => {
    if (c.isSkinnedMesh) {
      skinnedMeshes[c.name] = c
      cloneSkinnedMeshs[c.name] = c
    } else if (c.isBone) {
      cloneBones[c.name] = c
    }
  })

  for (let n in skinnedMeshes) {
    const skinnedMesh = skinnedMeshes[n]
    const cloneSkinnedMesh = cloneSkinnedMeshs[n]
    const skeleton = skinnedMesh.skeleton

    const orderedCloneBone = []

    for (let i = 0; i < skeleton.bones.length; i++) {
      const cloneBone = cloneBones[skeleton.bones[i].name]
      orderedCloneBone.push(cloneBone)
    }

    cloneSkinnedMesh.bind(
      new THREE.Skeleton(orderedCloneBone, skeleton.boneInverses),
      cloneSkinnedMesh.matrixWorld
    )
  }

  return clone
}

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
camera.position.set(0, 5, 25)

// Create control
const controls = new OrbitControls(camera, renderer.domElement)
controls.target = new THREE.Vector3(0, -5, 0)
controls.enableDamping = true

// Create plane object
const planeGeometry = new THREE.PlaneGeometry(50, 50)
const planeMaterial = new THREE.MeshBasicMaterial({ color: 0x9dd19d })
const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial)
planeMesh.rotation.x = -Math.PI / 2
scene.add(planeMesh)

// Create rex objects
let runModel
const animationMixers = []
const gltfLoader = new GLTFLoader()
gltfLoader.load('models/vibrantRex.glb', (gltf) => {
  for (let i = 0; i < 5; i++) {
    const model = cloneModel(gltf)
    model.scene.position.set(i * 5 - 12.5, 0, i % 2 == 0 ? 5 : -5)

    const animationMixer = new THREE.AnimationMixer(model.scene)
    animationMixer.clipAction(model.animations[i]).play()
    animationMixers.push(animationMixer)

    if (i === 0) runModel = model
    scene.add(model.scene)
  }
})

// Create ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
scene.add(ambientLight)

// Create direactional light
const direactionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
direactionalLight.position.set(5, 20, 10)
scene.add(direactionalLight)

// Create point light
const pointLight = new THREE.PointLight(0xffffff, 0.8, 0, 50)
pointLight.position.set(-10, 5, -5)
scene.add(pointLight)

// This function will update every frame
const clock = new THREE.Clock()
const runRadius = 20,
  runSpeed = 0.01,
  runRotateStep = (2 * Math.PI * runRadius) / runSpeed
let runStep = 0
const updateFrame = () => {
  requestAnimationFrame(updateFrame)

  const delta = clock.getDelta()
  animationMixers.forEach((animationMixer) => {
    animationMixer.update(delta)
  })

  if (runModel) {
    runModel.scene.position.x = Math.cos(runStep * runSpeed) * runRadius
    runModel.scene.position.z = Math.sin(runStep * runSpeed) * runRadius
    runModel.scene.rotation.y =
      -2 * Math.PI * runRadius * (runStep / runRotateStep)
    runStep += 1
  }

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
