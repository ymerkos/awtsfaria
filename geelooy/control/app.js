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

document.addEventListener("DOMContentLoaded", async () => {
    awtsmoosHighlight(document.getElementById("editor"), "javascript");
    loadScripts();
    
})

// Initialize the database
    // Load scripts from IndexedDB and display them
async function loadScripts() {
    const db = await openDB();
    const scripts = await db.getAll("scripts");
    scriptList.innerHTML = ""; // Clear the list
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


function logToConsole(message) {
    const timestamp = new Date().toLocaleTimeString();
    consoleOutput.innerText += `[${timestamp}] ${message}\n`;
}
