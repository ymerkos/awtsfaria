//B"H


/**
 * to be called on awtsmoos.com/editor.
 */
async function translator() {
    //B"H
    f=await loadJSON()
    var dir = await openDirectory()
    var pages = [];
    for(var k of f) {
        var pg = k.name
        var txt = k.text;
        var con = await generateContent({
        
            Prompt: `B"H
            Hello. Take this text and TRANSLATE it into the best English you can possibly do. Before the translation say **TRANSLATION** and after say **TRANSLATION END**

            Here:

            ${txt}
            `,
            apiKey:"AIzaSyDG2VVfAMDSY9uvgVk-kLLL4GMwbRlBNIs",
            content: [],
            onData: (w => console.log("Hi",w))
        })
        var ob = {page:pg,hebrew:txt, english:con}
        var wr = await writeFile(dir, "Page_"+pg, JSON.stringify(ob));
        console.log("Did! it?",wr,ob)
        pages.push(ob)
        await new Promise((r, j) => {
            setTimeout(() => {}, 30 * 1000)
        })
        console.log("WAITED! now next...")
    }
}
//B"H
function escapeHTML(htmlString) {
    // Use JSON.stringify to escape special characters automatically
    return JSON.stringify(htmlString);
}
function downloadJSON(txt, nm) {
    var json = JSON.stringify(txt, null, "\t")
    downloadFile(json, (
		nm || "BH_" + Date.now()
	) + ".json", "application/json")
}


function downloadFile(txt, nm, mime) {
	var a=  document.createElement("a")
	a.href = URL.createObjectURL(
		new Blob([
			txt
		], {
			type: mime
		})
	);

	a.download = (
		nm || "BH_" + Date.now()+".txt"
	)

	a.click()
	
}



/**
 * to be called anywhere AFTER book has
 * been translated into different files, each with structure:
 * [
 *  {
 *      page: name of page,
 *      hebrew,
 *      english: "**TRANSLATION**.....**TRANSLATION END**"
 *  }
 * ]
 */
//B"H
async function makeBookFromPages() {
    
   
    var files = await pickFiles();

    files = files.map(fl => {
        var f = fl.content;
        var res = f;
        var eng = f.english;
        if(!eng) {
            console.log("NO ENGLISH FOR THIS!",fl)
            return fl
        }
        eng = parseChabadString(eng);
        heb = f.hebrew;
        if(!heb) {
            console.log("NO HEBREW")
            return fl;
        }
        heb = parseChabadString(heb, false);
        res.hebrew = heb;
        res.english = eng;
        res.page = f.page;
        var g = fl;
        g.content = res;
        return g;
    })

    /*var getSrc = await pickFiles({
        multiple: false
    });
    var syncedFiles = syncSrcWithFiles(getSrc.content,files)
    */
   var b = generateBook(files)
    
    downloadHTML(b, "HI"+Date.now())
    console.log(window.myFiles= files,window.oldFiles=files,myBook=b);

  
   
}

async function justSyncFilesWithSrc() {
    var times = 0;
    var files;
    var getSrc
    var synced;
    var dir;
    async function doIt() {
        switch(times++) {
            case 1: 
            files = await pickFiles();
            console.log("Got files",window.g=files)
            break;
            case 2:
            getSrc = await pickFiles({
                multiple: false
            });

            console.log("Got src",window.src=getSrc)
            synced = syncSrcWithFiles(getSrc.content, files);
            console.log("Synced",window.syn=synced)
            break;
            case 3:
                dir = await openDirectory();
                console.log("Got dir",window.dr=dir)
                for(var s of synced) {
                    console.log(s,"files?",synced)
                    await writeFile(dir,s.meta.name,JSON.stringify(s.content))
                }
            break;
        }
        console.log("Doing it",times)
    }
    console.log("doing it")
    document.body.addEventListener("mousedown",doIt)
    
  
    
}

function syncSrcWithFiles(src, files) {

    for(var i = 0; i < src.length; i++) {
        var srcF = src[i]
        var fl = files[i];
        if(!fl || !srcF) {
            console.log("NOT synced",fl,srcF,i)
            continue;
        }
        console.log("Src",srcF,fl)
        if(srcF.notes) {
            fl.content.notes = srcF.notes;
        } else {
            console.log("NO notes")
            continue;
        }

    }
    return files;
}

function pickFiles({
    multiple=true
}={}) {
    return new Promise((r,j) => {
        var inp = document.createElement("input")
        inp.type = "file"
        if(multiple) {
            inp.multiple = true;
        }
        inp.onchange = async () => {
            var files = [];
            for(var f of Array.from(inp.files)) {
                var c = await fetch(URL.createObjectURL(f));
                var json = null;
                try {
                    json = await c.json()
                } catch(e){
                    console.log("SKIPPED",f,e)
                    continue;
                }

                if(json == null) {
                    console.log("SKIPPED",f,e)
                    continue;
                }   

                files.push({
                    meta: f,
                    content: json
                })


            }
            if(!multiple) {
                files = files[0]
            }
            r(files)
        }
        inp.click();
    })
    
}
//await makeBookFromPages()

function parseChabadString(txt,eng=true) {
    return txt.replace(
            /\*\*TRANSLATION END\*\*|\*\*TRANSLATION\*\*|\[small_begin]|\[small_end]|\[smallitalic_begin]|\[smallitalic_end]|\[cup]|\[\/cup]/gi, match => ({
           "**TRANSLATION END**":"",//"</div>",
            "**TRANSLATION**":"",//'<div class="translation">',
            "[small_begin]":"<span class=\"small\">",
            "[small_end]":"</span>",
            "[cup]":'<span class="cup">',
            "[/cup]":'</span>',
            "[smallitalic_begin]":`<span class="smallitalic">`,
            "[smallitalic_end]":"</span>"
        
        }[match])
    )
    .replace("God","G-d")
    .replace("Here:","")
    .replace("Here is the translation:","")
    .replace(/\[ftnref_(\d+)_(\p{L}+)\]/gu, (match, number, letters) => eng?"" : `<sup class="ftnote">${letters}</sup>`)
    .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
    .trimStart();
}



/**
 * once u have files, make book HTML
 */

function generateBook(bookData) {
    // Create a container div for the book
    const bookContainer = document.createElement('div');
    bookContainer.classList.add('book-container');
    var styles = document.createElement("style")
    bookContainer.appendChild(styles)
    styles.innerHTML = /*css*/`
        
        .notes,
                .ftnote {
                        display:none
                }
            body, h1, h2, h3, p, div {
            margin: 0;
            padding: 0;
            }

            /* Global font styles */
            body {
            font-family: Georgia, serif; /* Choose a print-optimized font */
            font-size: 17pt; /* Use points for font size in print */
            }

            /* Bold text */
            .cup {
            font-weight: bold;
            }

            .hebrew {
                direction: rtl
            }

            /* Slightly smaller text */
            .small {
            font-size: 16pt;
            }

            /* Slightly smaller italic text */
            .smallitalics {
            font-size: 16pt;
            font-style: italic;
            }

            /* Page number container */
            .pagenumber {
            
            bottom: 1.5cm; /* Use cm for consistent print margins */
            right: 1.5cm;
            background-color: black;
            color: white;
            padding: 5px 10px;
            border-radius: 5px;
            }

            .english .pagenumber {
                display: none;
            }

            /* Divider between pages */
            .divider {
            border-bottom: 7px solid black; /* Thinner border for print */
            margin-bottom: 10px;
            margin-top:10px
            }

            /* Page container */
            .page {
                max-width: 650px;
                background-color: white;
                padding: 20px;
                box-shadow: none;
                border-radius: 3px;
                margin-bottom: 20px;
                margin-right: auto;
                margin-left: auto;
                white-space: pre-wrap;
            }
            .content.english {
                margin-top: 20px;
                padding-top: 20px;
                border-top: 1px solid black;
            }


    `
    // Iterate over each object in the book data
    bookData.forEach(page => {
        var pageData = page.content;
      //  console.log(page,pageData)
        // Create a div for the page
        const pageDiv = document.createElement('div');
        pageDiv.classList.add('page');


         // Create and append the Hebrew content
         const hebrewContent = document.createElement('div');
         hebrewContent.classList.add('content', 'hebrew');
         hebrewContent.innerHTML = pageData.hebrew;
         pageDiv.appendChild(hebrewContent);

         

        // Create and append the English content
        const englishContent = document.createElement('div');
        englishContent.classList.add('content', 'english');
        englishContent.innerHTML = pageData.english;
        
        pageDiv.appendChild(englishContent);
        console.log("Hi",englishContent,pageData,pageData.english,englishContent.innerHTML)
        var tr = englishContent.querySelector(".translation")
        if(tr) {
            englishContent.innerHTML = tr.innerHTML
        }
        var pn = englishContent.querySelector(".pagenumber");
        if(pn) {
            englishContent.removeChild(pn)
            englishContent.innerHTML = 
            englishContent.innerHTML.trim()
        }
       
       
        if(pageData.notes) {
            const notes = document.createElement('div');
            notes.classList.add('content', "hebrew", 'notes');
            notes.innerHTML = pageData.notes;
            pageDiv.appendChild(notes);
        }

        /**
        // Create a div for the page number
        const pageNumberDiv = document.createElement('div');
        pageNumberDiv.classList.add('pagenumber');
        pageNumberDiv.textContent = pageData.page;
        pageDiv.appendChild(pageNumberDiv);
         */
        // Create a black line divider at the bottom of each page
        const divider = document.createElement('div');
        divider.classList.add('divider');
        pageDiv.appendChild(divider);

        // Append the page to the book container
        bookContainer.appendChild(pageDiv);
    });

    // Return the outerHTML of the book container
    return bookContainer.outerHTML;
}

function downloadHTML(txt,nm) {
    downloadFile(txt, nm+".html","text/html")
}

//await justSyncFilesWithSrc()
await makeBookFromPages()