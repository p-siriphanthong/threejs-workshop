// Example 11
import {
  WebGLRenderer,
  Scene,
  PerspectiveCamera,
  Color,
  BoxGeometry,
  MeshBasicMaterial,
  Mesh,
  TextureLoader,
  Matrix4,
  Vector3,
  Euler,
  Quaternion
} from '/three/build/three.module.js'
import Stats from '/three/tools/jsm/libs/stats.module.js'
import { OrbitControls } from '/three/tools/jsm/controls/OrbitControls.js'
import { BufferGeometryUtils } from '/three/tools/jsm/utils/BufferGeometryUtils.js'

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

/*
const mesh = new Mesh(boxGeometry, boxMaterial);
mesh.position.set(0, 0, 0);
scene.add(mesh);
*/

const matrix = new Matrix4()
const geometrys = []

for (let i = 0; i < 100000; i++) {
  const newGeometry = boxGeometry.clone()

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
  newGeometry.applyMatrix4(matrix)

  geometrys.push(newGeometry)
}

const boxGeometryBuffer = BufferGeometryUtils.mergeBufferGeometries(geometrys)
const box = new Mesh(boxGeometryBuffer, boxMaterial)
scene.add(box)

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
