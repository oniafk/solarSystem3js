import * as THREE from "three";
import { getFresnelMat } from "../getFrenelMaterial";

export class uranusModel {
  group;
  baseRadius: number; // Base radius for the sun
  loader = new THREE.TextureLoader();
  planetMap: string;
  ringTexture: string;

  constructor(planetSize: number = 1, baseRadius: number = 5) {
    this.planetMap = "./images/2k_uranus.jpg";
    this.ringTexture = "./images/uranusringcolour.jpg";
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
      rimHex: 0x71e6ec,
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

    // Fix the ring geometry parameters
    // Parameters: innerRadius, outerRadius, thetaSegments, phiSegments
    const innerRadius = this.baseRadius * 1.4; // Start ring at 1.3x planet radius
    const outerRadius = this.baseRadius * 1.7; // End at 2.5x planet radius

    const ringGeometry = new THREE.RingGeometry(
      innerRadius, // Inner radius - make this larger for bigger interior space
      outerRadius, // Outer radius - make this larger for wider rings
      64, // Theta segments (detail around the ring)
      8 // Phi segments (detail from inner to outer edge)
    );

    const pos = ringGeometry.attributes.position;
    const v3 = new THREE.Vector3();
    const uv = ringGeometry.attributes.uv;

    for (let i = 0; i < pos.count; i++) {
      v3.fromBufferAttribute(pos, i);

      // Calculate normalized radius (0 at inner edge, 1 at outer edge)
      // Use the actual inner and outer radii we defined above
      const radius = v3.length();
      const normalizedRadius =
        (radius - innerRadius) / (outerRadius - innerRadius);

      // Map to UV coordinates (u around the ring, v from inner to outer)
      const theta = Math.atan2(v3.y, v3.x);
      const u = (theta + Math.PI) / (Math.PI * 2);
      const v = normalizedRadius;

      uv.setXY(i, v, u);
    }

    // Create material for the ring - use Saturn rings texture
    const ringMaterial = new THREE.MeshStandardMaterial({
      map: ringTexture,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.5, // Slightly transparent
      depthWrite: false, // Important for transparent objects
      roughness: 0.8, // Slightly rough appearance
      metalness: 0.2, // Low metalness
    });

    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = Math.PI / 2;
    this.group.add(ring);
  }

  animateUranus(delta = 0.002) {
    this.group.rotation.y += delta;
  }

  setSize(planetSize: number) {
    this.group.scale.set(planetSize, planetSize, planetSize);
  }

  getPlanet() {
    return this.group;
  }
}
