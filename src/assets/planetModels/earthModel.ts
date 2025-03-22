import * as THREE from "three";
import { getFresnelMat } from "../getFrenelMaterial";

export class earthModel {
  group;
  baseRadius: number;
  loader = new THREE.TextureLoader();
  planetMap: string;
  planetTexture: string;
  planetClouds: string;
  planetLights: string;
  planetCloudsMesh: THREE.Mesh;
  moonMesh: THREE.Mesh;
  moonMap: string;
  moonTexture: string;

  constructor(planetSize: number = 1, baseRadius: number = 5) {
    this.planetMap = "./images/2k_earth_daymap.jpg";
    this.planetTexture = "./images/earthbump1k.jpg";
    this.planetClouds = "./images/2k_earth_clouds.jpg";
    this.planetLights = "./images/2k_earth_nightmap.jpg";
    this.moonMap = "./images/moonmap4k.jpg";
    this.moonTexture = "./images/moonbump4k.jpg";
    this.group = new THREE.Group();
    this.baseRadius = baseRadius;
    this.moonMesh = new THREE.Mesh();
    this.planetCloudsMesh = new THREE.Mesh();

    this.createEart();
    this.createMoon();
    this.group.scale.set(planetSize, planetSize, planetSize);
  }

  createEart() {
    const planetMap = this.loader.load(this.planetMap);
    const planetTexture = this.loader.load(this.planetTexture);
    const planetLights = this.loader.load(this.planetLights);

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
      opacity: 0.4,
    });
    const planetBumpMesh = new THREE.Mesh(
      planetBumpGeometry,
      planetBumpMaterial
    );
    this.group.add(planetBumpMesh);

    const planetLightsGeometry = new THREE.IcosahedronGeometry(
      this.baseRadius * 1.01,
      8
    );
    const planetLightsMaterial = new THREE.MeshStandardMaterial({
      map: planetLights,
      blending: THREE.AdditiveBlending,
      opacity: 1,
    });

    const planetLightMesh = new THREE.Mesh(
      planetLightsGeometry,
      planetLightsMaterial
    );

    this.group.add(planetLightMesh);

    const planetCloudsGeometry = new THREE.IcosahedronGeometry(
      this.baseRadius * 1.03,
      8
    );

    const planetCloudsMaterial = new THREE.MeshStandardMaterial({
      map: this.loader.load(this.planetClouds),
      transparent: true,
      blending: THREE.AdditiveBlending,
      opacity: 0.6,
    });

    this.planetCloudsMesh = new THREE.Mesh(
      planetCloudsGeometry,
      planetCloudsMaterial
    );

    this.group.add(this.planetCloudsMesh);

    const planetGlowGeometry = new THREE.IcosahedronGeometry(
      this.baseRadius * 1.04,
      8
    );
    const planetGlowMaterial = getFresnelMat({
      fresnelBias: 0.4,
      fresnelScale: 0.3,
      fresnelPower: 4.0,
    });
    const planetGlowMesh = new THREE.Mesh(
      planetGlowGeometry,
      planetGlowMaterial
    );
    planetGlowMesh.scale.set(1.0, 1.0, 1.0);

    this.group.add(planetGlowMesh);

    this.group.rotation.z = 25 * (Math.PI / 180);
  }

  createMoon() {
    const moonTexture = this.loader.load(this.moonMap);
    const moonBump = this.loader.load(this.moonTexture);

    const moonGeometry = new THREE.IcosahedronGeometry(0.18, 8);
    const moonMaterial = new THREE.MeshStandardMaterial({
      map: moonTexture,
    });
    this.moonMesh = new THREE.Mesh(moonGeometry, moonMaterial);
    this.moonMesh.position.set(1.5, 0, 0);

    const moonBumpGeometry = new THREE.IcosahedronGeometry(0.18, 8);
    const moonBumpMaterial = new THREE.MeshStandardMaterial({
      map: moonBump,
      transparent: true,
      blending: THREE.AdditiveBlending,
      opacity: 0.4,
    });
    const moonBumpMesh = new THREE.Mesh(moonBumpGeometry, moonBumpMaterial);
    moonBumpMesh.position.set(1, 0, 0);

    this.group.add(this.moonMesh);
    this.group.add(moonBumpMesh);

    // moon orbit
    const moonOrbit = new THREE.Group();
    moonOrbit.add(this.moonMesh);
    moonOrbit.add(moonBumpMesh);
    moonOrbit.position.set(0, 0, 0);
    this.group.add(moonOrbit);

    this.moonMesh.rotation.z = 50 * (Math.PI / 180);
  }

  animatePlanet(delta = 0.005) {
    this.group.rotation.y += delta;
    this.planetCloudsMesh.rotation.y += 0.0050001;
  }

  setSize(planetSize: number) {
    this.group.scale.set(planetSize, planetSize, planetSize);
  }

  getPlanet() {
    return this.group;
  }
}
