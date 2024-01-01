//B"H
var web = "https://he.wikisource.org/wiki/%D7%AA%D7%95%D7%A8%D7%94_%D7%90%D7%95%D7%A8_(%D7%97%D7%91%22%D7%93)";
var pr = new DOMParser();
async function getTorahOhr() {
    var d = await getDoc(web)
    if(!d) return console.log("Couldn't get it")
    var tx = d.querySelector("#mw-content-text")
    var maamarim1 = parseByH(tx);
    
    var maamarim = [];
    if(maamarim1[0]) {
        var h = maamarim1[0];
        var a = h.sections.map(t=>Array.from(t.getElementsByTagName("a"))).flat()
        var c;
        for(c = 0; c < a.length; c++) {
            var ac = a[c];
            console.log(ac,a,c)
            if(ac.className.includes("new"))
                continue;
            console.log("GETTING!",ac.href,ac.textContent)
            var maam = await getDoc(ac.href)
            var parsed = parseByH(maam.querySelector("#mw-content-text"))
            parsed = parsed.filter(w=>w.sections.length)
                .map(w=>({...w,sections:w.sections.map(t=>t.innerHTML)}))
            console.log(parsed,"GOT")
            maamarim.push({name: ac.textContent, content: parsed})
        }
        downloadJSON(maamarim, "BH_"+Date.now()+"_TorahOhr.json")
    }
    return maamarim
}
async function getDoc(url) {
    try {
        var q = await fetch(url);
        var t = await q.text();
        var dc = pr.parseFromString(t,"text/html")
        return dc;
    } catch(e) {return null}
}

function downloadJSON(jsonData, filename = 'data.json') {
    // Create a Blob from the JSON data
    const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });

    // Create an invisible <a> element to trigger the download
    const element = document.createElement('a');
    element.href = URL.createObjectURL(blob);
    element.download = filename;

    // Append the element to the document, trigger the download, and then remove it
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

function parseByH(contentTextDiv) {
    var sections = [];
    var mainSection = { name: 'Main', sections: [] }; // Main section for content when no H2/H3 tags are found
    var chl = contentTextDiv.children[0];
    var ar = Array.from(chl.children)//.map(w => Array.from(w.children).flat()).flat();
    console.log("ar", ar);
    var cur = null;
    var foundH2H3 = false; // Flag to check if any H2/H3 tags are found

    for (var c of ar) {
        if (c.tagName == "H2" || c.tagName == "H3") {
            foundH2H3 = true;
            if (cur) {
                sections.push(cur);
            }
            cur = { name: rep(c.textContent), sections: [] };
        } else if (cur) {
            cur.sections.push(c);
        } else {
            mainSection.sections.push(c); // Add content to the main section if no H2/H3 found yet
        }
    }

    // Add the last current section if it exists
    if (cur) {
        sections.push(cur);
    }

    // If no H2/H3 tags were found, add the main section
    if (!foundH2H3 && mainSection.sections.length > 0) {
        sections.unshift(mainSection);
    }

    return sections
}

function rep(s) {
    return s.replace("[עריכה]","")
}

function traverseJson(json) {
    json.forEach(item => {
        // Print the name of the current item
        console.log(item.name);

        // If the item has a 'content' property, which is an array, traverse it
        if (Array.isArray(item.content)) {
            traverseJson(item.content);
        }

        // If the item has a 'sections' property, which is an array, traverse it
        if (Array.isArray(item.sections)) {
            item.sections.forEach(section => {
                console.log(section);
            });
        }
    });
}

function setupJsonFileReader() {
    // Create a hidden file input element
    var fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.style.display = 'none';
    fileInput.accept = '.json';

    // Add event listener for file selection and processing
    fileInput.addEventListener('change', (event) => {
        var file = event.target.files[0];
        var reader = new FileReader();

        // Read the file as text and parse JSON
        reader.onload = (e) => {
            try {
                var json = JSON.parse(e.target.result);
                // Handle the parsed JSON here
                console.log(json);
            } catch (error) {
                console.error('Error parsing JSON:', error);
            }
        };

        // Read the selected file
        reader.readAsText(file);
    });

    // Append the input to the document and trigger click for file selection
    document.body.appendChild(fileInput);
    fileInput.click();
    document.body.removeChild(fileInput);
}

g=await getTorahOhr()

