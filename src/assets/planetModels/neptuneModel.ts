import * as THREE from "three";
import { getFresnelMat } from "../getFrenelMaterial";

export class neptuneModel {
  group;
  baseRadius: number;
  loader = new THREE.TextureLoader();
  planetMap: string;

  constructor(planetSize: number = 1, baseRadius: number = 5) {
    this.planetMap = "./images/2k_neptune.jpg";
    this.group = new THREE.Group();
    this.baseRadius = baseRadius;

    this.createJupiter();

    this.group.scale.set(planetSize, planetSize, planetSize);
  }

  createJupiter() {
    const planetMap = this.loader.load(this.planetMap);

    const planetGeometry = new THREE.IcosahedronGeometry(this.baseRadius, 8);
    const planetMaterial = new THREE.MeshStandardMaterial({
      map: planetMap,
    });
    const planetMesh = new THREE.Mesh(planetGeometry, planetMaterial);
    this.group.add(planetMesh);

    const planetGlowGeometry = new THREE.IcosahedronGeometry(
      this.baseRadius * 1.02,
      8
    );
    const planetGlowMaterial = getFresnelMat({
      rimHex: 0x5cbdc2,
      facingHex: 0x000000,
      fresnelBias: 0.5,
      fresnelScale: 0.3,
      fresnelPower: 4.0,
    });
    const planetGlowMesh = new THREE.Mesh(
      planetGlowGeometry,
      planetGlowMaterial
    );
    planetGlowMesh.scale.set(1.01, 1.01, 1.01);

    this.group.add(planetGlowMesh);
  }

  animateNeptune(delta = 0.002) {
    this.group.rotation.y += delta;
  }

  setSize(planetSize: number) {
    this.group.scale.set(planetSize, planetSize, planetSize);
  }

  getPlanet() {
    return this.group;
  }
}
