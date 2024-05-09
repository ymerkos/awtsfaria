//B"H
// Import libraries
import * as THREE from '/games/scripts/build/three.module.js';
import { OrbitControls } from "/games/scripts/jsm/controls/OrbitControls.js"
import { GUI } from '/games/scripts/jsm/libs/lil-gui.module.min.js';
import { TransformControls } from '/games/scripts/jsm/controls/TransformControls.js'; // Import TransformControls

window.THREE=THREE
var keyEvents = {
  ".": (e) => {
    var cnt = controls;
    if(!cnt) console.log("NO controls");
    var sl = selectedObject;
    if(!sl) console.log("NO selected")
      cnt.target = sl.position.clone();
  }
}
// Scene and camera setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// Material for the outline
const outlineMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00, wireframe: true }); // Yellow wireframe

// Renderer setup
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('canvas') });
renderer.setSize(window.innerWidth, window.innerHeight);



function makeGrid() {

  // Long line geometry (large number of segments for extended lines)

  const lineSegmentLength = 100; // Adjust length of each line segment (longer for more visible lines)

  const numSegments = 1000; // Adjust for desired line length (more segments, longer lines)



  // X-axis line (red)

  const xLineGeometry = new THREE.BufferGeometry();

  const xLinePositions = new Float32Array(numSegments * 2 * 3); // Array size based on segments

  // Set positions for the x-axis line

  for (let i = 0; i < numSegments; i++) {

    xLinePositions[i * 6] = -lineSegmentLength / 2 + i;

    xLinePositions[i * 6 + 1] = 0;

    xLinePositions[i * 6 + 2] = 0;

    xLinePositions[i * 6 + 3] = -lineSegmentLength / 2 + i;

    xLinePositions[i * 6 + 4] = 0;

    xLinePositions[i * 6 + 5] = 0;

  }

  xLineGeometry.setAttribute('position', new THREE.BufferAttribute(xLinePositions, 3));

  const xLineMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 }); // Red color

  const xLine = new THREE.Line(xLineGeometry, xLineMaterial);

  scene.add(xLine);



  // Z-axis line (green)

  const zLineGeometry = new THREE.BufferGeometry();

  const zLinePositions = new Float32Array(numSegments * 2 * 3); // Array size based on segments

  // Set positions for the z-axis line

  for (let i = 0; i < numSegments; i++) {

    zLinePositions[i * 6] = 0;

    zLinePositions[i * 6 + 1] = 0;

    zLinePositions[i * 6 + 2] = -lineSegmentLength / 2 + i;

    zLinePositions[i * 6 + 3] = 0;

    zLinePositions[i * 6 + 4] = 0;

    zLinePositions[i * 6 + 5] = -lineSegmentLength / 2 + i;

  }

  zLineGeometry.setAttribute('position', new THREE.BufferAttribute(zLinePositions, 3));

  const zLineMaterial = new THREE.LineBasicMaterial({ color: 0x0000ff }); // Green color

  const zLine = new THREE.Line(zLineGeometry, zLineMaterial);

  scene.add(zLine);



  // Grid lines (gray, checkered pattern)

  const gridSize = 100; // Adjust grid size

  const gridGeometry = new THREE.BufferGeometry();

  const gridPositions = new Float32Array((gridSize + 1) * 4 * 2 * 3 - 12); // Positions for all grid lines (optimized), excluding the lines at X and Z axis

  let index = 0;

  // Set positions for grid lines

  for (let i = -gridSize; i <= gridSize; i++) {

    if (i !== 0) { // Exclude the lines at X and Z axis

      // Create positions for horizontal lines (every other line for checkered pattern)

      gridPositions[index++] = -gridSize;

      gridPositions[index++] = 0;

      gridPositions[index++] = i;

      gridPositions[index++] = gridSize;

      gridPositions[index++] = 0;

      gridPositions[index++] = i;



      // Create positions for vertical lines (every other line for checkered pattern)

      gridPositions[index++] = i;

      gridPositions[index++] = 0;

      gridPositions[index++] = -gridSize;

      gridPositions[index++] = i;

      gridPositions[index++] = 0;

      gridPositions[index++] = gridSize;

    }

  }

  gridGeometry.setAttribute('position', new THREE.BufferAttribute(gridPositions, 3));

  const gridMaterial = new THREE.LineBasicMaterial({ color: 0xcccccc,transparent:true,opacity:0.5}); // Gray color

  const grid = new THREE.LineSegments(gridGeometry, gridMaterial);

  scene.add(grid);

}



// Orbit controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enabled = false
// Object tree element with absolute positioning
const objectTree = document.getElementById('object-tree');
objectTree.style.position = 'absolute';
objectTree.style.top = '10px'; // Adjust positioning as needed
objectTree.style.left = '10px'; // Adjust positioning as needed

// Scene objects and selection
let selectedObject = null;
const sceneObjects = [];

// User data for object identification
const userDataMap = new Map();
// Flag to indicate mouse down state
let isMouseDown = false;

// Flag to indicate delayed OrbitControls activation
let isOrbitControlsEnabled = false; // Initially disabled

// Timer for delayed OrbitControls activation
let orbitControlsTimeout;
var dragged = false;
// Delay time for activating OrbitControls (in milliseconds)
const orbitControlsDelay = 1000; // Adjust as needed
var startTime = Date.now()
canvas.addEventListener('mousedown', (event) => {
  // Set flag on mousedown
  isMouseDown = true;
  dragged = false;
  startTime = Date.now();
  orbitControlsTimeout=setTimeout(() => {
    //controls.enabled = true;
   // isOrbitControlsEnabled = true
  },orbitControlsDelay)
});
canvas.addEventListener("mousemove", e => {
  if(isMouseDown) {
    dragged = true;
  }
})
canvas.addEventListener('mouseup', (event) => {
  controls.enabled = false;
  isOrbitControlsEnabled = false;
  clearTimeout(orbitControlsTimeout)
  isMouseDown = false;
  if(Date.now() - startTime < orbitControlsDelay) {
    //just click not orbit

  } else {
    
    //handleSimulatedClick()
  }
  // Disable OrbitControls explicitly on mouseup
  
});

function handleSimulatedClick() {
  // Option 1: Dispatch a custom event (more reliable)
  const simulatedClickEvent = new CustomEvent('click');
  canvas.dispatchEvent(simulatedClickEvent);
  console.log("HI")
  // Option 2: Focus the canvas and blur immediately (may not work in all browsers)
  // canvas.focus();
  // canvas.blur();
}


// Function to create a new object (e.g., cube)
function createObject(geometry, material) {
  const object = new THREE.Mesh(geometry, material);
  object.userData.originalMaterial = object.material;
  object.userData.id = Math.random().toString(36).substring(2, 15); // Unique identifier
  sceneObjects.push(object);
  scene.add(object);
  updateObjectTree();
  return object;
}
// Function to update object tree display with highlighting
function updateObjectTree() {
  objectTree.innerHTML = '';
  sceneObjects.forEach(object => {
    const element = document.createElement('div');
    element.innerText = object.userData.id;
    element.classList.add('object-tree-item'); // Add CSS class for styling
    object.userData.element = element;
    // Highlight on click
    element.addEventListener('click', () => {
      if(dragged) return;
      
    
    
      console.log("HO!",window.g=object,selectedObject == object)
      toggleSelect(object)
    
    });

    objectTree.appendChild(element);
  });
 // updateObjectHighlight(); // Initial highlight for selected object
}
window.selectObject = selectObject
function selectObjectTree(obj) {
  deselectObjectTree()
  obj?.userData?.element?.classList.add("selected")
}
function deselectObjectTree() {
  Array.from(objectTree.children).forEach(w => {
    w.classList.remove("selected")
  })
}
// Function to update highlighting based on selection
function updateObjectHighlight() {
  objectTree.querySelectorAll('.object-tree-item').forEach(item => {
    item.classList.remove('selected'); // Remove previous selection
  });
  if (selectedObject) {
    const selectedElement = objectTree.querySelector(`[innerText="${selectedObject.userData.id}"]`);
    if (selectedElement) {
      selectedElement.classList.add('selected'); // Highlight the selected item
    }
  }
}


// Raycaster for object selection
const raycaster = new THREE.Raycaster();

// Flag to indicate dragging
let isDragging = false;

// Function to add or remove outline based on selection
function updateObjectOutline(obj) {
  // Loop through scene objects and reset materials
  sceneObjects.forEach(object => {
    if(object != obj)
      object.material = object.userData.originalMaterial; // Use original material
  });

  if (obj) {
    console.log("chaning",obj)
    obj.material = outlineMaterial; // Apply outline material
  }
}

// Transform controls for translation
let transformControls;
function initTransformControls() {
  transformControls = new TransformControls(camera, renderer.domElement);
  // Initially don't attach to any object
  scene.add(transformControls);

  transformControls.addEventListener('dragging-changed', function (event) {
    isDragging = event.value; // Update dragging state
  });

  transformControls.addEventListener('objectChange', function (event) {
    // Update object position based on transform (exercise)
  });

  
}

// ... (rest of your code)


initTransformControls(); // Call this after scene setup
addEventListener("keyup", e => {
    var ke = keyEvents[e.key]
    if(typeof(ke) == "function") {
      ke(e)
    }
})
canvas.addEventListener('click', (event) => {
  if(dragged) return;
  // Check for existing object selection
  if (selectedObject) {
    deselectObject(selectedObject)// Detach transform controls on deselect
    return;
  }

  // Raycast to check for object intersection
  const mouse = new THREE.Vector2(
    (event.clientX / window.innerWidth) * 2 - 1,
    -(event.clientY / window.innerHeight) * 2 + 1
  );
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(sceneObjects);
  if (intersects.length > 0) {
    var ob = intersects[0].object;
    // Store original material for later reset
    selectObject(ob)
  }
});

function toggleSelect(obj) {
  if(obj.userData.selected) {
    deselectObject(obj)
  } else {
    selectObject(obj)
  }
}
function deselectObject(obj) {
  deselectObjectTree()
   obj.userData.selected = false;
    isDragging = false;
    transformControls.detach(); 
    selectedObject = null;
    updateObjectOutline();
    transformControls.detach()
  
}
function selectObject(obj) {
  obj.userData.selected = true;
  console.log("Selecting",obj)
  selectedObject=obj;
  
    updateObjectOutline(obj);
    transformControls.attach(obj); // Attach transform controls
  console.log("selected",selectedObject==obj,obj)
  selectObjectTree(obj)
  }

// Render loop
function animate() {
  requestAnimationFrame(animate);
  controls.enabled = !isDragging || isOrbitControlsEnabled;
  controls.update();
  renderer.render(scene, camera);
}

animate();
// Optional GUI for easy object creation
const gui = new GUI();

const createObjectFolder = gui.addFolder('Create Object');

const geometries = {
  Cube: THREE.BoxGeometry,
  Sphere: THREE.SphereGeometry,
  // Add more geometries as needed
};


const createSphereButton = createObjectFolder.add({ "create sphere": () => {
  console.log(334)
  const geometry = new geometries["Sphere"](); // Sphere geometry
  const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
  createObject(geometry, material);
} }, 'create sphere'); // Create a button


const createRectButton = createObjectFolder.add({ "create box": () => {
  console.log(334)
  const geometry = new geometries["Cube"](); // Sphere geometry
  const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
  createObject(geometry, material);
} }, 'create box'); // Create a button


makeGrid()

// Add options for material color or other properties as needed

createObjectFolder.open(); // Open the folder by default

// ... rest of your code continues ...