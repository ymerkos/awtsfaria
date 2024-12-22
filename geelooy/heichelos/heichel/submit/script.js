//B"H
var aliasIdDiv = document.getElementById("aliasId")
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
document.getElementById("generateSections").addEventListener("click", () => {
  const bulkText = document.getElementById("bulkText").value.trim();
  const sectionsArea = document.getElementById("sectionsArea");

  sectionsArea.innerHTML = ""; // Clear existing sections

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

  var sec = contentDiv.querySelector(".section-content")

  contentDiv.parentElement.insertBefore(toolbar, sec);
}

function executeCommand(contentDiv, button) {
  const command = button.dataset.command;
  const value = button.dataset.value || null;
  document.execCommand(command, false, value);
}

function uploadImage(contentDiv) {
  const imageUrl = prompt("Enter Image URL:");
  if (imageUrl) {
    const img = document.createElement("img");
    img.src = imageUrl;
    contentDiv.appendChild(img);
  }
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

