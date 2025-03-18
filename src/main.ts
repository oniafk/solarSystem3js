import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import Stats from "three/addons/libs/stats.module.js";
import getStarfield from "./assets/starField";
import { SunModel } from "./assets/planetModels/sunModel";
import { mercuryModel } from "./assets/planetModels/mercuryModel";
import { venusModel } from "./assets/planetModels/venusModel";
import { earthModel } from "./assets/planetModels/earthModel";
import { marsModel } from "./assets/planetModels/marsModel";
import { jupiterModel } from "./assets/planetModels/jupiterModel";
import { saturnModel } from "./assets/planetModels/saturnModel";
import { uranusModel } from "./assets/planetModels/uranusModel";
import { neptuneModel } from "./assets/planetModels/neptuneModel";

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(-2, 25, 350);

const renderer = new THREE.WebGLRenderer();
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//* Resize handler
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

//* Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

//* Base lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

const starField = getStarfield({ numStars: 5000 });
scene.add(starField);

//* Stats
const stats = new Stats();
document.body.appendChild(stats.dom);

const solarSystem = new THREE.Group();
scene.add(solarSystem);

const sunSize = 50;
const sun = new SunModel(1, sunSize);
const sunMesh = sun.getSun();
solarSystem.add(sunMesh);

function createOrbitPath(radius: number) {
  const curve = new THREE.EllipseCurve(0, 0, radius, radius);
  const points = curve.getPoints(100);
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({ color: 0x444444 });
  const ellipse = new THREE.Line(geometry, material);
  ellipse.rotation.x = Math.PI / 2;
  return ellipse;
}

//* Orbits
const mercuryOrbit = new THREE.Group();
const venusOrbit = new THREE.Group();
const earthOrbit = new THREE.Group();
const marsOrbit = new THREE.Group();
const jupiterOrbit = new THREE.Group();
const saturnOrbit = new THREE.Group();
const uranusOrbit = new THREE.Group();
const neptuneOrbit = new THREE.Group();

solarSystem.add(mercuryOrbit);
solarSystem.add(venusOrbit);
solarSystem.add(earthOrbit);
solarSystem.add(marsOrbit);
solarSystem.add(jupiterOrbit);
solarSystem.add(saturnOrbit);
solarSystem.add(uranusOrbit);
solarSystem.add(neptuneOrbit);

solarSystem.add(createOrbitPath(4.1 + sunSize));
solarSystem.add(createOrbitPath(7.7 + sunSize));
solarSystem.add(createOrbitPath(10.7 + sunSize));
solarSystem.add(createOrbitPath(16.3 + sunSize));
solarSystem.add(createOrbitPath(55.8 + sunSize));
solarSystem.add(createOrbitPath(102.4 + sunSize));
solarSystem.add(createOrbitPath(204.9 + sunSize));
solarSystem.add(createOrbitPath(319.7 + sunSize));

//* Create planets and add them to their orbits
const mercury = new mercuryModel(1, 0.35);
mercury.getPlanet().position.x = 4.1 + sunSize;
mercuryOrbit.add(mercury.getPlanet());

const venus = new venusModel(1, 0.87);
venus.getPlanet().position.x = 7.7 + sunSize;
venusOrbit.add(venus.getPlanet());

const earth = new earthModel(1, 0.92);
earth.getPlanet().position.x = 10.7 + sunSize;
earthOrbit.add(earth.getPlanet());

const mars = new marsModel(1, 0.49);
mars.getPlanet().position.x = 16.3 + sunSize;
marsOrbit.add(mars.getPlanet());

const jupiter = new jupiterModel(1, 10.2);
jupiter.getPlanet().position.x = 55.8 + sunSize;
jupiterOrbit.add(jupiter.getPlanet());

const saturn = new saturnModel(1, 8.5);
saturn.getPlanet().position.x = 102.4 + sunSize;
saturnOrbit.add(saturn.getPlanet());

const uranus = new uranusModel(1, 3.7);
uranus.getPlanet().position.x = 204.9 + sunSize;
uranusOrbit.add(uranus.getPlanet());

const neptune = new neptuneModel(1, 3.6);
neptune.getPlanet().position.x = 319.7 + sunSize;
neptuneOrbit.add(neptune.getPlanet());

let time = 0;
function animate() {
  requestAnimationFrame(animate);
  time += 0.01;

  // Sun rotation (only the sun itself)
  sun.animateSun();

  // Planet orbits (rotate each orbit to make planets go around the sun)
  mercuryOrbit.rotation.y += 0.008;
  venusOrbit.rotation.y += 0.007;
  earthOrbit.rotation.y += 0.006;
  marsOrbit.rotation.y += 0.005;
  jupiterOrbit.rotation.y += 0.003;
  saturnOrbit.rotation.y += 0.0025;
  uranusOrbit.rotation.y += 0.002;
  neptuneOrbit.rotation.y += 0.0015;

  // Planet rotations (each planet around its own axis)
  mercury.animatePlanet();
  venus.animatePlanet();
  earth.animatePlanet();
  mars.animateMars();
  jupiter.animateJupiter();
  saturn.animateSaturn();
  uranus.animateUranus();
  neptune.animateNeptune();

  controls.update();
  renderer.render(scene, camera);
  stats.update();
}

animate();
