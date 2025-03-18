import * as THREE from "three";
import { getFresnelMat } from "../getFrenelMaterial";

export class saturnModel {
  group;
  baseRadius: number; // Base radius for the sun
  loader = new THREE.TextureLoader();
  planetMap: string;
  ringTexture: string;

  constructor(planetSize: number = 1, baseRadius: number = 5) {
    this.planetMap = "./images/2k_saturn.jpg";
    this.ringTexture = "./images/2k_saturn_ring_alpha.png";
    this.group = new THREE.Group();
    this.baseRadius = baseRadius;

    this.createVenus();
    this.createRing();

    this.group.scale.set(planetSize, planetSize, planetSize);
  }

  createVenus() {
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
      rimHex: 0xecebd6,
      facingHex: 0x000000,
      fresnelBias: 0.4,
      fresnelScale: 0.2,
      fresnelPower: 2.0,
    });
    const planetGlowMesh = new THREE.Mesh(
      planetGlowGeometry,
      planetGlowMaterial
    );
    planetGlowMesh.scale.set(1.01, 1.01, 1.01);

    this.group.add(planetGlowMesh);
  }

  createRing() {
    const ringTexture = this.loader.load(this.ringTexture);

    const innerRadius = this.baseRadius * 1.1;
    const outerRadius = this.baseRadius * 2.3;

    const ringGeometry = new THREE.RingGeometry(
      innerRadius,
      outerRadius,
      64,
      8
    );

    const pos = ringGeometry.attributes.position;
    const v3 = new THREE.Vector3();
    const uv = ringGeometry.attributes.uv;

    for (let i = 0; i < pos.count; i++) {
      v3.fromBufferAttribute(pos, i);

      const radius = v3.length();
      const normalizedRadius =
        (radius - innerRadius) / (outerRadius - innerRadius);

      const theta = Math.atan2(v3.y, v3.x);
      const u = (theta + Math.PI) / (Math.PI * 2);
      const v = normalizedRadius;

      uv.setXY(i, v, u);
    }

    const ringMaterial = new THREE.MeshStandardMaterial({
      map: ringTexture,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.8,
      depthWrite: false,
      roughness: 0.8,
      metalness: 0.2,
    });

    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = Math.PI / 2;
    this.group.add(ring);

    this.group.rotation.z = 25 * (Math.PI / 180);
  }

  animateSaturn(delta = 0.01) {
    this.group.rotation.y += delta;
  }

  setSize(planetSize: number) {
    this.group.scale.set(planetSize, planetSize, planetSize);
  }

  getPlanet() {
    return this.group;
  }
}
