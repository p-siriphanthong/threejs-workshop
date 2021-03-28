// Example 7
import {
  WebGLRenderer,
  Scene,
  PerspectiveCamera,
  AmbientLight,
  SkeletonHelper,
  AnimationMixer,
  Clock,
  PlaneGeometry,
  MeshStandardMaterial,
  Mesh
} from '/three/build/three.module.js'
import { OrbitControls } from '/three/tools/jsm/controls/OrbitControls.js'
import { GLTFLoader } from '/three/tools/jsm/loaders/GLTFLoader.js'

const renderer = new WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)

document.body.appendChild(renderer.domElement)

const scene = new Scene()

const camera = new PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.01,
  100.0
)
camera.position.set(0, 5, 10)
camera.lookAt(0, 0, 0)

const aLight = new AmbientLight(0xffffff, 1)
scene.add(aLight)

let mixer, action, rex
const animClip = {}
const loader = new GLTFLoader()
loader.load('models/vibrantRex.glb', (model) => {
  console.log(model)
  rex = model.scene
  scene.add(model.scene)

  mixer = new AnimationMixer(model.scene)
  for (let i = 0; i < model.animations.length; i++) {
    animClip[model.animations[i].name] = model.animations[i]
  }

  action = animClip['idle']
  mixer.clipAction(action).play()
})

const floor = new Mesh(
  new PlaneGeometry(100, 100),
  new MeshStandardMaterial({ color: 0xffffff })
)
floor.rotation.x = -Math.PI / 2
scene.add(floor)

const controls = new OrbitControls(camera, renderer.domElement)
controls.update()

const clock = new Clock()
let kU = false
let kD = false

const upFrame = () => {
  requestAnimationFrame(upFrame)
  controls.update()

  if (mixer != undefined) mixer.update(clock.getDelta())

  if (kU) rex.position.z += 0.1
  if (kD) rex.position.z -= 0.1

  renderer.render(scene, camera)
}

const playAnimation = (clip) => {
  if (action != animClip[clip]) {
    mixer.clipAction(action).stop()
    action = animClip[clip]
    mixer.clipAction(action).play()
  }
}

document.addEventListener('keydown', (e) => {
  console.log(e)
  switch (e.code) {
    case 'ArrowUp':
      playAnimation('run')
      kU = true
      break
    case 'ArrowDown':
      playAnimation('run')
      kD = true
      break
  }
  //if(e.code == "Space"){ changeAnimation(); }
})

document.addEventListener('keyup', (e) => {
  console.log(e)
  switch (e.code) {
    case 'ArrowUp':
      playAnimation('idle')
      kU = false
      break
    case 'ArrowDown':
      playAnimation('idle')
      kD = false
      break
  }
  //if(e.code == "Space"){ changeAnimation(); }
})

window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight)
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
})

upFrame()
