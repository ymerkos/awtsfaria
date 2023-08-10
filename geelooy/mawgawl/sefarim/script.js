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

var _sefer = null;
var _portion = null;
var _section = null;

function loadPortion(sefer) {
    _sefer = sefer;
    fetch(`/api/sefarim/${sefer}`)
        .then(response => response.json())
        .then(data => displayPortion(data))
        .catch(error => console.error('An error occurred:', error));
}



function loadSection(portion) {
    _portion = portion;
    fetch(`/api/sefarim/${_sefer}/section/${portion}`)
        .then(response => response.json())
        .then(data => displaySection(data))
        .catch(error => console.error('An error occurred:', error));
}




function loadSubSection(subSectionName) {
    fetch(
        `/api/sefarim/${_sefer}/section/${_portion}/sub/${subSectionName}`
    ).then(r=>r.json())
    .then(r=>displaySubSection(r))
}


//B"H
/*
 * Chapter: The Codex Reimagined
 * Scene: A Digital Symphony
 * Dialogue: The Revelation of Sacred Texts
 * Here, the sub-sections of the sacred texts are displayed with grace and elegance.
 * The Shulchan Aruch content and the commentaries are woven together in a digital tapestry,
 * reflecting the profound wisdom and the essence of the Awtsmoos.
 */

function displaySubSection(sub) {
    const main = document.getElementById('main-content');
    main.innerHTML = ''; // Clear previous content

    var letter = sub.subSection;

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

            commentary.tochen.forEach(t => {
                var subHeader = document.createElement('h4');
                subHeader.textContent = t.shaym;
                commentaryDiv.appendChild(subHeader);

                const tochen = document.createElement('p');
                tochen.innerHTML = t.tochen.join('<br>');
                commentaryDiv.appendChild(tochen);
            });

            const shaym = document.createElement('span');
            shaym.textContent = commentary.shaym;
            commentaryDiv.appendChild(shaym);

            commentaryContainer.appendChild(commentaryDiv);
        });
    }
}



function displayPortion(data) {
    // Clear previous content
    const sectionDiv = document.getElementById('section');
    sectionDiv.innerHTML = '';

    const closeButton = document.createElement('span'); // Close button
    closeButton.innerHTML = 'X';
    closeButton.onclick = () => {
        sectionDiv.innerHTML = "";
    };
    closeButton.className = 'close-button';

    // Create portion container
    const portionContainer = document.createElement('div');
    portionContainer.className = 'portion-container';



    portionContainer.appendChild(closeButton);
    sectionDiv.appendChild(portionContainer);

    
    // Display section details
    data.portions.forEach(portion => {
        const portionDiv = document.createElement('div');
        portionDiv.className = 'portion';
        
        const button = document.createElement('button');
        button.textContent = portion.name;
        button.onclick = () => loadSection(portion.id);
        portionDiv.appendChild(button);

        portionContainer.appendChild(portionDiv);
    });
}

function displaySection(data) {

    var hd = document.getElementById("main-content-header");


    // Clear previous content
    const sectionDiv = document.getElementById('section');
    sectionDiv.innerHTML = '';

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

            hd.textContent = "Section: " + letter.split(".json").join("");
            loadSubSection(letter);
            highlightSelected(letterBtn); // Highlight the selected section
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
    mainContent.style.fontSize = (currentSize + direction) + "px";
}