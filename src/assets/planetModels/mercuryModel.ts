import * as THREE from "three";
import { getFresnelMat } from "../getFrenelMaterial";

export class mercuryModel {
  group;
  baseRadius: number; // Base radius for the sun
  loader = new THREE.TextureLoader();
  planetMap: string;
  planetTexture: string;

  constructor(planetSize: number = 1, baseRadius: number = 5) {
    this.planetMap = "./images/2k_mercury.jpg";
    this.planetTexture = "./images/mercurybump.jpg";
    this.group = new THREE.Group();
    this.baseRadius = baseRadius; // Store base radius

    this.createMercury();

    // Apply overall scaling
    this.group.scale.set(planetSize, planetSize, planetSize);
  }

  createMercury() {
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

    const planetGlowGeometry = new THREE.IcosahedronGeometry(
      this.baseRadius * 1.02,
      8
    );
    const planetGlowMaterial = getFresnelMat({
      rimHex: 0xe9edde,
      facingHex: 0x000000,
      fresnelBias: 0.4,
      fresnelScale: 0.3,
      fresnelPower: 4.0,
    });
    const planetGlowMesh = new THREE.Mesh(
      planetGlowGeometry,
      planetGlowMaterial
    );
    planetGlowMesh.scale.set(1.0, 1.05, 1.05);

    this.group.add(planetGlowMesh);
  }

  animatePlanet(delta = 0.002) {
    this.group.rotation.y += delta;
  }

  setSize(planetSize: number) {
    this.group.scale.set(planetSize, planetSize, planetSize);
  }

  getPlanet() {
    return this.group;
  }
}
