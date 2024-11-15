//B"H


class AwtsmoosConsole {
  
  constructor(element) {
    this.console = element;
    var el = document.querySelector(".awtsmoosLogStyle")
    if(!el) {
      var sty = document.createElement("style")
      document.head.appendChild(sty);
      sty.innerHTML = /*css*/`
        .console-output {
          font-family: monospace;
          white-space: pre-wrap;
          padding: 10px;
          font-family: monospace;
          background: #333;
          color: #eee;
          overflow-y: auto;
          height: 300px;
          border-radius: 5px;
          min-height: 35%
      }
      
      .log-entry {
          margin-bottom: 5px;
      }
      
      .timestamp {
          color: #888;
      }
      
      .data {
          display: inline-block;
          vertical-align: top;
      }
      
      .expandable {
          cursor: pointer;
          color: #00ccff;
      }
      
      .expandable.expanded::after {
          content: " ▼";
      }
      
      .expandable::after {
          content: " ▶";
      }
      
      .hidden {
          display: none;
      }
      
      .array, .object {
          margin-left: 20px;
      }
      
      .function {
          color: #ffa500;
      }
      
      .primitive {
          color: #0f0;
      }
      `
    }
  }
  log(...data) {
    logToConsole(...data,this.console)
  }
}
   // Logs messages dynamically, creating expandable elements for objects, arrays, and functions.
function logToConsole(data, element) {
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
    element.appendChild(logEntry);
    element.scrollTop = element.scrollHeight; // Auto-scroll to latest log
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
    if(typeof(value) == "string") {
      span.innerHTML = value.split("\n").join("<br>")
    } else
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

export default AwtsmoosConsole;
