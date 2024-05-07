//B"H
var p = new DOMParser()
async function getTanya(page, docm) {
    var s = await getAllSifimInSection(page, docm);
    var tan = [
        s[1],
        s[4],
        s[5],
        s[6],
        s[7]
    ];
    var con = await getContentOfSections(tan)
    return con;
}
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
    console.log(cn,sections)
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
        var mainSection = { name: 'Main', sections: [] }; // Main section for content when no H2/H3 tags are found
        var chl = contentTextDiv.children[0];
        var ar = Array.from(chl.children).map(w => Array.from(w.children).flat()).flat();
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
    var input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';

    input.onchange = e => {
        var file = e.target.files[0];
        var reader = new FileReader();

        reader.onload = readerEvent => {
            var content = readerEvent.target.result;
            var json = JSON.parse(content);
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
https://chatgpt.com/share/cd49c879-b971-43a8-9e9e-64b1e7216925

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
        var majorSection = json[i];
        await processMajorSection(majorSection, i);

        for (let j = (i === startMainIndex ? startSubIndex : 0); j < majorSection.sections.length; j++) {
            var subSection = majorSection.sections[j];
            await processSubSection(subSection, majorSection, j);

            for (let k = (i === startMainIndex && j === startSubIndex ? startSubSubIndex : 0); k < subSection.sections.length; k++) {
                var lowestLevelSection = subSection.sections[k];
                await processLowestLevel(lowestLevelSection, subSection, majorSection, k);
            }
        }
    }
}
