// See example 9, 10, 11
import * as dat from '/dat.gui/build/dat.gui.module.js'
import * as THREE from '/three/build/three.module.js'
import Stats from '/three/tools/jsm/libs/stats.module.js'
import { OrbitControls } from '/three/tools/jsm/controls/OrbitControls.js'
import { BufferGeometryUtils } from '/three/tools/jsm/utils/BufferGeometryUtils.js'

// Debuger
const params = { method: 'native', boxCount: 100000 }
const gui = new dat.GUI()
gui
  .add(params, 'method', {
    Native: 'native',
    Merged: 'merged',
    Instanced: 'instanced'
  })
  .onChange(render)

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
camera.position.set(0, 2, 5)

// Create control
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

// Create texture
const textureLoader = new THREE.TextureLoader()
const boxTexture = textureLoader.load('textures/basicBox.jpg')

// Create Object
const boxGeometry = new THREE.BoxGeometry(1, 1, 1)
const boxMaterial = new THREE.MeshBasicMaterial({ map: boxTexture })

function render() {
  scene.clear()

  console.time(params.method.toUpperCase())
  switch (params.method) {
    case 'native': {
      for (let i = 0; i < params.boxCount; i++) {
        const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial)
        boxMesh.position.set(
          Math.random() * 160 - 80,
          Math.random() * 160 - 80,
          Math.random() * 160 - 80
        )
        boxMesh.rotation.set(
          Math.random() * (Math.PI * 2),
          Math.random() * (Math.PI * 2),
          Math.random() * (Math.PI * 2)
        )
        const scale = Math.random() * 2
        boxMesh.scale.set(scale, scale, scale)
        scene.add(boxMesh)
      }
      break
    }
    case 'merged': {
      const matrix = new THREE.Matrix4()
      const geometrys = []

      for (let i = 0; i < params.boxCount; i++) {
        const newGeometry = boxGeometry.clone()

        const position = new THREE.Vector3(
          Math.random() * 160 - 80,
          Math.random() * 160 - 80,
          Math.random() * 160 - 80
        )
        const rotation = new THREE.Euler(
          Math.random() * (Math.PI * 2),
          Math.random() * (Math.PI * 2),
          Math.random() * (Math.PI * 2)
        )
        const scaleValue = Math.random() * 2
        const scale = new THREE.Vector3(scaleValue, scaleValue, scaleValue)

        const quaternion = new THREE.Quaternion()
        quaternion.setFromEuler(rotation)

        matrix.compose(position, quaternion, scale)
        newGeometry.applyMatrix4(matrix)

        geometrys.push(newGeometry)
      }

      const boxGeometryBuffer = BufferGeometryUtils.mergeBufferGeometries(
        geometrys
      )
      const mesh = new THREE.Mesh(boxGeometryBuffer, boxMaterial)
      scene.add(mesh)
      break
    }
    case 'instanced': {
      const mesh = new THREE.InstancedMesh(
        boxGeometry,
        boxMaterial,
        params.boxCount
      )
      const matrix = new THREE.Matrix4()

      for (let i = 0; i < params.boxCount; i++) {
        const position = new THREE.Vector3(
          Math.random() * 160 - 80,
          Math.random() * 160 - 80,
          Math.random() * 160 - 80
        )
        const rotation = new THREE.Euler(
          Math.random() * (Math.PI * 2),
          Math.random() * (Math.PI * 2),
          Math.random() * (Math.PI * 2)
        )
        const scaleValue = Math.random() * 2
        const scale = new THREE.Vector3(scaleValue, scaleValue, scaleValue)

        const quaternion = new THREE.Quaternion()
        quaternion.setFromEuler(rotation)

        matrix.compose(position, quaternion, scale)
        mesh.setMatrixAt(i, matrix)
      }

      scene.add(mesh)
      break
    }
  }
  console.timeEnd(params.method.toUpperCase())
}

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

render()
updateFrame()
