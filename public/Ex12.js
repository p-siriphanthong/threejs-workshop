// Example 12
import {
  WebGLRenderer,
  Scene,
  PerspectiveCamera,
  Color,
  BoxGeometry,
  MeshBasicMaterial,
  InstancedMesh,
  TextureLoader,
  Matrix4,
  Vector3,
  Euler,
  Quaternion
} from '/three/build/three.module.js'
import Stats from '/three/tools/jsm/libs/stats.module.js'
import { OrbitControls } from '/three/tools/jsm/controls/OrbitControls.js'

const renderer = new WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)

const stats = new Stats()

document.body.appendChild(renderer.domElement)
document.body.appendChild(stats.dom)

const scene = new Scene()
scene.background = new Color(0x202020)

const camera = new PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.01,
  100
)
camera.position.set(0, 2, 5)
camera.lookAt(0, 0, 0)

const textureLoder = new TextureLoader()
const boxGeometry = new BoxGeometry(1, 1, 1)
const boxMaterial = new MeshBasicMaterial({
  color: 0xffffff,
  map: textureLoder.load('textures/basicBox.jpg')
})
const mesh = new InstancedMesh(boxGeometry, boxMaterial, 100000)

const matrix = new Matrix4()

for (let i = 0; i < 100000; i++) {
  const position = new Vector3(
    Math.random() * 160 - 80,
    Math.random() * 160 - 80,
    Math.random() * 160 - 80
  )
  const rotation = new Euler(
    Math.random() * (Math.PI * 2),
    Math.random() * (Math.PI * 2),
    Math.random() * (Math.PI * 2)
  )
  const scale = new Vector3(1, 1, 1)

  const quaternion = new Quaternion()
  quaternion.setFromEuler(rotation)

  matrix.compose(position, quaternion, scale)
  mesh.setMatrixAt(i, matrix)
}

scene.add(mesh)

const control = new OrbitControls(camera, renderer.domElement)
control.update()

renderer.setAnimationLoop(() => {
  stats.update()
  control.update()
  renderer.render(scene, camera)
})

window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight)
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
})
