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

const FONT_CHANGE_AMOUNT = 6;
var _sefer = null;
var _portion = null;
var _section = null;


var lastShown = null;
var pagesShown = [];
onload = start;
console.log("B\"H");

function start() {
    /**load sefarim first, top level of books */
    fetch("/api/sefarim")
    .then(r=>r.json())
    .then(r => {
        var s = r.sefarim;
        displaySefarim(s);
    });
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

function loadPortion(sefer) {
    _sefer = sefer;
    fetch(`/api/sefarim/${sefer}`)
        .then(response => response.json())
        .then(data => displayPortion(data, sefer))
        .catch(error => console.error('An error occurred:', error));
}



function loadSection(portion) {
    _portion = portion;
    fetch(`/api/sefarim/${_sefer}/section/${portion}`)
        .then(response => response.json())
        .then(data => displaySection(data, portion))
        .catch(error => console.error('An error occurred:', error));
}




function loadSubSection(subSectionName) {
    fetch(
        `/api/sefarim/${_sefer}/section/${_portion}/sub/${subSectionName}`
    ).then(r=>r.json())
    .then(r=>displaySubSection(r,subSectionName))
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
        n.appendChild(hd);
        hd.innerHTML = h;
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
    const main = document.getElementById('main-content');
    main.setAttribute("dir","rtl");

    main.innerHTML = ''; // Clear previous content
    activate(main);
    var letter = sub.subSection;



    var siman = letter.siman;

    pagesShown.push([main, siman]);
    updateNav(siman);
    // Create Shulchan Aruch container
    if (letter.shulchanAruch) {
        const shulchanAruchContainer = document.createElement('div');
        shulchanAruchContainer.className = 'shulchan-aruch-container';
        main.appendChild(shulchanAruchContainer);

        // Display Shulchan Aruch content
        letter.shulchanAruch.forEach(section => {
            const sectionDiv = document.createElement('div');
            sectionDiv.className = 'section';


            const shaym = document.createElement('span');
            shaym.textContent = section.shaym;
            sectionDiv.appendChild(shaym);

            const tochen = document.createElement('p');
            tochen.innerHTML = section.tochen.join('<br>');
            sectionDiv.appendChild(tochen);


            shulchanAruchContainer.appendChild(sectionDiv);
        });
    }

    // Create commentary container
    if (letter.commentaries) {
        const commentaryContainer = document.createElement('div');
        commentaryContainer.className = 'commentary-container';
        main.appendChild(commentaryContainer);

        // Display commentaries
        letter.commentaries.forEach(commentary => {
            const commentaryDiv = document.createElement('div');
            commentaryDiv.className = 'commentary';


            const shaym = document.createElement('span');
            shaym.textContent = commentary.shaym;
            commentaryDiv.appendChild(shaym);

            commentary.tochen.forEach(t => {
                var subHeader = document.createElement('h4');
                subHeader.textContent = t.shaym;
                commentaryDiv.appendChild(subHeader);

                const tochen = document.createElement('p');
                tochen.innerHTML = t.tochen.join('<br>');
                commentaryDiv.appendChild(tochen);
            });


            commentaryContainer.appendChild(commentaryDiv);
        });
    }



    var n = displayNavigation(letter);
    if(!n) return;
    updateNav(nm.split(".json").join(""));
    show(n);
}



function displayPortion(data, id) {
    // Clear previous content
    const sectionDiv = document.getElementById('portions');
    sectionDiv.innerHTML = '';

    var nm = generateNameFromID(id);

    /*show the portion page (for back logic later)*/
    pagesShown.push([sectionDiv, nm]);
    updateNav(nm);
    hideAll();
    show(sectionDiv);
    /*
    const closeButton = document.createElement('span'); // Close button
    closeButton.innerHTML = 'X';
    closeButton.onclick = () => {

        sectionDiv.innerHTML = "";
    };
    closeButton.className = 'close-button';

    portionContainer.appendChild(closeButton);
    */

    // Create portion container
    const portionContainer = document.createElement('div');
    portionContainer.className = 'portion-container';



    sectionDiv.appendChild(portionContainer);

    
    // Display section details
    data.portions.forEach(portion => {
        const portionDiv = document.createElement('div');
        portionDiv.className = 'portion';
        
        const button = document.createElement('button');
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

    
    hideAll();
    
    // Clear previous content
    const sectionDiv = document.getElementById('section');

    /*I'm now displaying the section, for back logic*/
    var nm = generateNameFromID(id)
    pagesShown.push([sectionDiv,nm]);
    updateNav(nm);

    sectionDiv.innerHTML = '';
    show(sectionDiv)
    // Create subsection container
    const subSectionContainer = document.createElement('div');
    subSectionContainer.className = 'subsection-container';
    sectionDiv.appendChild(subSectionContainer);

    // Display the Hebrew letters and content
    data.sections.forEach(letter => {
        const letterBtn = document.createElement('button');
        letterBtn.className = 'letter';
        letterBtn.onclick = () => {
            _section = letter;  

            loadSubSection(letter);
            highlightSelected(letterBtn); // Highlight the selected section
            updateNav(letter);
        };

        

        const siman = document.createElement('h2');
        siman.textContent = letter.split(".json").join("");
        letterBtn.appendChild(siman);

        subSectionContainer.appendChild(letterBtn);
    });
}


// Function to highlight the selected section
function highlightSelected(element) {
    const letters = document.getElementsByClassName('letter');
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
    const mainContent = document.getElementById('main-content');

    const currentSize = parseInt(window.getComputedStyle(mainContent).fontSize);
    mainContent.style.fontSize = (
        currentSize + direction * FONT_CHANGE_AMOUNT
    ) + "px";
}


// Function to display navigation links within the main content header
function displayNavigation(letter, nm = "") {
    // Retrieve the main content header
    const mainContentHeader = document.getElementById('main-content-header');
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
            const link = document.createElement('a');
            link.className = 'navigation-link';
            link.textContent = section.shaym; // Display section name
            link.href = `#shulchanAruch-${section.shaym}`; // Link to the specific section using ID
            navigationContainer.appendChild(link);
        });
    }

    // Check and create links for commentary sections
    if (letter.commentaries) {
        letter.commentaries.forEach(commentary => {
            const link = document.createElement('a');
            link.className = 'navigation-link';
            link.textContent = commentary.shaym; // Display commentary name
            link.href = `#commentary-${commentary.shaym}`; // Link to the specific commentary using ID
            navigationContainer.appendChild(link);
        });
    }

    return mainContentHeader;
}

