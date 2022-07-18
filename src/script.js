import './style.css'
import * as THREE from 'three'
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

// Texture
const textures = new THREE.TextureLoader();
const mainTexture = textures.load('/textures/2k_mars.jpg');
const bumpTexture = textures.load('/textures/2k_mars_topo.jpg');
const crossTexture = textures.load('/textures/unnamed.png');

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Objects
 */

// Mars
const marsSphere = new THREE.SphereGeometry(0.8, 32, 32);
const marsMaterial = new THREE.MeshPhongMaterial({
    map: mainTexture,
    bumpMap: bumpTexture,
    bumpScale: 0.005,
})

// Particle
const particles = new THREE.BufferGeometry();
const particlesCount = 7000;

const posArray = new Float32Array(particlesCount * 3);
for(let i=0; i < particlesCount * 3; i++){
    posArray[i] = (Math.random() - 0.5) * (Math.random() * 5)
}

particles.setAttribute('position', new THREE.BufferAttribute(posArray, 3))

const particlesMaterial = new THREE.PointsMaterial({
    size: 0.0010,
    map: crossTexture,
    transparent: true,
    color: 'white'
})

// Mesh
const particlesSphere = new THREE.Points(particles, particlesMaterial);
const mars = new THREE.Mesh(marsSphere, marsMaterial);
scene.add(mars, particlesSphere)

// Lights
const directionalLight = new THREE.DirectionalLight(0xffffff, 1.1);
directionalLight.position.set(50, 50, 30)

const hemiLight = new THREE.HemisphereLight(0xffeeb1, 0x080820, 1)
hemiLight.position.set(50, -10, -10)

scene.add(directionalLight, hemiLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight * 2
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight * 2

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(85, sizes.width / sizes.height, 0.1, 100)
camera.position.set(0, 0, 2)
scene.add(camera)

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: false
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */

const clock = new THREE.Clock()

const tick = () =>
{

    const elapsedTime = clock.getElapsedTime()

    // Update objects
    mars.rotation.y += 0.002;
    particlesSphere.rotation.y = -0.050 * elapsedTime

    // Update Orbital Controls
    // controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()