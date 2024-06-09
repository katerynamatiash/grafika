const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Dodanie prostej kostki do sceny
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// Ustawienie początkowej pozycji kamery
camera.position.z = 5;

// Funkcja do aktualizacji sceny
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();

// Obsługa zdarzeń klawiatury
document.addEventListener('keydown', (event) => {
    const key = event.key;
    const step = 0.1;

    switch (key) {
        case 'ArrowUp':
            camera.position.y += step;
            break;
        case 'ArrowDown':
            camera.position.y -= step;
            break;
        case 'ArrowLeft':
            camera.position.x -= step;
            break;
        case 'ArrowRight':
            camera.position.x += step;
            break;
    }
});