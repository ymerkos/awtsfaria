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
        parseFootnotes(docData.Footnotes)

        observeStuff();
        });
    })
    .catch((error) => {
        console.log("Error fetching document:", error);
    });
    }

var dp = new DOMParser()

function parseFootnotes(ft) {
	var ftn = dp.parseFromString(ft, "text/html")
	var ps = Array.from(ftn.body.querySelectorAll("p"));
	var mostRecentFootnote = null;
	var mapt = ps.map((w,i)=>{
		var txt = w.innerText;
		var iop/*index of parenthesi*/=txt.indexOf(")")
		var footnoteNumberIfAny = 
		iop > 0 &&
		iop < 4 ? 
				txt.substring(0,iop) 
				: null;
				
		if(footnoteNumberIfAny) {
			/**
				additional checks
				to make sure
				its an english 
				number footnote
			**/
			
			if(!(/^\d+$/.test(footnoteNumberIfAny))) {
				footnoteNumberIfAny = null;
			}
			
			try {
				footnoteNumberIfAny = parseInt(
					footnoteNumberIfAny
				)
			} catch(e) {
				footnoteNumberIfAny = null;
			}
			mostRecentFootnote = footnoteNumberIfAny;
		}
		var newEl = document.createElement("p")
		newEl.setAttribute("dir",
			w.getAttribute("dir")
		)
		newEl.innerText=txt;
		newEl.className = "footnote-paragraph";
		var res = ({
			fullText: newEl.outerHTML,
			paragraphIndex:i,
			footnoteNumberIfAny,
			
			mostRecentFootnote
				
		})
		return res;
	});
	
	var currentFootnote = null;
	var nestedFootnotes = [];
	mapt.forEach((w) => {
		if(w.footnoteNumberIfAny) {
			var hadNote = false;
			if(currentFootnote) {
				hadNote = true;
			}
			currentFootnote = {
				...w,
				sub: []
			}
			
			nestedFootnotes.push(currentFootnote)
			
		} else if(currentFootnote) {
			currentFootnote.sub.push({
				...w
			})
		}
	});
	
	var mappedNotes = [];
	nestedFootnotes.forEach(n => {
		mappedNotes[n.footnoteNumberIfAny]
		= {
			mainTxt: n.fullText,
			index: n.footnoteNumberIfAny
		}
		
		var mn = mappedNotes[n.footnoteNumberIfAny]
		if(n.sub.length) {
			mn
			.sub = n.sub.map(q=>({
				txt: q.fullText
			}))
		}
		
		mn
		.stringed = () => {
			var res = mn.mainTxt;
			if(mn.sub) {
				mn.sub.forEach(q=> {
					res+="<br>"+q.txt
				})
			}
			console.log(res,mn,mn.mainTxt,mn.sub)
			return res+"<br>" 	;
		};
		
	});
	
	console.log(window.h=ftn,window.g=mapt,window.n=nestedFootnotes,
	window.mappedNotes=mappedNotes)
	
}

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
  const container = document.querySelector('.paragraphic');
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
		getFootnotesForParagraph(para);
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

var lastPar = null;
function getFootnotesForParagraph(para) {
	if(para == lastPar) return;
	lastPar = para;
	var sups = Array.from(para.querySelectorAll("sup"));
	
	
	var h = document.body.querySelector(".footnoteHolder")
	if(!sups.length) {
		console.log("no notes")
		if(h) {
			h.innerHTML = "";
		}
		return null;
	}
	if(window.mappedNotes) {
		var frst = sups[0];
		var lst = sups[sups.length-1];
		try {
			frst = parseInt(frst.innerText);
			lst = parseInt(lst.innerText);
		} catch(e) {
			return null;
		}
		var notes = mappedNotes.slice(frst, lst+1);
		
		console.log("Got!",notes,sups,frst,lst)
		if(!h) return;
		
		h.innerHTML = notes.map(w=>w.stringed()).join("<br>");
	}
}

window.tools = (bar) => {
	var fontDecrease = document.createElement("button")
	fontDecrease.innerText = "Smaller font";
	bar.appendChild(fontDecrease);
	fontDecrease.onclick = () => {
		changeFontSize("paragraph", false);
		
		changeFontSize("footnote-paragraph", false);
	}
	
	var fontIncrease = document.createElement("button")
	fontIncrease.innerText = "Bigger font";
	bar.appendChild(fontIncrease);
	fontIncrease.onclick = () => {
		changeFontSize("paragraph", true);
		
		changeFontSize("footnote-paragraph", true);
	}
	
}

function changeFontSize(className, increase = true, amount = 3.7) {
  // Define the ID for our dynamic style element
  const styleId = 'dynamic-font-size-style-'+className;
  
  // Check if the style element already exists, if not, create it
  let styleElement = document.getElementById(styleId);
  if (!styleElement) {
    styleElement = document.createElement('style');
    styleElement.id = styleId;
    dynamic.appendChild(styleElement);
  }
  
  
  // Try to get the computed font size from the first element with the class
	let currentSize
  const exampleElement = document.querySelector('.' + className);
  if (exampleElement) {
    const computedStyle = window.getComputedStyle(exampleElement);
    currentSize = parseFloat(computedStyle.fontSize);
	console.log("Hi!",exampleElement,currentSize);
  } else {
    // Fallback if no elements exist with that class yet
    currentSize = 16; // or your default base font size
  }
  
  // Increase or decrease the font size
  currentSize += increase ? amount : -amount;
  
  // Update the style element with the new font size for the class
  styleElement.innerHTML = `.${className} { font-size: ${currentSize}px !important; }`;
}

