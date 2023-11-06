//B"H

import firebaseConfig from "../config.js"
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import {
    getFirestore,
    collection,
    query,
    where,
    getDocs 
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";


// Initialize Firebase
const app = initializeApp(firebaseConfig);
    // Parse the URL parameters
    var params = getUrlVars();
    var parshaId = params['parsha'];
    var sichaNum = params['sicha'];
    var volume = params['volume'];
    
    if(params && parshaId && sichaNum && volume) {
    const db = getFirestore();
    // Fetch the document from Firestore
   // Fetch the document from Firestore
    const q = query(
        collection(db, 'books', 'Likkutei Sichos', 'Sichos'),
        where('Parsha_id', '==', parshaId),
        where('Sicha_num', '==', sichaNum),
        where('Volume', '==', volume)
    );

    
    getDocs(q)
    .then((querySnapshot) => {
        console.log("Hi there!",querySnapshot)
        var sz = querySnapshot.size;
        if(!sz) {
            alert("Sicha not found! Here's some default balak text")
        }
        querySnapshot.forEach((doc) => {
            console.log("LOL!",doc)
        // Doc data
        var docData = doc.data();
            console.log("Dat",docData)
        // Now, you can populate your web viewer using docData.Main_Text and docData.Footnotes, etc.
        document.getElementById('mainText').innerHTML = parseData(docData.Main_text)
        //document.getElementById('footnotes').innerHTML = docData.Footnotes;
        

        observeStuff();
        });
    })
    .catch((error) => {
        console.log("Error fetching document:", error);
    });
    }

var dp = new DOMParser()
function parseData(inputHTML) {
    var dc = dp.parseFromString(inputHTML, "text/html");
    var p = dc.querySelectorAll("p")
    Array.from(p).forEach(w=>w.classList.add("paragraph"));

    var h1 = dc.querySelector("h1");
    if(h1) {
        var cnt = h1.textContent;
        h1.innerHTML = `<div class="div-block">
            <div class="text-block">${cnt}</div>
        </div>`
    }
   
    return dc.body.innerHTML
}
 const container = document.querySelector('.intensityAwtsmoos'); // This is the scroll container
 window.cin=container
 
 function observeStuff() {
  const offset = 200;
  const container = document.querySelector('.intensityAwtsmoos');
  const paragraphs = container.querySelectorAll('.paragraph');

  // Function to determine and highlight the current paragraph
  function highlightCurrentParagraph() {
    // Find the current scroll position relative to the container
    const scrollPosition = window.scrollY + container.getBoundingClientRect().top + offset;

    // Keep track of whether a paragraph has been highlighted
    let isHighlighted = false;

    paragraphs.forEach(para => {
      // Get the paragraph's position relative to the document
      const paraPosition = para.getBoundingClientRect().top + window.scrollY;

      // Check if the paragraph is within the current viewport plus the offset
      if (scrollPosition >= paraPosition && scrollPosition < paraPosition + para.offsetHeight) {
        // Highlight the paragraph
        para.classList.add('paragraph-selected');
        isHighlighted = true;
      } else {
        // Remove highlight from paragraphs not in the viewport
        para.classList.remove('paragraph-selected');
      }
    });

    // If no paragraphs were highlighted and we have paragraphs, highlight the last one
    if (!isHighlighted && paragraphs.length > 0) {
      paragraphs[paragraphs.length - 1].classList.add('paragraph-selected');
    }
  }

  // Add scroll event listener
  container.addEventListener('scroll', highlightCurrentParagraph);

  // Resize observer for the container
  const resizeObserver = new ResizeObserver(entries => {
    // Ensure that the correct paragraph is highlighted after resize
    highlightCurrentParagraph();
  });

  // Start observing the container
  resizeObserver.observe(container);

  // Initial highlight check
  highlightCurrentParagraph();
}


