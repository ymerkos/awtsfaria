/**
B"H
**/
import awtsmoosHighlight from "/scripts/awtsmoos/coding/make.js";
// IndexedDB Setup
const dbName = "scriptStorage";
let db;

// Select necessary DOM elements
const editor = document.getElementById("editor");
const sendButton = document.getElementById("sendButton");
const saveButton = document.getElementById("saveButton");
const newScriptButton = document.getElementById("newScriptButton");
const scriptList = document.getElementById("scriptList");
const consoleOutput = document.getElementById("console");

let currentScript = null;  // Track the current script
document.addEventListener("DOMContentLoaded", async () => {
    awtsmoosHighlight(document.getElementById("editor"), "javascript");
    loadScripts();
    await dividerLogic()
    
})
// Load scripts from IndexedDB and display them using a cursor
async function loadScripts() {
    const db = await openDB();
    const tx = db.transaction("scripts", "readonly");
    const store = tx.objectStore("scripts");
    const scripts = [];

    return new Promise((resolve, reject) => {
        const request = store.openCursor();
        request.onsuccess = event => {
            const cursor = event.target.result;
            if (cursor) {
                scripts.push(cursor.value); // Add script to the array
                cursor.continue(); // Move to the next item
            } else {
                displayScripts(scripts); // Display all scripts when done
                resolve();
            }
        };
        request.onerror = () => reject(request.error);
    });
}

// Function to display scripts in the sidebar
function displayScripts(scripts) {
    scriptList.innerHTML = ""; // Clear the list
    console.log("loading scripts",scripts)
    scripts.forEach(script => {
        const li = document.createElement("li");
        li.textContent = script.name;
        li.addEventListener("click", () => loadScript(script));
        scriptList.appendChild(li);
    });
}

// Open or create the IndexedDB database
function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("scriptsDB", 1);
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);
        request.onupgradeneeded = event => {
            const db = event.target.result;
            db.createObjectStore("scripts", { keyPath: "id", autoIncrement: true });
        };
    });
}

// Save the current script to IndexedDB
async function saveScript() {
    const code = editor.innerText;
    if (!currentScript) {
        const name = prompt("Enter script name:");
        if (name) {
            currentScript = { name, code };
        } else {
            return;
        }
    } else {
        currentScript.code = code;
    }
    const db = await openDB();
    const tx = db.transaction("scripts", "readwrite");
    const store = tx.objectStore("scripts");
    await store.put(currentScript);
    loadScripts(); // Refresh the list
}

// Create a new script
function createNewScript() {
    currentScript = null;
    editor.innerText = ""; // Clear editor for a new script
}

// Load a script into the editor
function loadScript(script) {
    currentScript = script;
    editor.innerText = script.code;
    editor.dispatchEvent(new CustomEvent("input"))
}

// Send the code to the server and display the result in the console
async function sendCode() {
    const code = editor.innerText;
    const response = await fetch("/api/admin/code", {
        method: "POST",
        body: new URLSearchParams({ code })
    });
    const result = await response.json();
    logToConsole(result.r);
}




sendButton.addEventListener("click", sendCode);
saveButton.addEventListener("click", saveScript);
newScriptButton.addEventListener("click", createNewScript);


        // Logs messages dynamically, creating expandable elements for objects, arrays, and functions.
function logToConsole(data) {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = document.createElement("div");
    logEntry.className = "log-entry";

    // Create timestamp element
    const timestampEl = document.createElement("span");
    timestampEl.className = "timestamp";
    timestampEl.textContent = `[${timestamp}] `;
    logEntry.appendChild(timestampEl);

    // Create the main data element
    const dataEl = document.createElement("div");
    dataEl.className = "data";
    renderData(data, dataEl); // Render the data based on its type
    logEntry.appendChild(dataEl);

    // Append to console output
    consoleOutput.appendChild(logEntry);
    consoleOutput.scrollTop = consoleOutput.scrollHeight; // Auto-scroll to latest log
}

// Renders data according to its type, supporting objects, arrays, strings, numbers, and functions.
function renderData(data, container) {
    if (typeof data === "object" && data !== null) {
        if (Array.isArray(data)) {
            renderArray(data, container);
        } else {
            renderObject(data, container);
        }
    } else if (typeof data === "function") {
        renderFunction(data, container);
    } else {
        renderPrimitive(data, container);
    }
}

// Renders primitive data types (string, number, boolean, null, undefined).
function renderPrimitive(value, container) {
    const span = document.createElement("span");
    span.textContent = JSON.stringify(value); // JSON.stringify handles strings, numbers, booleans
    span.className = "primitive";
    container.appendChild(span);
}

// Renders arrays, with expandable elements for each item.
function renderArray(arr, container) {
    const arrayContainer = document.createElement("div");
    arrayContainer.className = "array";

    const label = document.createElement("span");
    label.textContent = `Array(${arr.length})`;
    label.className = "expandable";
    label.onclick = () => toggleExpand(arrayContainer);
    arrayContainer.appendChild(label);

    const itemsContainer = document.createElement("div");
    itemsContainer.className = "items hidden"; // Initially hidden
    arr.forEach((item, index) => {
        const itemContainer = document.createElement("div");
        itemContainer.className = "item";
        itemContainer.textContent = `${index}: `;
        renderData(item, itemContainer);
        itemsContainer.appendChild(itemContainer);
    });
    arrayContainer.appendChild(itemsContainer);

    container.appendChild(arrayContainer);
}

// Renders objects with expandable elements for each key-value pair.
function renderObject(obj, container) {
    const objectContainer = document.createElement("div");
    objectContainer.className = "object";

    const label = document.createElement("span");
    label.textContent = "Object";
    label.className = "expandable";
    label.onclick = () => toggleExpand(objectContainer);
    objectContainer.appendChild(label);

    const propertiesContainer = document.createElement("div");
    propertiesContainer.className = "properties hidden"; // Initially hidden
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            const propertyContainer = document.createElement("div");
            propertyContainer.className = "property";
            propertyContainer.textContent = `${key}: `;
            renderData(obj[key], propertyContainer);
            propertiesContainer.appendChild(propertyContainer);
        }
    }
    objectContainer.appendChild(propertiesContainer);

    container.appendChild(objectContainer);
}

// Renders functions, displaying only the function name.
function renderFunction(func, container) {
    const funcContainer = document.createElement("span");
    funcContainer.className = "function";
    funcContainer.textContent = `f() ${func.name || "(anonymous)"}`;
    container.appendChild(funcContainer);
}

// Toggles the visibility of expandable elements (arrays, objects).
function toggleExpand(container) {
    const expandable = container.querySelector(".expandable");
    const itemsContainer = container.querySelector(".items, .properties");
    if (itemsContainer) {
        itemsContainer.classList.toggle("hidden");
        expandable.classList.toggle("expanded");
    }
}


async function dividerLogic() {
    const divider = document.getElementById("divider");
    const editorPanel = document.querySelector(".editor-panel");
    const consoleOutput = document.querySelector(".console-output");

    // Load saved panel heights from indexedDB
    const db = await initDB(); // Assuming `initDB` is defined elsewhere
    const savedSizes = await db.get("settings", "panelSizes") || { editorHeight: "70%", consoleHeight: "30%" };

    editorPanel.style.flex = `0 0 ${savedSizes.editorHeight}`;
    consoleOutput.style.flex = `0 0 ${savedSizes.consoleHeight}`;

    let isResizing = false;
    let startY, startEditorHeight, startConsoleHeight;

    divider.addEventListener("mousedown", (e) => {
        isResizing = true;
        startY = e.clientY;
        startEditorHeight = editorPanel.offsetHeight;
        startConsoleHeight = consoleOutput.offsetHeight;
    });

    document.addEventListener("mousemove", (e) => {
        if (!isResizing) return;

        const dy = e.clientY - startY;
        const newEditorHeight = startEditorHeight + dy;
        const newConsoleHeight = startConsoleHeight - dy;

        const editorHeightPercentage = (newEditorHeight / window.innerHeight) * 100 + "%";
        const consoleHeightPercentage = (newConsoleHeight / window.innerHeight) * 100 + "%";

        editorPanel.style.flex = `0 0 ${editorHeightPercentage}`;
        consoleOutput.style.flex = `0 0 ${consoleHeightPercentage}`;
    });

    document.addEventListener("mouseup", async () => {
        if (isResizing) {
            isResizing = false;

            // Save updated panel sizes to indexedDB
            const editorHeightPercentage = editorPanel.style.flex.split(" ")[2];
            const consoleHeightPercentage = consoleOutput.style.flex.split(" ")[2];

            await db.put("settings", { editorHeight: editorHeightPercentage, consoleHeight: consoleHeightPercentage }, "panelSizes");
        }
    });
}
