import * as THREE from 'three';

let camera, scene, renderer, group;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

let targetX = 0;
let targetY = 0;

init();
animate();

function init() {
  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    50000
  );
  camera.position.set(-10, 30, 15000);

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x101010); // Ciemniejsze tło dla kontrastu

  group = new THREE.Group();

  // Parametry spirali
  const a = 80; // Współczynnik skali
  const alpha = Math.PI / 5; // Kąt 45 stopni
  const turns = 10;
  const pointsPerTurn = 66;
  const totalPoints = turns * pointsPerTurn ;
  const sphereRadius = 150;

  // Punktowe źródło światła
  const pointLight = new THREE.PointLight(0xffffff, 2, 30000);
  pointLight.position.set(5000, 5000, 5000);
  scene.add(pointLight);

  // Helper dla pozycji światła
  const lightHelper = new THREE.PointLightHelper(pointLight, 100);
  scene.add(lightHelper);

  // Tablica kolorów dla kul spirali
  const colors = [0xff6347, 0xadd8e6, 0x98fb98, 0xffdab9, 0xffb6c1];

  // Tworzenie górnej spirali z kolorowymi kulami
  for (let i = 0; i <= totalPoints; i++) {
    const t = (i / totalPoints) * turns * 2 * Math.PI;
    const r = a * t;
    const x = r * Math.cos(t);
    const y = r * Math.sin(t);
    const z = r * Math.tan(alpha);

    const sphereMaterial = new THREE.MeshStandardMaterial({
      color: colors[i % colors.length],
    });
    const sphereGeometry = new THREE.SphereGeometry(sphereRadius, 16, 16);
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(x, z, y);
    group.add(sphere);
  }

  // Tworzenie dolnej spirali z kolorowymi kulami
  for (let i = 0; i <= totalPoints; i++) {
    const t = (i / totalPoints) * turns * 2 * Math.PI;
    const r = a * t;
    const x = r * Math.cos(t);
    const y = r * Math.sin(t);
    const z = -(r * Math.tan(alpha));

    const sphereMaterial = new THREE.MeshStandardMaterial({
      color: colors[i % colors.length],
    });
    const sphereGeometry = new THREE.SphereGeometry(sphereRadius, 16, 16);
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(x, z, y);
    group.add(sphere);
  }

  scene.add(group);

  // Ściany osiowe z przezroczystością
  const wallMaterial = new THREE.MeshStandardMaterial({
    color: 0x333333,
    side: THREE.DoubleSide,
    wireframe: false,
    opacity: 0.4,
    transparent: true,
  });
  const wallSize = 20000;

  // Ściana wyr// Ściana wyrównana z płaszczyzną YZ (oś OX)
  const oxWall = new THREE.Mesh(
    new THREE.PlaneGeometry(wallSize, wallSize),
    wallMaterial
  );
  oxWall.position.set(-wallSize / 2, 0, 0);
  oxWall.rotation.y = Math.PI / 2;
  scene.add(oxWall);

  // Ściana wyrównana z płaszczyzną XZ (oś OY)
  const oyWall = new THREE.Mesh(
    new THREE.PlaneGeometry(wallSize, wallSize),
    wallMaterial
  );
  oyWall.position.set(0, -wallSize / 2, 0);
  oyWall.rotation.x = Math.PI / 2;
  scene.add(oyWall);

  // Ściana wyrównana z płaszczyzną XY (oś OZ)
  const ozWall = new THREE.Mesh(
    new THREE.PlaneGeometry(wallSize, wallSize),
    wallMaterial
  );
  ozWall.position.set(0, 0, -wallSize / 2);
  scene.add(ozWall);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  document.addEventListener('mousemove', onDocumentMouseMove);
  window.addEventListener('resize', onWindowResize);
}

function onWindowResize() {
  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function onDocumentMouseMove(event) {
  targetX = (event.clientX - windowHalfX) * 0.002; // Mniejszy wpływ na obrót
  targetY = (event.clientY - windowHalfY) * 0.002; // Mniejszy wpływ na obrót
}

function animate() {
  requestAnimationFrame(animate);
  render();
}

function render() {
  // Obrót kamery na podstawie kursora
  camera.rotation.y += (targetX - camera.rotation.y) * 0.1; // Zmiana kąta rotacji wokół osi Y
  camera.rotation.x += (targetY - camera.rotation.x) * 0.1; // Zmiana kąta rotacji wokół osi X
  camera.lookAt(scene.position);

  group.rotation.y += 0.01; // Powolne obracanie grupy

  renderer.render(scene, camera);
}
