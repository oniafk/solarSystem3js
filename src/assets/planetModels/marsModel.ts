import * as THREE from "three";
import { getFresnelMat } from "../getFrenelMaterial";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

export class marsModel {
  group;
  baseRadius: number;
  loader = new THREE.TextureLoader();
  planetMap: string;
  planetTexture: string;
  moonOrbits: THREE.Group[] = [];

  constructor(planetSize: number = 1, baseRadius: number = 5) {
    this.planetMap = "./images/2k_mars.jpg";
    this.planetTexture = "./images/mars_1k_topo.jpg";
    this.group = new THREE.Group();
    this.baseRadius = baseRadius;

    this.createMars();
    this.createMoons();

    this.group.scale.set(planetSize, planetSize, planetSize);
  }

  createMars() {
    const planetMap = this.loader.load(this.planetMap);
    const planetTexture = this.loader.load(this.planetTexture);

    const planetGeometry = new THREE.IcosahedronGeometry(this.baseRadius, 8);
    const planetMaterial = new THREE.MeshStandardMaterial({
      map: planetMap,
    });
    const planetMesh = new THREE.Mesh(planetGeometry, planetMaterial);
    this.group.add(planetMesh);

    const planetBumpGeometry = new THREE.IcosahedronGeometry(
      this.baseRadius * 1.01,
      8
    );
    const planetBumpMaterial = new THREE.MeshStandardMaterial({
      map: planetTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      opacity: 0.3,
    });
    const planetBumpMesh = new THREE.Mesh(
      planetBumpGeometry,
      planetBumpMaterial
    );
    this.group.add(planetBumpMesh);

    const planetAtmosphereGeometry = new THREE.IcosahedronGeometry(
      this.baseRadius * 1.02,
      8
    );
    const planetAtmosphereMaterial = getFresnelMat({
      rimHex: 0xf2b70e,
      facingHex: 0x000000,
      fresnelBias: 0.4,
      fresnelScale: 0.3,
      fresnelPower: 4.0,
    });
    const planetAtmosphereMesh = new THREE.Mesh(
      planetAtmosphereGeometry,
      planetAtmosphereMaterial
    );
    this.group.add(planetAtmosphereMesh);
  }

  createMoons() {
    const loader = new GLTFLoader();

    const moon1Orbit = new THREE.Group();
    this.moonOrbits.push(moon1Orbit);
    this.group.add(moon1Orbit);

    const moon2Orbit = new THREE.Group();
    this.moonOrbits.push(moon2Orbit);
    this.group.add(moon2Orbit);

    moon1Orbit.rotation.x = 25 * (Math.PI / 180);
    moon2Orbit.rotation.x = -35 * (Math.PI / 180);

    loader.load("models/rock01.glb", (gltf) => {
      gltf.scene.scale.set(0.2, 0.2, 0.2);
      gltf.scene.position.set(1.01, 0, 0);
      moon1Orbit.add(gltf.scene);
    });

    loader.load("models/rock02.glb", (gltf) => {
      gltf.scene.scale.set(0.2, 0.2, 0.2);
      gltf.scene.position.set(1.2, 0, 0);
      moon2Orbit.add(gltf.scene);
    });
  }

  animateMars(delta = 0.002) {
    this.group.rotation.y += delta;

    if (this.moonOrbits.length >= 2) {
      this.moonOrbits[0].rotation.y += delta * 2.5;
      this.moonOrbits[1].rotation.y -= delta * 1.8;
    }
  }

  setSize(size: number) {
    this.group.scale.set(size, size, size);
  }

  getPlanet() {
    return this.group;
  }
}
