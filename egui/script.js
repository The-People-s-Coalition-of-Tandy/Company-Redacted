// Initialize the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById('webgl-canvas'),
  antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);

// Carousel parameters
const numItems = 6; // Number of items in the carousel
const radius = 6;   // Radius of the carousel (distance from the center)
const angleStep = (Math.PI * 2) / numItems; // Angle between items
let currentAngle = 0; // Current angle of the carousel
let isAnimating = false; // Flag to prevent rapid animations

// Array to store carousel planes (3D)
const carousel = [];

// Store HTML panels that correspond to each carousel item
const panels = [
  document.getElementById('panel-1'),
  document.getElementById('panel-2'),
  document.getElementById('panel-3'),
  document.getElementById('panel-4'),
  document.getElementById('panel-5'),
  document.getElementById('panel-6')
];

// Create the carousel items (planes without textures)
for (let i = 0; i < numItems; i++) {
  const geometry = new THREE.PlaneGeometry(2, 3);
  const material = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0 }); // Invisible planes

  const plane = new THREE.Mesh(geometry, material);

  // Position the planes in a circular pattern
  const angle = i * angleStep;
  plane.position.set(Math.sin(angle) * radius, 0, Math.cos(angle) * radius);
  plane.lookAt(new THREE.Vector3(0, 0, 0)); // Make the planes face the center
  carousel.push(plane);
  scene.add(plane);
}

// Set camera distance from the carousel to avoid clipping
camera.position.set(0, 0, 12);

// Function to smoothly rotate the carousel
function rotateCarousel(direction) {
  if (isAnimating) return; // Prevent multiple animations at the same time

  isAnimating = true;
  const targetAngle = currentAngle + direction * angleStep;
  
  gsap.to({ angle: currentAngle }, {
    angle: targetAngle,
    duration: 1, // 1 second for smooth rotation
    ease: "power2.inOut", // Easing effect
    onUpdate: function() {
      currentAngle = this.targets()[0].angle;
      for (let i = 0; i < carousel.length; i++) {
        const angle = i * angleStep + currentAngle;
        const plane = carousel[i];
        plane.position.set(Math.sin(angle) * radius, 0, Math.cos(angle) * radius);
        plane.lookAt(new THREE.Vector3(0, 0, 0)); // Ensure planes face the center

        // Update HTML panel position and rotate them to face outward
        const panel = panels[i];
        updatePanelPosition(plane, panel, angle);
        updateZIndex(panel, plane); // Update z-index based on the plane's position
      }
    },
    onComplete: function() {
      isAnimating = false; // Allow new animations
    }
  });
}

// Utility function to update the HTML panel's position and rotation based on the 3D plane's position
function updatePanelPosition(plane, panel, angle) {
  const screenPos = toScreenPosition(plane, camera);
  panel.style.left = `${screenPos.x}px`;   // Set the left position based on 3D conversion
  panel.style.top = `${screenPos.y}px`;    // Set the top position based on 3D conversion

  // Apply the reversed rotation for outward-facing 3D perspective
  const angleDegrees = -angle * (180 / Math.PI); // Reverse the angle for correct outward rotation
  panel.style.transform = `translate(-50%, -50%) rotateY(${angleDegrees}deg)`; // Rotate to face outward
}

// Utility function to update z-index based on the plane's position relative to the camera
function updateZIndex(panel, plane) {
  const distanceFromCamera = camera.position.distanceTo(plane.position);
  // Assign higher z-index for panels closer to the camera
  const zIndex = Math.floor((1 / distanceFromCamera) * 1000); 
  panel.style.zIndex = zIndex;
}

// Utility function to convert 3D positions to 2D screen positions
function toScreenPosition(obj, camera) {
  const vector = new THREE.Vector3();
  const widthHalf = 0.5 * window.innerWidth;
  const heightHalf = 0.5 * window.innerHeight;

  obj.updateMatrixWorld();
  vector.setFromMatrixPosition(obj.matrixWorld);
  vector.project(camera);

  return {
    x: (vector.x * widthHalf) + widthHalf,
    y: -(vector.y * heightHalf) + heightHalf
  };
}

// Event listeners for buttons
document.querySelector('.previous-button').addEventListener('click', () => rotateCarousel(1));
document.querySelector('.next-button').addEventListener('click', () => rotateCarousel(-1));

// Handle resizing of the canvas
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();
