import * as THREE from "three";
import { getFresnelMat } from "../getFrenelMaterial";

export class marsModel {
  group;
  baseRadius: number;
  loader = new THREE.TextureLoader();
  planetMap: string;
  planetTexture: string;

  constructor(planetSize: number = 1, baseRadius: number = 5) {
    this.planetMap = "./images/2k_mars.jpg";
    this.planetTexture = "./images/mars_1k_topo.jpg";
    this.group = new THREE.Group();
    this.baseRadius = baseRadius;

    this.createMars();

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

  animateMars() {
    this.group.rotation.y += 0.002;
  }

  setSize(size: number) {
    this.group.scale.set(size, size, size);
  }

  getPlanet() {
    return this.group;
  }
}
