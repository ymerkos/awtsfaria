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
// JavaScript for interactive post creation
document.getElementById("generateSections").addEventListener("click", () => {
  const bulkText = document.getElementById("bulkText").value;
  const sectionsArea = document.getElementById("sectionsArea");

  sectionsArea.innerHTML = ""; // Clear existing sections

  if (bulkText.trim()) {
    const paragraphs = bulkText.split("\n").filter(p => p.trim());

    paragraphs.forEach((text, index) => {
      const section = document.createElement("div");
      section.className = "section";

      section.innerHTML = `
        <div contenteditable="true" class="section-content">${text}</div>
        <div class="controls">
          <button onclick="addImage(this)">Add Image</button>
          <button onclick="addSubSection(this)">Add Sub-Section</button>
        </div>
      `;

      sectionsArea.appendChild(section);
    });
  }
});

window.addImage = function(button) {
  const section = button.closest(".section");
  const imageUrl = prompt("Enter Image URL or Upload via Imgbb API:");
  if (imageUrl) {
    const img = document.createElement("img");
    img.src = imageUrl;
    img.style.maxWidth = "100%";
    img.style.border = "2px solid white";
    img.style.marginTop = "10px";
    section.appendChild(img);
  }
};

window.addSubSection = function(button) {
  const section = button.closest(".section");
  const subSection = document.createElement("div");
  subSection.contentEditable = "true";
  subSection.className = "section-content";
  subSection.textContent = "New Sub-Section";
  section.appendChild(subSection);
};

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

