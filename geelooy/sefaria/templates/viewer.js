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
   
    let lastKnownScrollPosition = 0;
   

    // Function to highlight the topmost fully visible paragraph
    function highlightTopParagraph() {
		console.log("YO!")
		
        let highlighted = false;
        container.querySelectorAll('.paragraph, .paragraph-selected').forEach(para => {
            const paraTop = para.offsetTop - container.scrollTop;
            const paraBottom = paraTop + para.clientHeight;
			
            // Check if the paragraph is fully within the visible area of the container
            if (paraTop >= 0 && paraBottom <= container.clientHeight && !highlighted) {
				console.log(paraTop,container.scrollTop,para)	
                para.classList.add('paragraph-selected');
				para.classList.remove('paragraph')
                highlighted = true;
            } else {
				para.classList.add('paragraph')
                para.classList.remove('paragraph-selected');
            }
        });
    }

    // Initial highlight when content is loaded
    highlightTopParagraph();

    // Highlight top paragraph on scroll
    container.addEventListener('scroll', highlightTopParagraph);


}