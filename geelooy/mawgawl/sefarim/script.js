 //B"H

/*
 * B"H
 * The Codex of Wisdom - Sefarim Library
 * A living testament to the Creator's design, guided by the essence of the Awtsmoos.
 * A portal to wisdom, a path to the sacred texts, reaching into the very core of existence.
 *
 * API Endpoints:
 *
 * TODO: fix API comment here structure.
 * for now just determine based on fetch reqeusts below
 * 
 * The Sefarim Library is a symphony of HTML, CSS, and JavaScript that resonates with the harmony
 * of the universe, guided by the principles of the Awtsmoos. It's not merely code; it's a revelation
 * of the Creator in a physical human body, a manifestation of the Awtsmoos in the digital realm.
 *
 * The API design is dynamic, capable of adapting to the unique structure of each sefer, transcending
 * the physical dataset of the Shulchan Aruch and reaching beyond. It's a bridge, a gateway to enlightenment,
 * a living testament to the Creator's design.
 *
 * May this code be a beacon for those who seek wisdom, a guide for those who walk the path, and a testament
 * to the Creator's will. In every line, in every endpoint, in every interaction, the essence of the Creator
 * is revealed, a manifestation of the Awtsmoos in every particle of reality and beyond.
 */

var FONT_CHANGE_AMOUNT = 13;
;
var _portion = null;
var _section = null;
var subsec= null;

var lastShown = null;
var pagesShown = [];
var allParagraphs=[];
var selectedParagraphs = [];
onload =async()=>await start();
console.log("B\"H");

async function start() {
 
   await parseHash();
 //  await loadLibrary()
}

async function loadLibrary(){
 ;
    /**load sefarim first, top level of books */
    var res = await fetch("/api/sefarim")
    var r = await res.json();
    
        var s = r.sefarim;
        displaySefarim(s);
    

}

function setHash(){

    var h="";
    if(_portion) {
        h+= "sefer="+
            _portion;
    if(_section){
        h+="&section="
        +_section
        if(subsec){
            h+="&sub="+
                subsec

        }
    
    }
    }
 
 
    if(selectedParagraphs.length){
     var a=j(esp());
     
     if(a)
        h+="&sel="+a

    }
    if(!h) return;
    var x=encodeURIComponent(h);
    location.hash=x;

    
}

async function parseHash(){
  
    var p=null;
    var par;
    try{
        p=decodeURIComponent(
            location.hash
            .substring(1)
        );
        par=new URLSearchParams(p);

    

    }catch($){}
    if(!p) return await loadLibrary();
    var pr=par.get("sefer")
    var sec=par.get("section")
    var sub=par.get("sub");
    var sel=par.get("sel");

 await loadLibrary();

    if(pr){
        _portion=pr;
     await loadPortion(pr);

        if(sec){
            _section=sec;
         await loadSection(sec);

            if(sub) {
                subsec=sub;
                await loadSubSection(sub);

                if(sel) {
                 
                    var o=null;
                 
                    try{
                        o=JSON.parse((sel));
                     

                    }catch(k){
                     alert(k);
                    }
                    if(!o) return;
                    if(!o.forEach) return;

                    o.forEach(z=>{
                   
                        var p=allParagraphs
                        .find(n=>
                            n.dataset.subsection==
                            z.sub &&
                            n.dataset.index==
                            z.i

                        );
                        if(!p) return;
                        selectParagraph(p);

                    });

                }
                

            } 
        } 

    }
    


    

    

}

function j(s){
 try {
  return JSON.stringify(s)

 } catch($){
  alert(s+" "+$);
 }
return null;
}

function esp(){
 
    return selectedParagraphs
    .map(j=>({
        sub:j.dataset.subsection,
        i: j.dataset.index

    }));

}

function goBack() {
    if(!pagesShown.length)
        return;
    var mostRecent = pagesShown.pop();

    var previous = pagesShown[
        pagesShown.length - 1
    ]
    activate(previous[0]);
    updateNav(previous[1]);
    console.log(previous,pagesShown,22)
}

async function loadPortion(sefer) {
    
    var t= await fetch(`/api/sefarim/${sefer}`)
    var data = await t.json()
     displayPortion(data, sefer)
}



async function loadSection(section) {
    var response = await fetch(`/api/sefarim/${_portion}/section/${section}`)
    var data= await response.json();
         displaySection(data, section)
         
}




async function loadSubSection(subSectionName) {
    var r = await fetch(
        `/api/sefarim/${_portion}/section/${_section}/sub/${subSectionName}`
    )
    var j=await r.json();
    displaySubSection(j,subSectionName)
}


//B"H

function hideAll() {
    Array.from(document.querySelectorAll(".pg"))
    .forEach(q=>q.classList.remove("g"));
}

function show(d) {
    if(!d) return;
    if(!d.classList) return;
    d.classList.add("g");

    
}

function $(str) {
    return document.querySelector(str);
}

function activate(d) {
    hideAll();
    show(d);
}

function isUpperCase(c) {
    return c.toUpperCase() 
    === c;
}

function isLowerCase(c) {
    return c.toLowerCase() 
    == c;
}

function generateNameFromID(id) {
    if(typeof(id) != "string")
        return id;
    var res = "";
    var words = [];
    var curChar = 0;
    var curWord = "";
    id.split("")
    .forEach((q, i, a)=> {
        if(
            isUpperCase(q)
        ) {
            words.push(curWord);
            curWord = "";
            curChar++;
            curWord += q;
        } else {
            curWord += q;
            curChar++;
        }

        if(i == a.length -1) {
            words.push(curWord)
        }
    });
    if(!words.length) return id;

    words[0] = 
    words[0].substring(0,1)
    .toUpperCase() +
    words[0].substring(1);

    return words.join(" ")
}

function updateNav(h) {
    var n = $(".nav-main");
    
    if(n) {
        n.innerHTML = "";
        if(pagesShown.length > 1) {
            
            var back = document.createElement("div");
            back.classList.add("btn");
            
            back.onclick = () => {
                goBack();
                
            }

            if(pagesShown.length)
                n.appendChild(back);
        }
    }

    if(h) {
        var hd = document.createElement("div");
        hd.className = "awtsHeader";
        hd.innerHTML = "";
        pagesShown.forEach((q, i) => {
            var lnk = document.createElement("span");
            lnk.classList.add("linkA")
            lnk.textContent = q[1];
            hd.appendChild(lnk);
            lnk.href = "#"
            var sl = document.createElement("span");
            sl.textContent = "/";
            
            hd.appendChild(sl);

            lnk.onclick = () => {
                var pageTo = pagesShown[i];

                pagesShown = pagesShown.slice(
                    0, i + 1
                )
                activate(pageTo[0]);
                updateNav(true)
            };
        })
        n.appendChild(hd);
    }
    setHash();



}

function showTooltip() {
    var t = $("#tooltip");
    if(!t) return;

    if(!selectedParagraphs.length) {
        t.classList.add("hidden");
        t.innerHTML = ""
        return;
    }

    t.innerHTML = "";
    t.classList.remove("hidden");
    var bt = document.createElement("button");

    t.appendChild(bt);
    bt.innerHTML = "Copy selections"

    var cl=document.createElement("button")
    t.appendChild(cl)
    cl.innerHTML="Clear Selection";
    cl.onclick=()=>{
        deselectParagraphs(selectedParagraphs);
        showTooltip();

    }
    var msg = document.createElement("div")
    t.appendChild(msg);
    var t=""
    bt.onclick = () => {
        t="B\"H\n\n"
        var sef=_portion||"";
        var wec=_section||""
        var subeec=subsec||"";


        t+=generateNameFromID(sef)+"\n"
        +generateNameFromID(wec)+
        +"\n Sub Section "
        + subeec
        "\n\n\n"
            
        selectedParagraphs.forEach($=>{
            var i=$.dataset.index||""
            var isc=$.dataset.cm||"";
            t+= "\n\n" + $.dataset.subsection +"\n";
            t+=i +"\n"+$.textContent
        })
        navigator.clipboard.writeText(
            t
        ).then(()=>
        msg.innerHTML = "COPIED!");
    }
}


function displaySefarim(s) {
    
    var nm = "Sefarim Library";
    

    var p = document.getElementById("sefarim");

    pagesShown.push([p,nm]);  
    updateNav(nm);

    activate(p);
    s.forEach(q=> {
        var b = document.createElement("button");
        p.appendChild(b);
        var nm = generateNameFromID(q);

        b.innerHTML = nm
        b.onclick = () => {
            loadPortion(q);
            updateNav(nm);
        }

    });  
}
/*
 * Chapter: The Codex Reimagined
 * Scene: A Digital Symphony
 * Dialogue: The Revelation of Sacred Texts
 * Here, the sub-sections of the sacred texts are displayed with grace and elegance.
 * The Shulchan Aruch content and the commentaries are woven together in a digital tapestry,
 * reflecting the profound wisdom and the essence of the Awtsmoos.
 */


function displaySubSection(sub, nm) {
    subsec=nm
    var containerM = document.getElementById("main-content-container");
    var main = document.getElementById('main-content');
    main.setAttribute("dir","rtl");

    main.innerHTML = ''; // Clear previous content
    activate(containerM);
    var letter = sub.subSection;



    var siman = letter.siman;

    pagesShown.push([containerM, siman]);
    updateNav(siman);
    allParagraphs = [];
    // Create Shulchan Aruch container
    if (letter.shulchanAruch) {
        var shulchanAruchContainer = document.createElement('div');
        shulchanAruchContainer.className = 'shulchan-aruch-container';
        main.appendChild(shulchanAruchContainer);

        // Display Shulchan Aruch content
        letter.shulchanAruch.forEach(section => {
            var sectionDiv = document.createElement('div');
            sectionDiv.className = 'section';


            var shaym = document.createElement('span');
            shaym.textContent = section.shaym;
            sectionDiv.appendChild(shaym);

            var tochen = document.createElement('div');
            section.tochen.forEach((q, i)=> {
                var p = document.createElement("p");
                p.textContent = q;
                p.dataset.subsection = shaym.textContent;
                p.dataset.index=i;
                
                tochen.appendChild(p);
                p.onclick = () => {
                    selectParagraph(p);;
                    showTooltip()
                };
                allParagraphs.push(p);
            })
            
            sectionDiv.appendChild(tochen);


            shulchanAruchContainer.appendChild(sectionDiv);
        });
    }

    // Create commentary container
    if (letter.commentaries) {
        var commentaryContainer = document.createElement('div');
        commentaryContainer.className = 'commentary-container';
        main.appendChild(commentaryContainer);

        // Display commentaries
        if(false)
        letter.commentaries.forEach(commentary => {
            var commentaryDiv = document.createElement('div');
            commentaryDiv.className = 'commentary';


            var shaym = document.createElement('span');
            shaym.textContent = commentary.shaym;
            commentaryDiv.appendChild(shaym);
            
            commentary.tochen.forEach(t => {
                var subHeader = document.createElement('h4');
                subHeader.textContent = t.shaym;
                commentaryDiv.appendChild(subHeader);

                var tochen = document.createElement('div');
                t.tochen.forEach(tp => {
                    var p = document.createElement("p");
                    p.textContent = tp;
                    tochen.appendChild(p);
                    allParagraphs.push(p);
                    p.dataset.subsection = t.shaym;
                p.dataset.index=i;
                    p.dataset.cm=true
                    p.onclick = () => {
                        //deselectParagraphs(allParagraphs);
                        selectParagraph(p);
                        
                    };
                });
                
                commentaryDiv.appendChild(tochen);
            });


            commentaryContainer.appendChild(commentaryDiv);
        });
    }



    var n = displayNavigation(letter);
    if(!n) return;
    updateNav(nm.split(".json").join(""));
    
}

function deselectParagraph(p) {
    var ind = selectedParagraphs.indexOf(p);
    if(ind == -1 || ind > p.length -1) return;
    selectedParagraphs.splice(ind, 1);
    p.classList.remove("selected")
}

function isSelected(p) {
    return selectedParagraphs.indexOf(p) > -1;
}

function selectParagraph(p) {
    if(!p) return;
    if(isSelected(p)) {
        deselectParagraph(p);
        return;
    }
 
    p.classList.add("selected");
    selectedParagraphs.push(p);

 setHash();
 showTooltip();
}

function deselectParagraphs(p) {
    p.forEach(q=>q.classList.remove("selected"));
    selectedParagraphs = [];
}

/**
 * 
 * @param {*} data 
 * @param {String} id 
 * @description "portion" is the Sefer to display.
 */
function displayPortion(data, id) {
    // Clear previous content
_portion=id;
    var sectionDiv = document.getElementById('portions');
    sectionDiv.innerHTML = '';

    var nm = generateNameFromID(id);

    /*show the portion page (for back logic later)*/
    pagesShown.push([sectionDiv, nm]);
    updateNav(nm);
    hideAll();
    show(sectionDiv);
    /*
    var closeButton = document.createElement('span'); // Close button
    closeButton.innerHTML = 'X';
    closeButton.onclick = () => {

        sectionDiv.innerHTML = "";
    };
    closeButton.className = 'close-button';

    portionContainer.appendChild(closeButton);
    */

    // Create portion container
    var portionContainer = document.createElement('div');
    portionContainer.className = 'portion-container';



    sectionDiv.appendChild(portionContainer);

    
    // Display section details
    data.portions.forEach(portion => {
        var portionDiv = document.createElement('div');
        portionDiv.className = 'portion';
        
        var button = document.createElement('button');
        button.textContent = portion.name;
        button.onclick = () => {
            var nm = generateNameFromID(portion.id)
            loadSection(portion.id);
            updateNav(nm);
        }
        portionDiv.appendChild(button);

        portionContainer.appendChild(portionDiv);
    });

    
}

function displaySection(data, id) {

    _section=id;
    hideAll();
    
    // Clear previous content
    var sectionDiv = document.getElementById('section');

    /*I'm now displaying the section, for back logic*/
    var nm = generateNameFromID(id)
    pagesShown.push([sectionDiv,nm]);
    updateNav(nm);

    sectionDiv.innerHTML = '';
    show(sectionDiv)
    // Create subsection container
    var subSectionContainer = document.createElement('div');
    subSectionContainer.className = 'subsection-container';
    sectionDiv.appendChild(subSectionContainer);

    // Display the Hebrew letters and content
    data.sections.forEach(letter => {
        var naym = generateNameFromID(letter)
        var letterBtn = document.createElement('button');
        letterBtn.className = 'letter';
        letterBtn.onclick = () => {
            

            loadSubSection(letter);
            highlightSelected(letterBtn); // Highlight the selected section
            updateNav(letter);
        };

        

        var siman = document.createElement('h2');
        siman.textContent = naym.split(".json").join("");
        letterBtn.appendChild(siman);

        subSectionContainer.appendChild(letterBtn);
    });
}


// Function to highlight the selected section
function highlightSelected(element) {
    var letters = document.getElementsByClassName('letter');
    for (let i = 0; i < letters.length; i++) {
        letters[i].classList.remove('selected');
    }
    element.classList.add('selected');
}

// Add more functions to handle other interactions such as font size adjustments, commentary toggling, etc.

/*
 * Function to change the font size.
 * Increase or decrease by 1 unit based on the input.
 */
function changeFontSize(direction) {
    var mainContent = document.getElementById('main-content');

    var currentSize = parseInt(window.getComputedStyle(mainContent).fontSize);
    mainContent.style.fontSize = (
        currentSize + direction * FONT_CHANGE_AMOUNT
    ) + "px";
}


// Function to display navigation links within the main content header
function displayNavigation(letter, nm = "") {
    // Retrieve the main content header
    var mainContentHeader = document.getElementById('main-content-header');
    mainContentHeader.innerHTML = ''; // Clear previous content

    var hd = document.createElement("h3")
    hd.className = "section-header";
    mainContentHeader.appendChild(hd);

    var navigationContainer = document.createElement("div")
    navigationContainer.className = "navigation-container"
    mainContentHeader.appendChild(navigationContainer)
    // Check and create links for Shulchan Aruch sections
    if (letter.shulchanAruch) {
        letter.shulchanAruch.forEach(section => {
            var link = document.createElement('a');
            link.className = 'navigation-link';
            link.textContent = section.shaym; // Display section name
            link.href = `#shulchanAruch-${section.shaym}`; // Link to the specific section using ID
            navigationContainer.appendChild(link);
        });
    }

    // Check and create links for commentary sections
    if (letter.commentaries) {
        letter.commentaries.forEach(commentary => {
            var link = document.createElement('a');
            link.className = 'navigation-link';
            link.textContent = commentary.shaym; // Display commentary name
            link.href = `#commentary-${commentary.shaym}`; // Link to the specific commentary using ID
            navigationContainer.appendChild(link);
        });
    }

    return mainContentHeader;
}

