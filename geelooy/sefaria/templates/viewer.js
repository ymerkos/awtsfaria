//B"H
console.log("HII!OI!IO!")
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

function observeStuff() {
    const container = document.querySelector('.paragraphic'); // This is the scroll container
    let lastKnownScrollPosition = 0;
    let ticking = false;

    const paragraphs = container.querySelectorAll('.paragraph');
    function highlightTopParagraph(scrollPos) {
        let highlighted = false;
        // Get all paragraph elements within the container
        paragraphs.forEach(para => {
            const paraTop = para.offsetTop - container.offsetTop - scrollPos;
            const paraBottom = paraTop + para.clientHeight;

            // Check if the paragraph is fully within the visible area of the container
            if (paraTop >= 0 && paraBottom <= container.clientHeight && !highlighted) {
                para.classList.add('paragraph-selected');
                highlighted = true;
            } else {
                para.classList.remove('paragraph-selected');
            }
        });
    }

    container.addEventListener('scroll', function(e) {
        lastKnownScrollPosition = container.scrollTop;

        if (!ticking) {
            window.requestAnimationFrame(function() {
                highlightTopParagraph(lastKnownScrollPosition);
                ticking = false;
            });

            ticking = true;
        }
    });

    let observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            console.log("Hi!",entry.target)
            // Only consider the target fully visible if its intersectionRatio is 1
            if (entry.intersectionRatio === 1) {
                // Remove the selected class from all paragraphs
                paragraphs.forEach(p => p.classList.remove('paragraph-selected'));
                // Add the selected class to the intersecting paragraph
                entry.target.classList.add('paragraph-selected');
            }
        });
    }, {
        root: null, // Set the root to the .paragraphic container
        threshold: 1.0 // Trigger when the target is fully visible
    });

    // Observe all paragraphs within the .paragraphic container
    container.querySelectorAll('.paragraph').forEach(paragraph => {
        observer.observe(paragraph);
    });
}