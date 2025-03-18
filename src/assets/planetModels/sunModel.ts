import * as THREE from "three";
import { getFresnelMat } from "../getFrenelMaterial";

export class SunModel {
  group;
  baseRadius: number; // Base radius for the sun
  loader = new THREE.TextureLoader();
  sunTexture1: string;
  sunTexture2: string;

  constructor(sunSize: number = 1, baseRadius: number = 50) {
    this.sunTexture2 = "./images/sunmap.jpg";
    this.sunTexture1 = "./images/2k_sun.jpg";
    this.group = new THREE.Group();
    this.baseRadius = baseRadius;

    this.createSun();

    this.group.scale.set(sunSize, sunSize, sunSize);
  }

  createSun() {
    const sunMap = this.loader.load(this.sunTexture1);
    const sunMap2 = this.loader.load(this.sunTexture2);

    const sunGeometry = new THREE.IcosahedronGeometry(this.baseRadius, 8);
    const sunMaterial = new THREE.MeshStandardMaterial({
      map: sunMap,
    });
    const sunMesh = new THREE.Mesh(sunGeometry, sunMaterial);
    this.group.add(sunMesh);

    const sunFireGeometry = new THREE.IcosahedronGeometry(
      this.baseRadius * 1.01,
      8
    );
    const sunFireMaterial = new THREE.MeshStandardMaterial({
      map: sunMap2,
      transparent: true,
      blending: THREE.AdditiveBlending,
      opacity: 0.7,
    });
    const sunFireMesh = new THREE.Mesh(sunFireGeometry, sunFireMaterial);
    this.group.add(sunFireMesh);

    const sunGlowGeometry = new THREE.IcosahedronGeometry(
      this.baseRadius * 1.01,
      8
    );
    const sunGlowMaterial = getFresnelMat({
      rimHex: 0xf19504,
      facingHex: 0x000000,
      fresnelBias: 0.4,
      fresnelScale: 0.2,
      fresnelPower: 4.0,
    });
    const sunGlowMesh = new THREE.Mesh(sunGlowGeometry, sunGlowMaterial);

    sunGlowMesh.scale.set(1.05, 1.05, 1.05);
    this.group.add(sunGlowMesh);
  }

  animateSun(delta = 0.002) {
    this.group.rotation.y += delta;
  }

  setSize(sunSize: number) {
    this.group.scale.set(sunSize, sunSize, sunSize);
  }

  getSun() {
    return this.group;
  }
}
