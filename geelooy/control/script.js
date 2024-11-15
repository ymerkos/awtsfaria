/**
B"H
**/
import awtsmoosHighlight from "/scripts/awtsmoos/coding/make.js";
// IndexedDB Setup
const dbName = "scriptStorage";
let db;

document.addEventListener("DOMContentLoaded", async () => {
    awtsmoosHighlight(document.getElementById("editor"), "javascript")
    // Initialize the database
    const request = indexedDB.open(dbName, 1);

    request.onupgradeneeded = (event) => {
        db = event.target.result;
        if (!db.objectStoreNames.contains("scripts")) {
            db.createObjectStore("scripts", { keyPath: "name" });
        }
    };

    request.onsuccess = (event) => {
        db = event.target.result;
        loadScripts(); // Load scripts on page load
    };

    request.onerror = (event) => {
        console.error("Database error:", event.target.errorCode);
    };

    // Event listeners
    document.getElementById("sendButton").addEventListener("click", sendCode);
    document.getElementById("saveButton").addEventListener("click", saveScript);
});

// Send Code to Server
async function sendCode() {
    const code = document.getElementById("editor").innerText.trim();
    if (code) {
        try {
            const response = await fetch("/api/admin/code", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: new URLSearchParams({ code }),
            });
            if (response.ok) {
                alert("Code sent successfully!");
            } else {
                alert("Error sending code.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Failed to send code to server.");
        }
    } else {
        alert("Please enter code before sending.");
    }
}

// Save Script to IndexedDB
function saveScript() {
    const code = document.getElementById("editor").innerText.trim();
    const name = prompt("Enter a name for this script:");
    if (!name) return;

    const transaction = db.transaction(["scripts"], "readwrite");
    const store = transaction.objectStore("scripts");
    const script = { name, code };

    const request = store.put(script);
    request.onsuccess = () => {
        alert("Script saved successfully!");
        loadScripts();
    };

    request.onerror = (event) => {
        console.error("Error saving script:", event.target.error);
    };
}

// Load all scripts and populate sidebar
function loadScripts() {
    const transaction = db.transaction(["scripts"], "readonly");
    const store = transaction.objectStore("scripts");
    const request = store.getAll();

    request.onsuccess = (event) => {
        const scripts = event.target.result;
        const scriptList = document.getElementById("scriptList");
        scriptList.innerHTML = ""; // Clear current list

        scripts.forEach((script) => {
            const listItem = document.createElement("li");
            listItem.textContent = script.name;
            listItem.onclick = () => loadScript(script);
            scriptList.appendChild(listItem);
        });
    };
}

// Load a selected script into the editor
function loadScript(script) {
    document.getElementById("editor").innerText = script.code;
}
