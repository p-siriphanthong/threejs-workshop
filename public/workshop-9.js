// See example 13, 14

// Download texture from https://quixel.com/megascans
// Download HDR from https://hdrihaven.com/hdris

import * as THREE from '/three/build/three.module.js'
import Stats from '/three/tools/jsm/libs/stats.module.js'
import { RGBELoader } from '/three/tools/jsm/loaders/RGBELoader.js'

// Create WebGL Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

// Show Stats
const stats = new Stats()

// Add domElement to Body
document.body.appendChild(renderer.domElement)
document.body.appendChild(stats.dom)

// Create Scene
const scene = new THREE.Scene()

// Create Camera
const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.01,
  100.0
)
camera.position.set(0, -5, 10)
camera.lookAt(0, 0, 0)

// HDR Map
const pmrem = new THREE.PMREMGenerator(renderer)
pmrem.compileEquirectangularShader()

const rgbLoader = new RGBELoader()
rgbLoader.setDataType(THREE.UnsignedByteType)
rgbLoader.load('textures/blue_lagoon_night_1k.hdr', (m) => {
  const hdrMap = pmrem.fromEquirectangular(m)
  m.dispose()
  pmrem.dispose()
  scene.background = hdrMap.texture
  scene.environment = hdrMap.texture
})

// Create moon object
const textureLoader = new THREE.TextureLoader()
const moonGeometry = new THREE.SphereGeometry(1.5, 32, 32)
const moonMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xffff00,
  map: textureLoader.load('textures/moon/albedo.jpg'),
  normalMap: textureLoader.load('textures/moon/normal.jpg'),
  roughnessMap: textureLoader.load('textures/moon/roughness.jpg'),
  displacementMap: textureLoader.load('textures/moon/displacement.jpg'),
  aoMap: textureLoader.load('textures/moon/ao.jpg'),
  roughness: 0.8,
  displacementScale: 0.01,
  displacementBias: -0.1
})
const moonMesh = new THREE.Mesh(moonGeometry, moonMaterial)
moonMesh.castShadow = true
moonMesh.position.set(0, 2, 0)
scene.add(moonMesh)

// Create planet object
const planetGeometry = new THREE.SphereGeometry(0.1, 32, 32)
const planetMaterial = new THREE.MeshStandardMaterial({ color: 0x79a6ed })
const planetMesh = new THREE.Mesh(planetGeometry, planetMaterial)
planetMesh.position.set(4, 2, 4)
scene.add(planetMesh)

// Create star objects
const stars = []
const STAR_COUNT = 1500
const starGeometry = new THREE.SphereGeometry(1, 32, 32)
const starMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff })
const starMesh = new THREE.Mesh(starGeometry, starMaterial)
for (let i = 0; i < STAR_COUNT; i++) {
  const star = starMesh.clone()
  star.material = starMaterial.clone()
  const scale = Math.random() * 0.01
  star.scale.set(scale, scale, scale)
  star.position.x = (Math.random() - 0.5) * 20
  star.position.y = (Math.random() - 0.5) * 20
  star.position.z = (Math.random() - 0.5) * 20
  scene.add(star)
  stars.push(star)
}

// Create ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

// Create point light
const pointLight = new THREE.PointLight(0xffffff, 1, 50)
pointLight.position.set(0, 2, 0)
scene.add(pointLight)

// Create directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2)
directionalLight.position.set(0, 10, 0)
directionalLight.castShadow = true
scene.add(directionalLight)

// This function will update every frame
let planetV = 0
const updateFrame = () => {
  requestAnimationFrame(updateFrame)

  planetMesh.position.x = Math.cos(planetV) * 4
  planetMesh.position.z = Math.sin(planetV) * 4
  planetV += 0.02

  for (let i = 0; i < 5; i++) {
    const activeStar = stars[Math.floor(Math.random() * STAR_COUNT)]
    activeStar.material.emissive = new THREE.Color(0xffffff)
    setTimeout(() => {
      activeStar.material.emissive = new THREE.Color(0x000000)
    }, Math.random() * 800)
  }

  // Action
  stats.update()

  // Render
  renderer.render(scene, camera)
}

window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight)
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
})

updateFrame()
