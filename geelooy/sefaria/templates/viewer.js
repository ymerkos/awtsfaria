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
 const paragraphPositions = [];
 window.pp = paragraphPositions
function observeStuff() {
   
    const paragraphs = container.querySelectorAll('.paragraph');
	

	// Cache positions and heights of paragraphs
	function cacheParagraphPositions() {
		paragraphPositions.length = 0; // Clear any existing entries
		paragraphs.forEach((para) => {
			const rect = para.getBoundingClientRect();
			// Cache the absolute top offset, not the relative one
			const absoluteTop = rect.top + window.pageYOffset;
			paragraphPositions.push({
				element: para,
				top: absoluteTop,
				bottom: absoluteTop + rect.height
			});
		});
		highlightCurrentParagraph()
	}

	// Run this function when the page loads or when paragraphs are generated
	cacheParagraphPositions();
	
	
	// Function to perform a binary search on the array of paragraph positions
	function findCurrentParagraph(scrollPosition, offset = 200) {
	  let start = 0;
	  let end = paragraphPositions.length - 1;

	  while (start <= end) {
		const mid = Math.floor((start + end) / 2);
		const para = paragraphPositions[mid];

		if (scrollPosition + offset >= para.top && scrollPosition + offset < para.bottom) {
		  return para.element;
		} else if (scrollPosition + offset < para.top) {
		  end = mid - 1;
		} else {
		  start = mid + 1;
		}
	  }
	  return null;
	}

	// Function to highlight the current paragraph based on the binary search result
	function highlightCurrentParagraph() {
	  const scrollPosition = container.scrollTop + container.offsetTop;
	  const currentParagraph = findCurrentParagraph(scrollPosition);

	  // If a current paragraph is found and it's not already highlighted
	  if (currentParagraph && !currentParagraph.classList.contains('paragraph-selected')) {
		// Remove the class from the previously selected paragraph if any
		const previousSelected = container.querySelector('.paragraph-selected');
		if (previousSelected) {
		  previousSelected.classList.remove('paragraph-selected');
		}

		// Add the class to the current paragraph
		currentParagraph.classList.add('paragraph-selected');
	  }
	}


	// Highlight top paragraph on scroll
	container.addEventListener('scroll', highlightCurrentParagraph);
	
	// You can also run cacheParagraphPositions when the window is resized to update positions
	// as they might change if the layout is responsive
	function debounce(func, wait) {
	  let timeout;
	  return function executedFunction(...args) {
		const later = () => {
		  clearTimeout(timeout);
		  func(...args);
		};
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
	  };
	};

	// Wrap the resize listener call in the debounce function
	window.addEventListener('resize', debounce(() => {
	  cacheParagraphPositions();
	}, 500)); // Waits for 250ms of no resize events before executing


}