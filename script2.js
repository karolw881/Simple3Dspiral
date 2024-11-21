import * as THREE from 'three';

let camera, scene, renderer, group;
let mouseX = 0, mouseY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

// Inicjalizacja sceny i renderera
init();
animate();

function init() {
  // Ustawienia kamery
  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 10000);
  camera.position.z = 2000;

  // Scena i tło
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x2b2b2b);
  scene.fog = new THREE.Fog(0x2b2b2b, 1, 10000);

  // Geometria i materiał (można zmienić na dowolne inne obiekty)
  const geometry = new THREE.BoxGeometry(50, 50, 50);
  const material = new THREE.MeshNormalMaterial();

  // Grupa obiektów
  group = new THREE.Group();

  // Parametry spirali
  const a = 10;  // Odległość między zwojami
  const b = 10;  // Wysokość na zwoje
  const numObjects = 250;  // Liczba obiektów dla każdej spirali
  const angleStep = 0.3;  // Krok kąta

  // Dodawanie siatek do grupy w kształcie spirali (górnej spirali)
  for (let i = 0; i < numObjects; i++) {
    const mesh = new THREE.Mesh(geometry, material);
    
    // Obliczanie położenia obiektu na górnej spirali
    const theta = i * angleStep;  // Kąt dla każdego kroku
    const x = a * theta * Math.cos(theta);
    const y = a * theta * Math.sin(theta);
    const z = b * theta;

    mesh.position.set(x, y, z);
    mesh.rotation.x = Math.random() * 2 * Math.PI;
    mesh.rotation.y = Math.random() * 2 * Math.PI;
    mesh.rotation.z = Math.random() * 2 * Math.PI;
    mesh.matrixAutoUpdate = false;
    mesh.updateMatrix();
    group.add(mesh);
  }

  // Dodawanie siatek do grupy w kształcie spirali (dolnej spirali)
  for (let i = 0; i < numObjects; i++) {
    const mesh = new THREE.Mesh(geometry, material);
    
    // Obliczanie położenia obiektu na dolnej spirali
    const theta = i * angleStep;  // Kąt dla każdego kroku
    const x = a * theta * Math.cos(theta);
    const y = a * theta * Math.sin(theta);
    const z = -b * theta;  // Z ujemne, aby spirala szła w dół

    mesh.position.set(x, y, z);
    mesh.rotation.x = Math.random() * 2 * Math.PI;
    mesh.rotation.y = Math.random() * 2 * Math.PI;
    mesh.rotation.z = Math.random()* 2 * Math.PI;
    mesh.matrixAutoUpdate = false;
    mesh.updateMatrix();
    group.add(mesh);
  }

  // Dodanie grupy do sceny
  scene.add(group);

  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: false });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Zdarzenia
  document.addEventListener('mousemove', onDocumentMouseMove);
  window.addEventListener('resize', onWindowResize);
}

// Funkcja obsługująca zmianę rozmiaru okna
function onWindowResize() {
  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// Funkcja obsługująca ruch myszki
function onDocumentMouseMove(event) {
  mouseX = (event.clientX - windowHalfX) * 10;
  mouseY = (event.clientY - windowHalfY) * 10;
}

// Funkcja animacji
function animate() {
  requestAnimationFrame(animate);
  render();
}

// Funkcja renderowania
function render() {
  const time = Date.now() * 0.001;
  const rx = Math.sin(time * 0.7) * 0.5;
  const ry = Math.sin(time * 0.3) * 0.5;
  const rz = Math.sin(time * 0.2) * 0.5;

  // Aktualizacja pozycji kamery na podstawie ruchu myszki
  camera.position.x += (mouseX - camera.position.x) * 0.05;
  camera.position.y += (-mouseY - camera.position.y) * 0.05;
  camera.lookAt(scene.position);

  // Obrót grupy obiektów (spirale)
  group.rotation.x = rx;
  group.rotation.y = ry;
  group.rotation.z = rz;

  // Renderowanie sceny
  renderer.render(scene, camera);
}