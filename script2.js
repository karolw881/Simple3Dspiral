import * as THREE from 'three';

let camera, scene, renderer, group;
let mouseX = 0, mouseY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

init();
animate();

function init() {
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 20000);
    camera.position.set(300, 2000, 20000);

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

    group = new THREE.Group();

    // Parametry spirali
    const a = 50; // Współczynnik skali
    const alpha = Math.PI / 4; // Kąt nachylenia (45 stopni)
    const turns = 8; // Liczba obrotów
    const pointsPerTurn = 100; // Punkty na jeden obrót
    const totalPoints = turns * pointsPerTurn;

    // Tworzenie górnej spirali
    const geometryUp = new THREE.Geometry();
    for (let i = 0; i <= totalPoints; i++) {
        const t = (i / totalPoints) * turns * 2 * Math.PI;
        const r = a * t;
        const x = r * Math.cos(t);
        const y = r * Math.sin(t);
        const z = r * Math.tan(alpha);
        geometryUp.vertices.push(new THREE.Vector3(x, z, y));
    }
    
    // Tworzenie dolnej spirali (symetrycznej)
    const geometryDown = new THREE.Geometry();
    for (let i = 0; i <= totalPoints; i++) {
        const t = (i / totalPoints) * turns * 2 * Math.PI;
        const r = a * t;
        const x = r * Math.cos(t);
        const y = r * Math.sin(t);
        const z = -(r * Math.tan(alpha)); // Ujemne z dla odbicia
        geometryDown.vertices.push(new THREE.Vector3(x, z, y));
    }
    
    const materialUp = new THREE.LineBasicMaterial({ 
        color: 0x0000ff,
        linewidth: 2
    });
    
    const materialDown = new THREE.LineBasicMaterial({ 
        color: 0x0000ff,
        linewidth: 2
    });
    
    const spiralUp = new THREE.Line(geometryUp, materialUp);
    const spiralDown = new THREE.Line(geometryDown, materialDown);
    group.add(spiralUp);
    group.add(spiralDown);

    // Tworzenie stożków
    const coneHeight = a * turns * 2 * Math.PI * Math.tan(alpha);
    const coneRadius = a * turns * 2 * Math.PI;
    const coneGeometry = new THREE.ConeGeometry(coneRadius, coneHeight, 32, 1, true);
    const coneMaterial = new THREE.MeshBasicMaterial({ 
        color: 0xcccccc,
        transparent: true,
        opacity: 0.2,
        wireframe: true
    });
    
    // Górny stożek
    const coneUp = new THREE.Mesh(coneGeometry, coneMaterial);
    coneUp.position.y = coneHeight / 2;
    group.add(coneUp);

    // Dolny stożek (odbity)
    const coneDown = new THREE.Mesh(coneGeometry, coneMaterial);
    coneDown.position.y = -coneHeight / 2;
    coneDown.rotation.x = Math.PI; // Obrót o 180 stopni
    group.add(coneDown);

    // Oś odniesienia
    const axisGeometry = new THREE.Geometry();
    axisGeometry.vertices.push(
        new THREE.Vector3(0, -coneHeight * 1.2, 0),
        new THREE.Vector3(0, coneHeight * 1.2, 0)
    );
    const axisMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
    const axis = new THREE.Line(axisGeometry, axisMaterial);
    group.add(axis);

    scene.add(group);

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
    mouseX = (event.clientX - windowHalfX) * 0.2;
    mouseY = (event.clientY - windowHalfY) * 0.2;
}

function animate() {
    window.requestAnimationFrame(() => animate());
    render();
}

function render() {
    camera.position.x += (mouseX - camera.position.x) * 0.02;
    camera.position.y += (-mouseY - camera.position.y) * 0.02;
    camera.lookAt(scene.position);

    group.rotation.y += 0.002;

    renderer.render(scene, camera);
}