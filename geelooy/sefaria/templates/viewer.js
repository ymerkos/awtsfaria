//B"H
var currentParagraph = null;
var curParNum = 0;
var currentlySelectedParagraph = null;
import firebaseConfig from "../config.js"
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import {
    getFirestore,
    collection,
    query,
    where,
	addDoc,
    getDocs 
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
var db = null;
var sichaId = null;
console.log(window.currentUser)
// Initialize Firebase
var app = initializeApp(firebaseConfig);
    // Parse the URL parameters
    var params = getUrlVars();
    var parshaId = params['parsha'];
    var sichaNum = params['sicha'];
    var volume = params['volume'];
    
    if(params && parshaId && sichaNum && volume) {
		db = getFirestore();
    // Fetch the document from Firestore
   // Fetch the document from Firestore
    var q = query(
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
			sichaId = doc.id;
        // Doc data
        var docData = doc.data();
            console.log("Dat",docData)
        // Now, you can populate your web viewer using docData.Main_Text and docData.Footnotes, etc.
        document.getElementById('mainText').innerHTML = parseData(docData.Main_text);
		readHash();
		rightClickLogic();
        //document.getElementById('footnotes').innerHTML = docData.Footnotes;
        parseFootnotes(docData.Footnotes)

        observeStuff();
        });
    })
    .catch((error) => {
        console.log("Error fetching document:", error);
    });
    }

function rightClickLogic() {
	Array.from(dynamic.querySelectorAll(".paragraph"))
	.forEach(w=>{
		
		currentlySelectedParagraph = w;
		w.oncontextmenu = rightClick; 
		
		
		w.addEventListener('mouseup', (e) => {
			// Get the user's selection
			var selection = window.getSelection();
			console.log(selection,"SEL")
			// Make sure the selection is not empty and is within the div
			if (!selection.isCollapsed && 
			selection.rangeCount > 0 && w.contains(selection.anchorNode)) {
			  // Get the range of the selection
			  var range = selection.getRangeAt(0);

			  // Create a new range that spans from the start of the div to the start of the selection
			  var preSelectionRange = range.cloneRange();
			  preSelectionRange.selectNodeContents(w);
			  preSelectionRange.setEnd(range.startContainer, range.startOffset);

			  // The start offset of the selection within the div
			  var startOffset = preSelectionRange.toString().length;
			  
			  // Do something with the start offset
			  console.log('Selection start offset:', startOffset);
				cmtAwtsmoos.style.display="";
				var childElement = cmtAwtsmoos.querySelector('.div-block-comment-2');
  // Get the dimensions of the child element
					var childRect = childElement.getBoundingClientRect();
  

				  // Calculate the offset of the child element from the top-left corner of the parent
				  var childOffsetX = childElement.offsetLeft+ (childRect.width / 2);
				  var childOffsetY = childElement.offsetTop+childRect.height;

				  // Set the position of the parent element
				  // Subtract the child offsets to align the child with the mouse cursor
				  cmtAwtsmoos.style.left = (e.pageX - childOffsetX) + "px"; 
				  cmtAwtsmoos.style.top = (e.pageY - childOffsetY) + "px"; 
				  
			  // Optional: clear the selection if you want
			  // selection.removeAllRanges();
			}
		  });
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
 var container = document.querySelector('.intensityAwtsmoos'); // This is the scroll container
 window.cin=container
 
 function observeStuff() {
  var offset = 200;
  var container = document.querySelector('.paragraphic');
  var paragraphs = container.querySelectorAll('.paragraph');

  // Function to determine and highlight the current paragraph
  function highlightCurrentParagraph() {
    // Find the current scroll position relative to the container
    var scrollPosition = window.scrollY + container.getBoundingClientRect().top + offset;

    // Keep track of whether a paragraph has been highlighted
    let isHighlighted = false;

    paragraphs.forEach((para,i) => {
      // Get the paragraph's position relative to the document
      var paraPosition = para.getBoundingClientRect().top + window.scrollY;

      // Check if the paragraph is within the current viewport plus the offset
      if (scrollPosition >= paraPosition && scrollPosition < paraPosition + para.offsetHeight) {
        // Highlight the paragraph
        para.classList.add('paragraph-selected');
		getFootnotesForParagraph(para);
		updateParagraphURL(i)
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
  var resizeObserver = new ResizeObserver(entries => {
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
  var styleId = 'dynamic-font-size-style-'+className;
  
  // Check if the style element already exists, if not, create it
  let styleElement = document.getElementById(styleId);
  if (!styleElement) {
    styleElement = document.createElement('style');
    styleElement.id = styleId;
    dynamic.appendChild(styleElement);
  }
  
  
  // Try to get the computed font size from the first element with the class
	let currentSize
  var exampleElement = document.querySelector('.' + className);
  if (exampleElement) {
    var computedStyle = window.getComputedStyle(exampleElement);
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




//right lcikc stuff
document.onclick = hideMenu; 
document.onmousedown = hideComment
document.oncontextmenu = e => {
	e.preventDefault();
};

function hideComment (e) {
	if(e.target != cmtAwtsmoos && !cmtAwtsmoos.contains(e.target))
if(cmtAwtsmoos.style.display == "")
	cmtAwtsmoos.style.display="none";
}

function hideMenu() { 
	document.getElementById("contextMenu") 
			.style.display = "none";
		console.log("Brutal")
	var out = Array.from(document.body.querySelectorAll(".highlighted"));
	console.log(window.g=out);
	out.forEach(w=>{
		w.classList.remove("highlighted");
	})
	
} 

function updateParagraphURL(num) {
	currentParagraph = num;
	location.hash="par="+num
}

function readHash() {
	var str = "par="
	var parIn = location.hash.indexOf(str);
	
	if(parIn > -1) {
		var num = location.hash.substring(parIn+str.length);
		var f = false;
		console.log("Hi!",parIn,num);
		Array.from(document.body.querySelectorAll(".paragraph, .paragraph-selected"))
		.forEach((w,i) => {
			if(num == i) {
				f = true;
				scrollToParagraph(i);
			}
		})
	}
}


function scrollToParagraph(parNum) {
	
	var par = document.body.querySelectorAll(".paragraph, .paragraph-selected")[parNum];
	if(!par) return console.log("Not found!");
	par.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function rightClick(e) { 
	e.preventDefault(); 
	e.target.classList.add("highlighted")
	if (document.getElementById("contextMenu").style.display == "block"){ 
		hideMenu(); 
	}else{ 
		var menu = document.getElementById("contextMenu")      
		menu.style.display = 'block'; 
		menu.style.left = e.pageX + "px"; 
		menu.style.top = e.pageY + "px"; 
	} 
} 


async function copyTextToClipboardAsync(text) {
  try {
    await navigator.clipboard.writeText(text);
    console.log('Text copied to clipboard');
  } catch (err) {
    console.error('Failed to copy: ', err);
  }
}


function setupRightclickMenuEvents(){
	shareA.onclick = async () => {
		await copyTextToClipboardAsync(
		"B\"H\nHey! What's cracking? Check out this\nAMAZING paragraph here:"
+		location.href);

		var oldTx = shareA.textContent;
		//shareA.innerText = "Copied link!";
		setTimeout(() => {
			//shareA.textContent = oldTx
		}, 1000);
	};
	
	copyBtn.onclick = async() => {
		var par = currentlySelectedParagraph;
		if(!par) {
			//copyBtn.innerText = "Did NOT copy paragraph :(";
			setTimeout(() => {
				copyBtn.textContent = oldTx
			}, 1000);
			return;
		}
		var txt = par.textContent;
		await copyTextToClipboardAsync(txt);

		var oldTx = copyBtn.textContent;
		//copyBtn.innerText = "Copied paragraph! :)";
		setTimeout(() => {
			//copyBtn.textContent = oldTx
		}, 1000);
	};
	
	
	var original_text = null;
	airOr.onclick = () => {
		var par = currentlySelectedParagraph;
		if(!par) {
			alert("No paragraph selected!?")
			return;
			
		}
		original_text = currentlySelectedParagraph.innerHTML;
		errorific.style.display="";
		interesting.innerHTML = par.innerHTML;
		interesting.setAttribute("dir",
			par.getAttribute("dir")
		)
	};
	
	closeError.onclick = () => {
		errorific.style.display="none";
	};
	
	submitError.onclick = async () => {
		var urls = getUrlVars();
		var Sicha_id = urls.sicha;
		var paragraph_num = currentParagraph;
		
		// Now, to add a document to the "Error Reports" collection with the specific fields:
		async function addErrorReport() {
		  try {
			var docRef = await addDoc(collection(db, "Error Reports"), {
			  Sicha_id:sichaId,
			  main_or_footnote_text: true,
			  original_text,
			  paragraph_num,
			  submitted_time: Date.now(),
			  suggested_by_user: currentUser.uid,
			  suggested_text: interesting.value
			});
			alert("Document written with ID: "+ docRef.id);
		  } catch (e) {
			alert("Error adding document: "+ e);
		  }
		};
		
		await addErrorReport();
	};
}

setupRightclickMenuEvents();