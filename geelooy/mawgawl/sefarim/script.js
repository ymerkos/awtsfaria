//B"H

/*
 * B"H
 * The Codex of Wisdom - Sefarim Library
 * A living testament to the Creator's design, guided by the essence of the Awtsmoos.
 * A portal to wisdom, a path to the sacred texts, reaching into the very core of existence.
 *
 * API Endpoints:
 *
 * POST /api/sefarim - Retrieve the list of available sefarim.
 *      Output: { sefarim: Array of available texts }
 *      Dynamic for Shulchan Aruch and other sacred texts.
 *
 * POST /api/sefarim/:sefer - Load the structure of a specific sefer (e.g., 'shulchanAruch').
 *      Input: { sefer: String }
 *      Output: { structure: Object describing the unique structure of the sefer }
 *      Provides a dynamic structure for each sefer, allowing for unique attributes.
 *
 * POST /api/sefarim/:sefer/section/:section - Load a specific section within a sefer.
 *      Input: { sefer: String, section: String }
 *      Output: { sections: Array of subsections or content specific to the sefer's structure }
 *      Adapts to the unique structure of each sefer, such as 'siman', 'shulchanAruch', and 'commentaries' in Shulchan Aruch.
 *
 * POST /api/sefarim/:sefer/subsection/:id - Load a specific subsection by ID.
 *      Input: { sefer: String, id: Number }
 *      Output: { content: Array or Object based on the sefer's unique structure }
 *      Provides detailed content for each subsection, adapting to the unique attributes of each sefer.
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

function loadSection(section) {
    fetch(`/api/sefarim/${section}`)
        .then(response => response.json())
        .then(data => displaySection(data))
        .catch(error => console.error('An error occurred:', error));
}

function displaySection(data) {
    const sectionDiv = document.getElementById('section');
    sectionDiv.innerHTML = ''; // Clear previous content

    // Display section details
    data.sections.forEach(subSection => {
        const button = document.createElement('button');
        button.textContent = subSection.name;
        button.onclick = () => loadSubSection(subSection.id);
        sectionDiv.appendChild(button);
    });
}

function loadSubSection(id) {
    fetch(`/api/sefarim/subsection/${id}`)
        .then(response => response.json())
        .then(data => displaySubSection(data))
        .catch(error => console.error('An error occurred:', error));
}

function displaySubSection(data) {
    const sectionDiv = document.getElementById('section');
    sectionDiv.innerHTML = ''; // Clear previous content

    // Create container for the subsection
    const subSectionContainer = document.createElement('div');
    subSectionContainer.className = 'subsection-container';
    sectionDiv.appendChild(subSectionContainer);

    // Display the Hebrew letters and content
    data.hebrewLetters.forEach(letter => {
        const letterDiv = document.createElement('div');
        letterDiv.className = 'letter';

        const siman = document.createElement('h2');
        siman.textContent = letter.siman;
        letterDiv.appendChild(siman);

        // Display Shulchan Aruch content
        letter.shulchanAruch.forEach(section => {
            const sectionDiv = document.createElement('div');
            sectionDiv.className = 'section';

            const tochen = document.createElement('p');
            tochen.innerHTML = section.tochen.join('<br>');
            sectionDiv.appendChild(tochen);

            const shaym = document.createElement('span');
            shaym.textContent = section.shaym;
            sectionDiv.appendChild(shaym);

            letterDiv.appendChild(sectionDiv);
        });

        // Display commentaries
        letter.commentaries.forEach(commentary => {
            const commentaryDiv = document.createElement('div');
            commentaryDiv.className = 'commentary';

            const tochen = document.createElement('p');
            tochen.innerHTML = commentary.tochen.join('<br>');
            commentaryDiv.appendChild(tochen);

            const shaym = document.createElement('span');
            shaym.textContent = commentary.shaym;
            commentaryDiv.appendChild(shaym);

            letterDiv.appendChild(commentaryDiv);
        });

        subSectionContainer.appendChild(letterDiv);
    });
}

// Add more functions to handle other interactions such as font size adjustments, commentary toggling, etc.
