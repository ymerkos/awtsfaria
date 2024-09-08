//B"H
// Import libraries
import * as THREE from '/games/scripts/build/three.module.js';
//'/games/scripts/build/three.module.js';

import { OrbitControls } from "/games/scripts/jsm/controls/OrbitControls.js"

import { OrbitControlsGizmo } from "/games/scripts/jsm/controls/OrbitControlsGizmo.js"
import { GUI } from '/games/scripts/jsm/libs/lil-gui.module.min.js';
import { TransformControls } from '/games/scripts/jsm/controls/TransformControls.js'; // Import TransformControls
import { GLTFLoader } from '/games/scripts/jsm/loaders/GLTFLoader.js';
import ObjectTreeManager from "/games/mitzvahWorld/editor/lib/ObjectTreeManager.js"

import HeightmapGenerator from "/games/mitzvahWorld/editor/lib/HeightmapGenerator.js"


window.THREE=THREE;
var selecteds = [];
var keysDown = [];
var keyEvents = {
  ".": (e) => {
    var cnt = controls;
    if(!cnt) console.log("NO controls");
    var sl = selectedObject;
    if(!sl) console.log("NO selected")
      cnt.target = sl.position.clone();
  },
  "a":deselectAll,
  A:deselectAll,
  r:switchToRotationMode,
  R:switchToRotationMode,
  s:switchToScalingMode,
  S:switchToScalingMode,

  g:switchToTranslationMode,
  G:switchToTranslationMode

}

function switchToTranslationMode() {
  transformControls.setMode("translate");
}

// Function to switch TransformControls to rotation mode
function switchToRotationMode() {
  transformControls.setMode("rotate");
}

// Function to switch TransformControls to scaling mode
function switchToScalingMode() {
  transformControls.setMode("scale");
}

// Scene and camera setup
const scene = new THREE.Scene();

// Create an instance of ObjectTreeManager
const objectTreeManager = new ObjectTreeManager(scene);
window.objectTreeManager = objectTreeManager
// Initialize the object tree
objectTreeManager.initObjectTree();
objectTreeManager.on("clicked", object => {
  if(object.userData.selected) {
    deselectObject(object)
  } else 
  selectObject(object, !keysDown["Shift"]);
})

//scene.background = new THREE.Color("white")
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100000);
camera.position.z = 5;
camera.position.y = 3;
camera.position.x = 5;
// Material for the outline
const outlineMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00, wireframe: true }); // Yellow wireframe
var lastOutlineMaterial = new THREE.MeshBasicMaterial({ color: new THREE.Color("orange"), wireframe: true }); // Orange wireframe
// Renderer setup
const renderer = new THREE.WebGLRenderer({ 
  canvas: document.getElementById('canvas') 
  ,
  trasnparent:true,
  alpha:true
});
renderer.setSize(window.innerWidth, window.innerHeight);



function makeGrid() {

  // Long line geometry (large number of segments for extended lines)

  const lineSegmentLength = 100; // Adjust length of each line segment (longer for more visible lines)

  const numSegments = 1000; // Adjust for desired line length (more segments, longer lines)



  // X-axis line (red)
const xLineGeometry = new THREE.BufferGeometry();
const xLinePositions = new Float32Array(numSegments * 2 * 3); // Array size based on segments

// Set positions for the x-axis line
for (let i = -numSegments / 2; i < numSegments / 2; i++) { // Start from negative half and go to positive half
    xLinePositions[(i + numSegments / 2) * 6] = i;
    xLinePositions[(i + numSegments / 2) * 6 + 1] = 0;
    xLinePositions[(i + numSegments / 2) * 6 + 2] = 0;
    xLinePositions[(i + numSegments / 2) * 6 + 3] = i + 1;
    xLinePositions[(i + numSegments / 2) * 6 + 4] = 0;
    xLinePositions[(i + numSegments / 2) * 6 + 5] = 0;
}
xLineGeometry.setAttribute('position', new THREE.BufferAttribute(xLinePositions, 3));
const xLineMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 }); // Red color
const xLine = new THREE.Line(xLineGeometry, xLineMaterial);
scene.add(xLine);

// Z-axis line (green)
const zLineGeometry = new THREE.BufferGeometry();
const zLinePositions = new Float32Array(numSegments * 2 * 3); // Array size based on segments

// Set positions for the z-axis line
for (let i = -numSegments / 2; i < numSegments / 2; i++) { // Start from negative half and go to positive half
    zLinePositions[(i + numSegments / 2) * 6] = 0;
    zLinePositions[(i + numSegments / 2) * 6 + 1] = 0;
    zLinePositions[(i + numSegments / 2) * 6 + 2] = i;
    zLinePositions[(i + numSegments / 2) * 6 + 3] = 0;
    zLinePositions[(i + numSegments / 2) * 6 + 4] = 0;
    zLinePositions[(i + numSegments / 2) * 6 + 5] = i + 1;
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
controls.enabled = false;


// Add the Obit Controls Gizmo
const controlsGizmo = new  OrbitControlsGizmo(controls, { size:  100, padding:  8 });

// Add the Gizmo domElement to the dom 
document.body.appendChild(controlsGizmo.domElement);


/*
// Object tree element with absolute positioning
const objectTree = document.getElementById('object-tree');
objectTree.style.position = 'absolute';
objectTree.style.top = '10px'; // Adjust positioning as needed
objectTree.style.left = '10px'; // Adjust positioning as needed
*/
// Scene objects and selection
let selectedObject = null;
const sceneObjects = [];
window.sceneObjects = sceneObjects
window.scene = scene
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
  const simulatedClickEvent = new CustomEvent('click', {detail: {
    shift:keysDown.Shift
  }});
  canvas.dispatchEvent(simulatedClickEvent);

  // Option 2: Focus the canvas and blur immediately (may not work in all browsers)
  // canvas.focus();
  // canvas.blur();
}


// Function to create a new object (e.g., cube)
function createObject(geometry, material, type) {
  const object = new THREE.Mesh(geometry, material);
  object.userData.originalMaterial = object.material;
  object.userData.id = makeId(type)
  object.name = object.userData.id
  sceneObjects.push(object);
  scene.add(object);
  // Add the existing mesh at the root level
  objectTreeManager.addRootObject(object);
  //updateObjectTree();
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
      
    
      window.g=object
    //  console.log("HO!",g,selectedObject == object)
      toggleSelect(object, !keysDown["Shift"])
    
    });

    objectTree.appendChild(element);
  });
 // updateObjectHighlight(); // Initial highlight for selected object
}
window.selectObject = selectObject
function selectObjectTree(obj) {
  deselectObjectTree()
  obj?.userData?.awtsmoosEl?.classList.add("selected")
}
function deselectObjectTree() {
  objectTreeManager.deselectAll()
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

var highlighted = []
// Flag to indicate dragging
let isDragging = false;
// Function to add or remove outline based on selection
function updateObjectOutline(obj, exclusive=true) {
  // Remove existing outline mesh, if any
  if(exclusive) {
    highlighted.forEach(obje => {
      removeObjectOutline(obje);
    })
  
    highlighted = [];
  }
  if (obj) {
    var geom = obj.geometry;
    if(!geom) return;
    // Create a new material for wireframe outline
    const outlineMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color(selecteds.length < 2 ?"yellow":"orange"), // Outline color (adjust as needed)
      wireframe: true, // Add wireframe for outline effect
      opacity: 1, // Set opacity to 1 for solid appearance
      transparent: false // Disable transparency to keep it solid
    });

    // Clone the object's geometry
    const outlineGeometry = obj.geometry.clone();

    // Create outline mesh using cloned geometry and outline material
    const outlineMesh = new THREE.Mesh(outlineGeometry, outlineMaterial);

    // Parent the outline mesh to the object
    obj.add(outlineMesh);

    // Store the outline mesh as a property of the object
    obj.userData.outlineMesh = outlineMesh;

    highlighted.push(obj);
  }
}

// Function to remove outline mesh from the object
function removeObjectOutline(obj) {
  const outlineMesh = obj?.userData?.outlineMesh;
  if (outlineMesh) {
    // Remove outline mesh from its parent
    outlineMesh.parent.remove(outlineMesh);
    // Dispose geometry and material to free up memory
    outlineMesh.geometry.dispose();
    outlineMesh.material.dispose();
    // Remove reference from user data
    delete obj.userData.outlineMesh;
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
    keysDown[e.key] = false;
    if(typeof(ke) == "function") {
      ke(e)
    }
})
addEventListener("keydown", e => {
  keysDown[e.key] = true;
})

window.deselectAll=deselectAll
window.deselectObject=deselectObject
canvas.addEventListener('click', (event) => {
  var shift = keysDown.Shift;//event.detail.shift;
  
  if(dragged) return;
  if(!shift) {
    // Check for existing object selection
    if(selecteds.length) {
      deselectAll()
    }
    if (selectedObject) {
      deselectObject(selectedObject)// Detach transform controls on deselect
      return;
    }
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
    selectObject(ob, !shift)
  }
});

function toggleSelect(obj, exclusive=true) {
  if(obj.userData.selected) {
    deselectObject(obj)
  } else {
    selectObject(obj, exclusive)
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

  obj.material = obj.userData.originalMaterial;
  
}

function deselectAll() {
  selecteds.forEach(s => {
    deselectObject(s)
  })
  selecteds=[];
  currentPanel.innerHTML = "";
  currentPanel.classList.add("hidden")
}

function selectObject(obj, exclusive=true) {
  if(exclusive) {
    if(selectedObject) {
      deselectObject(selectedObject)
    }
    if(selecteds.length) {
      deselectAll()
    }
  }
  selecteds.push(obj);
  if(obj.material != outlineMaterial)
    obj.userData.originalMaterial = obj.material;

  obj.userData.selected = true;
  
  selectedObject=obj;
  
    updateObjectOutline(obj, exclusive);
    transformControls.attach(obj); // Attach transform controls
  //console.log("selected",selectedObject==obj,obj)
  selectObjectTree(obj)
  currentPanel.innerHTML = "";
  var nm = document.createElement("div")
  nm.className = "name"
  currentPanel.appendChild(nm);
  
  var selections = selecteds.map(w=>w.name)
  nm.innerHTML = arrayToShortName(selections)

  var btn = document.createElement("button")
  btn.className = "btn";
  btn.innerHTML = "Clear parent"+selections.length>1?"(s)" : "";
  
  currentPanel.appendChild(btn);
  currentPanel.classList.remove("hidden")
  btn.onclick = () => {
    selecteds.forEach(w => {
        try {
          w.removeFromParent()
        } catch(e) {
          console.log("issue",w,e)
        }
    });
  }
  }
function arrayToShortName(ar) {
  /*
    given an array of strings,
    converts it to a concise shrot hand summarixzation in 
    order to display the items in the list 
    summarized in a title.

    For example, if it has many items,
    then the returned title string 
    will be like "element1... last element"

    so if the list starts with "orange"
    and has more than 2 items and ends with "lemon"
    the result would be 
    "orange... lemon"

    If there are only 2 results it just says first and last with an
    "and"

    so if 2nd element is "apple" and that's also the last

    "orange & apple"

    if it's just one element then return just that
    
    "orange"
  */
  // Check the length of the array to decide how to summarize it
  if (ar.length === 0) {
    return ''; // Empty array case
  } else if (ar.length === 1) {
    return ar[0]; // Single element case
  } else if (ar.length === 2) {
    return ar[0] + ' & ' + ar[1]; // Two elements case
  } else {
    // More than 2 elements, return the first and last with '...'
    return ar[0] + '... ' + ar[ar.length - 1];
  }
}

// Render loop
function animate() {
  requestAnimationFrame(animate);
  controls.enabled = !isDragging || isOrbitControlsEnabled;
  controls.update();
  renderer.render(scene, camera);
}

animate();


// Function to load GLB file and create object
function loadGLBFile(url) {
  return new Promise((r,j) => {
    const loader = new GLTFLoader();
    loader.load(url, (gltf) => {
        const object = gltf.scene; // Get the root scene object from the loaded GLTF
        
        r(object)
    }, undefined, (error) => {
        console.error('Error loading GLB:', error);
    });
  })
  
}


// Optional GUI for easy object creation
const gui = new GUI({ autoPlace: false });
guiControls.appendChild(gui.domElement)
const createObjectFolder = gui.addFolder('Load Object');

const geometries = {
  Cube: THREE.BoxGeometry,
  Sphere: THREE.SphereGeometry,
  Cylinder: THREE.CylinderGeometry,
  Cone: THREE.ConeGeometry,
  Torus: THREE.TorusGeometry,
  Plane: THREE.PlaneGeometry,
  Tetrahedron: THREE.TetrahedronGeometry,
  Octahedron: THREE.OctahedronGeometry,
  Dodecahedron: THREE.DodecahedronGeometry,
  Icosahedron: THREE.IcosahedronGeometry,
  Ring: THREE.RingGeometry,
  Circle: THREE.CircleGeometry,
  Lathe: THREE.LatheGeometry,
  Tube: THREE.TubeGeometry,
  Parametric: THREE.ParametricGeometry,
  Shape: THREE.ShapeGeometry,
  Text: THREE.TextGeometry,
  Polyhedron: THREE.PolyhedronGeometry,
  TubeBuffer: THREE.TubeBufferGeometry,
  ConeBuffer: THREE.ConeBufferGeometry,
  CylinderBuffer: THREE.CylinderBufferGeometry,
  BoxBuffer: THREE.BoxBufferGeometry,
  SphereBuffer: THREE.SphereBufferGeometry,
  DodecahedronBuffer: THREE.DodecahedronBufferGeometry,
  IcosahedronBuffer: THREE.IcosahedronBufferGeometry,
  OctahedronBuffer: THREE.OctahedronBufferGeometry,
  PlaneBuffer: THREE.PlaneBufferGeometry,
  RingBuffer: THREE.RingBufferGeometry,
  TetrahedronBuffer: THREE.TetrahedronBufferGeometry,
  TorusBuffer: THREE.TorusBufferGeometry,
  // Add more geometries as needed
};

function getSelected() {
  return selectedObject
}
window.getSelected=getSelected
window.THREE = THREE;
function objectSelectOptions() {
  var fld = gui.addFolder("Selected Object Properties")
  var nm = "Create heightmap from object"
  fld.add({
    [nm]: () => {
        var sl = selectedObject;
        if(!sl) {
          alert("Nothing selected!")
        }
        var heightMapper = new HeightmapGenerator(
          sl,
          scene
        );

        heightMapper.downloadHeightmapAsPNG("BH_heightmap_"+Date.now()+".png")

    }
  }, nm)
}
function createGeometryButtons() {
  const createObjectFolder = gui.addFolder('Create Primitive');
  
  for (const [geometryName, geometryType] of Object.entries(geometries)) {
      createObjectFolder.add(
        { [`create ${geometryName.toLowerCase()}`]: () => {
    
          const geometry = new geometryType(); // Create geometry instance
          const material = new THREE.MeshLambertMaterial({ color: 0xffffff });
          createObject(geometry, material, geometryName);
      }}, `create ${geometryName.toLowerCase()}`); // Create a button
  }
}
objectSelectOptions()
createGeometryButtons(); // Call the function to generate buttons for each geometry type

const createGlbButton = createObjectFolder.add({ "load glb": () => {
  // Create file input element
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = '.glb'; // Set accepted file type to GLB
  fileInput.style.display = 'none'; // Hide the file input element
  // Event listener for file input change
  fileInput.addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (file) {
        var glb = await loadGLBFile(URL.createObjectURL(file)); // Load the GLB file and create object
        scene.add(glb); // Add the object to the scene
        
        glb.userData.originalMaterial = glb.material;
        glb.userData.id = makeId("Glb")
        sceneObjects.push(glb);
        
        // Add the existing mesh at the root level
        objectTreeManager.addRootObject(glb);
    }
  });
  fileInput.click()
  
} }, 'load glb'); // Create a button


function makeId(type) {
  let id = type.toLowerCase(); // Convert the type to lowercase for consistency
  id = id.charAt(0).toUpperCase() + id.slice(1); // Capitalize the first letter
  
  
  let suffix = ""; // Initialize the suffix
  
  // Iterate to find a unique ID
  let counter = 1;
  while (scene.getObjectByName(id + suffix) !== undefined) {
      suffix = "." + counter.toString().padStart(3, '0'); // Generate suffix like .001, .002, etc.
      counter++;
  }
  
  return id + suffix; // Return the unique ID
}

// Function to create a point light
function createPointLight(color, intensity, position) {
  const pointLight = new THREE.PointLight(color, intensity);
  pointLight.position.copy(position); // Set position
  scene.add(pointLight); // Add point light to the scene
  return pointLight; // Return the created light
}

// Function to create a spotlight
function createSpotlight(color, intensity, position, targetPosition, angle, penumbra, decay) {
  const spotlight = new THREE.SpotLight(color, intensity, 0, angle, penumbra, decay);
  spotlight.position.copy(position); // Set position
  spotlight.target.position.copy(targetPosition); // Set target position
  scene.add(spotlight); // Add spotlight to the scene
  scene.add(spotlight.target); // Add spotlight target to the scene
  return spotlight; // Return the created light
}

// Function to create a hemisphere light
function createHemisphereLight(skyColor, groundColor, intensity, position) {
  const hemisphereLight = new THREE.HemisphereLight(skyColor, groundColor, intensity);
  hemisphereLight.position.copy(position); // Set position
  scene.add(hemisphereLight); // Add hemisphere light to the scene
  return hemisphereLight; // Return the created light
}


function lighting() {
  
// Example usage:

// Create additional point lights
const pointLight1 = createPointLight(0xffffff, 1, new THREE.Vector3(5, 5, 5));
const pointLight2 = createPointLight(0xffffff, 1, new THREE.Vector3(-5, -5, -5));

// Create a spotlight
const spotlight = createSpotlight(0xffffff, 1, new THREE.Vector3(0, 10, 0), new THREE.Vector3(0, 0, 0), Math.PI / 4, 0.5, 1);

// Create a hemisphere light
const hemisphereLight = createHemisphereLight(0xffffff, 0xffffff, 0.5, new THREE.Vector3(0, 10, 0));
}

lighting()

makeGrid()

// Add options for material color or other properties as needed

createObjectFolder.open(); // Open the folder by default

// ... rest of your code continues ...
