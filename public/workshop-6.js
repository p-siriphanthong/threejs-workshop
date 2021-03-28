// See example 6, 6-2, 8
// running animation will be loop automaticly
// a next animation will be run when press spacebar
// animation number `i` will be run when press `i`

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
camera.position.set(-6, 5, 10)

// Create control
const controls = new OrbitControls(camera, renderer.domElement)
controls.target = new THREE.Vector3(0, 2, 0)
controls.enableDamping = true

// Create Object
let animationMixer,
  activeAnimation,
  activeAnimationIndex = 0,
  animationPlayingTime = 0
const animationFadeTime = 0.5
const gltfLoader = new GLTFLoader()
gltfLoader.load('models/vibrantRex.glb', (gltf) => {
  animationMixer = new THREE.AnimationMixer(gltf.scene)
  gltf.animations.forEach((animation) => {
    animationMixer.clipAction(animation)
  })

  activeAnimation = animationMixer._actions[0]
  playAnimation(activeAnimation)

  scene.add(gltf.scene)

  const skeletonHelper = new THREE.SkeletonHelper(gltf.scene)
  scene.add(skeletonHelper)
})

// Create ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

// Create direactional light
const direactionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
direactionalLight.position.set(5, 20, 10)
scene.add(direactionalLight)

// Create point light
const pointLight = new THREE.PointLight(0xffffff, 0.5, 0, 50)
pointLight.position.set(-10, 5, -5)
scene.add(pointLight)

// This function will update every frame
const clock = new THREE.Clock()
const updateFrame = () => {
  requestAnimationFrame(updateFrame)

  if (animationMixer) {
    const delta = clock.getDelta()

    if (animationPlayingTime >= activeAnimation._clip.duration) {
      changeAnimation()
    } else {
      animationPlayingTime += delta
      animationMixer.update(delta)
    }
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

document.addEventListener('keydown', (event) => {
  if (event.code === 'Space') {
    changeAnimation()
  } else if (event.code.startsWith('Digit')) {
    const animationId = parseInt(event.code.slice(5))
    if (animationId <= animationMixer._actions.length) {
      changeAnimation(animationId)
    }
  }
})

function playAnimation(animationAction) {
  animationAction
    .reset()
    .setEffectiveTimeScale(1)
    .setEffectiveWeight(1)
    .fadeIn(animationFadeTime)
    .play()

  document.getElementById(
    'info'
  ).innerText = animationAction._clip.name.toUpperCase().replace(/_/g, ' ')
}

function changeAnimation(animationId) {
  activeAnimation.fadeOut(animationFadeTime)

  activeAnimationIndex = animationId
    ? animationId - 1
    : (activeAnimationIndex + 1) % animationMixer._actions.length
  activeAnimation = animationMixer._actions[activeAnimationIndex]
  animationPlayingTime = 0

  playAnimation(activeAnimation)
}

updateFrame()
