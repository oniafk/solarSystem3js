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
camera.position.set(-2, 3, 10);

// Renderer setup
const renderer = new THREE.WebGLRenderer();
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Resize handler
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Base lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

const starField = getStarfield({ numStars: 5000 });
scene.add(starField);

// Stats
const stats = new Stats();
document.body.appendChild(stats.dom);

//* sun model
// const sun = new SunModel(1, 5);
// scene.add(sun.getSun());

//* Mercury model
// const mercury = new mercuryModel(1, 5);
// scene.add(mercury.getPlanet());

//* Venus model
// const venus = new venusModel(1, 5);
// scene.add(venus.getPlanet());

//* Earth model
// const earth = new earthModel(1, 5);
// scene.add(earth.getPlanet());

//* Mars model
// const mars = new marsModel(1, 5);
// scene.add(mars.getPlanet());

//* Jupiter model
// const jupiter = new jupiterModel(1, 5);
// scene.add(jupiter.getPlanet());

//* Saturn model
// const saturn = new saturnModel(1, 5);
// scene.add(saturn.getPlanet());

//* Uranus model
// const uranus = new uranusModel(1, 5);
// scene.add(uranus.getPlanet());

//* Neptune model
const neptune = new neptuneModel(1, 5);
scene.add(neptune.getPlanet());

let time = 0;
function animate() {
  requestAnimationFrame(animate);
  time += 0.01;

  // sun.animateSun();
  // mercury.animatePlanet();
  // venus.animatePlanet();
  // earth.animatePlanet();
  // mars.animateMars();
  // jupiter.animateJupiter();
  // saturn.animateSaturn();
  // uranus.animateUranus();
  neptune.animateNeptune();

  controls.update();
  renderer.render(scene, camera);
  stats.update();
}

animate();
