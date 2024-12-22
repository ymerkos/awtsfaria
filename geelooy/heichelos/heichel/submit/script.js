//B"H
var aliasIdDiv = document.getElementById("aliasId")
const sectionsArea = document.getElementById("sectionsArea");
if(window.curAlias) {
  if(window.aliasIdDiv) {
    aliasIdDiv.value = curAlias; 
  }
}
var $_GET = new URLSearchParams(location.search);
var ru = $_GET.get("returnURL");
if(ru) {
	var mt = document.querySelector("metadata")
	if(mt) {
		var b = document.createElement("a")
		b.innerText = "<- Back to previous page"
		b.href=ru;
		mt.insertBefore(b, mt.firstElement);
	}
}
function gh() {
    return (p => p[p.length-2])(location.pathname.split("/"))
}

addEventListener("awtsmoosAliasChange", e => {
	console.log("OK!",e)
	var id = e.detail.id;
	window.curAlias = id;
		  
	aliasIdDiv
	.value = curAlias;
});
document.getElementById("addSection")?.addEventListener("click", () => {
	const section = createSection("");
	sectionsArea.appendChild(section);
})
document.getElementById("generateSections").addEventListener("click", () => {
  const bulkText = document.getElementById("bulkText").value.trim();
  

 // sectionsArea.innerHTML = ""; // Clear existing sections

  if (bulkText) {
    const paragraphs = bulkText.split("\n").filter(p => p.trim());

    paragraphs.forEach((text) => {
      const section = createSection(text);
      sectionsArea.appendChild(section);
    });
  }
});

function createSection(content = "") {
  const section = document.createElement("div");
  section.className = "section";

  // Section Content
  const sectionContent = document.createElement("div");
  sectionContent.contentEditable = "true";
  sectionContent.className = "section-content";
  sectionContent.textContent = content;

  // Controls
  const controls = document.createElement("div");
  controls.className = "controls";

  const addBefore = document.createElement("button");
  addBefore.className = "plus-btn";
  addBefore.textContent = "+";
  addBefore.onclick = () => addSection(section, "before");

  const addAfter = document.createElement("button");
  addAfter.className = "plus-btn";
  addAfter.textContent = "+";
  addAfter.onclick = () => addSection(section, "after");

  const toolbarBtn = document.createElement("button");
  toolbarBtn.textContent = "A";
  toolbarBtn.onclick = () => toggleToolbar(sectionContent);

  const imageBtn = document.createElement("button");
  imageBtn.textContent = "🖼";
  imageBtn.onclick = () => uploadImage(sectionContent);

  controls.append(toolbarBtn, imageBtn);

  section.append(addBefore, sectionContent, controls, addAfter);
  return section;
}

function addSection(referenceSection, position) {
  const newSection = createSection();
  if (position === "before") {
    referenceSection.before(newSection);
  } else {
    referenceSection.after(newSection);
  }
}

function toggleToolbar(contentDiv) {
  let toolbar = document.querySelector(".toolbar");
  if (toolbar) toolbar.remove();

  toolbar = document.getElementById("toolbarTemplate").cloneNode(true);
  toolbar.style.display = "block";
  toolbar.className = "toolbar";

  toolbar.querySelectorAll("button").forEach(button => {
    button.onclick = () => executeCommand(contentDiv, button);
  });

  var sec = contentDiv.parentElement.querySelector(".section-content")

  contentDiv.parentElement.insertBefore(toolbar, sec);
}

function executeCommand(contentDiv, button) {
  const command = button.dataset.command;
  const value = button.dataset.value || null;

  const selection = window.getSelection();
  const range = selection.rangeCount ? selection.getRangeAt(0) : null;

  if (range && !range.collapsed) {
    // Text is selected
    applyStyleToSelection(command, value);
  } else {
    // No text is selected, toggle global state
    toggleFormattingState(contentDiv, command, value);
  }

  // Update button states
  updateButtonStates(contentDiv);
}

function applyStyleToSelection(command, value) {
  const selection = window.getSelection();
  const range = selection.getRangeAt(0);
  const span = document.createElement(value || "span");

  span.classList.add(command);
  span.appendChild(range.extractContents());
  range.insertNode(span);

  // Merge adjacent spans with the same style
  mergeAdjacentSpans(span);
}

function toggleFormattingState(contentDiv, command, value) {
  const editor = contentDiv.querySelector(".content");
  if (!editor.dataset.formatting) {
    editor.dataset.formatting = JSON.stringify({});
  }

  const formattingState = JSON.parse(editor.dataset.formatting);

  if (command === "heading") {
    // Remove any existing heading styles
    ["h1", "h2", "h3"].forEach(h => {
      formattingState[h] = false;
    });
  }

  // Toggle the current command state
  formattingState[command] = !formattingState[command];
  editor.dataset.formatting = JSON.stringify(formattingState);

  // Apply style to the editor for new text
  if (formattingState[command]) {
    editor.classList.add(command);
  } else {
    editor.classList.remove(command);
  }
}

function updateButtonStates(contentDiv) {
  const editor = contentDiv.querySelector(".content");
  const formattingState = JSON.parse(editor.dataset.formatting || "{}");

  document.querySelectorAll(".toolbar button").forEach(button => {
    const command = button.dataset.command;
    const isActive = formattingState[command] || false;

    if (isActive) {
      button.classList.add("active");
    } else {
      button.classList.remove("active");
    }
  });
}

function mergeAdjacentSpans(span) {
  const prev = span.previousSibling;
  const next = span.nextSibling;

  if (prev && prev.nodeType === 1 && prev.className === span.className) {
    span.innerHTML = prev.innerHTML + span.innerHTML;
    prev.remove();
  }

  if (next && next.nodeType === 1 && next.className === span.className) {
    span.innerHTML += next.innerHTML;
    next.remove();
  }
}


function uploadImage(contentDiv) {
  initImageUploadModal(contentDiv)
}


function initImageUploadModal(contentDiv) {
  const modal = document.getElementById("imageUploadModal");
  const apiKeyInput = document.getElementById("imgbbApiKey");
  const dropZone = document.getElementById("dropZone");
  const fileInput = document.getElementById("fileInput");
  const uploadBtn = document.getElementById("uploadImageBtn");
  const closeModalBtn = document.getElementById("closeModalBtn");

  // Check for API key in localStorage
  const savedApiKey = localStorage.getItem("imgbbApiKey");
  if (savedApiKey) apiKeyInput.value = savedApiKey;

  // Show modal
  modal.style.display = "flex";

  // Drag-and-drop functionality
  dropZone.addEventListener("dragover", e => {
    e.preventDefault();
    dropZone.classList.add("dragging");
  });

  dropZone.addEventListener("dragleave", () => dropZone.classList.remove("dragging"));

  dropZone.addEventListener("drop", e => {
    e.preventDefault();
    dropZone.classList.remove("dragging");

    const files = e.dataTransfer.files;
    if (files.length) handleImageUpload(files[0], contentDiv);
  });

  dropZone.addEventListener("click", () => fileInput.click());

  fileInput.addEventListener("change", () => {
    if (fileInput.files.length) handleImageUpload(fileInput.files[0], contentDiv);
  });

  uploadBtn.addEventListener("click", () => {
    const apiKey = apiKeyInput.value.trim();
    if (!apiKey) {
      alert("API key is required.");
      return;
    }

    localStorage.setItem("imgbbApiKey", apiKey); // Save API key
    const files = fileInput.files;
    if (files.length) handleImageUpload(files[0], contentDiv, apiKey);
    else alert("No file selected.");
  });

  closeModalBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });
}

function handleImageUpload(file, contentDiv, apiKey = null) {
  if (!apiKey) apiKey = localStorage.getItem("imgbbApiKey");
  if (!apiKey) {
    alert("ImgBB API key is missing.");
    return;
  }

  const formData = new FormData();
  formData.append("image", file);

  fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
    method: "POST",
    body: formData,
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        const img = document.createElement("img");
        img.src = data.data.url;
        img.alt = "Uploaded Image";
        img.style.maxWidth = "100%";

        contentDiv.appendChild(img);
      } else {
        alert("Image upload failed: " + data.error.message);
      }
    })
    .catch(err => alert("An error occurred: " + err.message));
}



document.getElementById("submitPost").addEventListener("click", async () => {
  const aliasId = aliasIdDiv.value;
  const heichelId = gh();
  const title = document.getElementById("title").value;

  const sections = Array.from(document.querySelectorAll(".section")).map(section => {
    const content = Array.from(section.querySelectorAll(".section-content")).map(div => div.textContent);
    const images = Array.from(section.querySelectorAll("img")).map(img => img.src);
    return { text: content, images };
  });

  const post = { aliasId, heichelId, title, sections };

  // Call makePost
  try {
    const response = await makePost(post);
    if (response.url) window.location.href = response.url;
  } catch (err) {
    console.error("Error submitting post:", err);
  }
});

// Mock makePost function
async function makePost({ aliasId, heichelId, title, sections }={}) {
  
  console.log("Submitting post:", post);
  var a = await (
    await fetch(`/heichelos/${
      heichelId
    }/posts`, {
      method: "POST",
      body: new URLSearchParams({
        aliasId,
        title,
        heichelId,
        dayuh: {
          sections
        }
      })
    })
  ).json()
  //  return new Promise(resolve => setTimeout(() => resolve({ url: "/success" }), 1000));
}

