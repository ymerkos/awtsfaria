//B"H
var p = new DOMParser()
async function getAllSifimInSection(page, docm=null) {
    //from section page like https://he.wikisource.org/wiki/%D7%A9%D7%95%D7%9C%D7%97%D7%9F_%D7%A2%D7%A8%D7%95%D7%9A_%D7%99%D7%95%D7%A8%D7%94_%D7%93%D7%A2%D7%94
    var doc = docm;
    if(!docm) {
        try {
            var f = await fetch(page, docm = null)
            var tx = await f.text()
           doc = docm || p.parseFromString(tx, "text/html")
        } catch(e) {
            console.log("Couldnt get it!",page)
        }
    }
    console.log(doc)
    var cn = doc.getElementById("mw-content-text")
    var sections = parseByH(cn);
    
    sections = sections.map(q=>({
        name: q.name,
        sections: Array.from(q.sections.map(w=>Array.from(w.getElementsByTagName("a")).flat())).flat()
    }))

    

    return sections
}

function rep(s) {
        return s.replace("[עריכה]","")
    }

function parseByH(contentTextDiv) {
    var sections = [];
    var ar = Array.from(contentTextDiv.children[0].children)
    var cur = null;

    for (var c of ar) {
        if (c.tagName == "H2" || c.tagName == "H3") {
            if (cur) {
                sections.push(cur);
            }
            cur = {name: rep(c.textContent), sections: []};
        } else if (cur) {
            cur.sections.push(c);
        }
    }

    // Add the last section if it exists
    if (cur) {
        sections.push(cur);
    }

    return sections;
}

async function getContentOfSections(sections) {
    var finalSections = [];
    for(var s of sections) {
        var cur = {name: s.name, sections: []}
        console.log("Doing: ",cur.name)
        finalSections.push(cur);
        for(var ss of s.sections) {
            
            
            var nm = ss.textContent;
            
            console.log("Doing siman: ",nm)
            try {
                var sc = await fetch(ss.href)
                var tx = await sc.text();
                var doc = p.parseFromString(tx, "text/html")
    
                var cntx = doc.getElementById("mw-content-text")
                var prsed = parseByH(cntx);
              //  if(!prsed.length) continue;
                var siman = {
                        name: nm,
                        sections: prsed.map(w=>({
                            name: w.name,
                            sections: w.sections.map(w=>w.outerHTML)
                        })).flat().filter(Boolean)
                }
                cur.sections.push(siman)
                console.log("Got sections: ",prsed)
            } catch(e) {
                console.log("Couldnt get this one: ",e,ss)
            }
        }
    }
    return finalSections;

}


/**
 * 
 * @param {*} jsonObject 
 * @param {String} fileName 
 * @example
 * // Example JSON object
const exampleJSON = {
    "name": "Example",
    "sections": []
};

// Save the JSON to a file
saveJSONToFile(exampleJSON, 'example.json');


 */

function saveJSONToFile(jsonObject, fileName) {
    const jsonString = JSON.stringify(jsonObject, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const href = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}



/**B"H
 * 
 * @param {function} callback 
 * @example 
 * // Load the JSON back into memory 
 * //(use a callback to handle the loaded data)
loadJSONFromFile(loadedJSON => {
    console.log(loadedJSON);
});
 */
function loadJSONFromFile(callback) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';

    input.onchange = e => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onload = readerEvent => {
            const content = readerEvent.target.result;
            const json = JSON.parse(content);
            callback(json);
        };

        reader.readAsText(file);
    };

    input.click();
}

/**
 * 
 * @param {*} json 
 * @param {*} processMajorSection 
 * @param {*} processSubSection 
 * @param {*} processLowestLevel 
 * @example 
 * 
// Example usage
await traverseJSON(yourJSONData, 
    async (majorSection) => {
        // Asynchronous action for major sections
        console.log('Major Section:', majorSection.name);
        // Example: await someAsyncFunction(majorSection);
    }, 
    async (subSection, parentMajorSection) => {
        // Asynchronous action for subsections
        console.log('Subsection:', subSection.name, 'in', parentMajorSection.name);
        // Example: await someAsyncFunction(subSection);
    },
    async (lowestLevelSection, parentSubSection, parentMajorSection) => {
        // Asynchronous action for lowest level sections
        console.log('Lowest Level Section in', parentSubSection.name, 'of', parentMajorSection.name, ':', lowestLevelSection);
        // Example: await someAsyncFunction(lowestLevelSection);
    }
);
https://chat.openai.com/share/cd49c879-b971-43a8-9e9e-64b1e7216925

 */

async function traverseJSON(
    json, 
    processMajorSection, 
    processSubSection, 
    processLowestLevel, {
        startMainIndex = 0, startSubIndex = 0, startSubSubIndex = 0
    } = {}
) {
    for (let i = startMainIndex; i < json.length; i++) {
        const majorSection = json[i];
        await processMajorSection(majorSection, i);

        for (let j = (i === startMainIndex ? startSubIndex : 0); j < majorSection.sections.length; j++) {
            const subSection = majorSection.sections[j];
            await processSubSection(subSection, majorSection, j);

            for (let k = (i === startMainIndex && j === startSubIndex ? startSubSubIndex : 0); k < subSection.sections.length; k++) {
                const lowestLevelSection = subSection.sections[k];
                await processLowestLevel(lowestLevelSection, subSection, majorSection, k);
            }
        }
    }
}
