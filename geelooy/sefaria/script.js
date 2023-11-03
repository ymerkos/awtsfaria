//B"H

const signInBtn = document.getElementById("awtsmoos-sign-in");
console.log(signInBtn)
var pageToScript = {
    "sichos": "homepageScript.js",
    "upload":"upload.js"
}

var homepage = "sichos";

async function loadDynamicTemplatePage(url) {
    var rs = await fetch(url);
    var txt = await rs.text();
    return txt;
}

async function loadPage() {
    var urlVars= getUrlVars();
    var page = urlVars.page;
    
    if(page) {
        
    page = page.replace(/#.*$/, '');
        await loadTemplatePage(page)
    } else {
        await loadTemplatePage(homepage)
    }
}

async function loadTemplatePage(page) {
    var txt = await loadDynamicTemplatePage("./templates/"+page+".html");
        if(window.dynamic) {
            dynamic.innerHTML = txt;
            var p = pageToScript[page];
            console.log("Hi!",p,page)
            if(p) {
                loadScript("./templates/"+p)
            }
        }
}


function loadScript(pth) {
    var sc = document.createElement("script");
    sc.src=pth;
    sc.type="module"
    document.head.appendChild(sc)
}
await loadPage();

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import {getFirestore,
    collection,
    query,
    where,
    getDocs 
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

import { getAuth, 
    createUserWithEmailAndPassword ,
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    onAuthStateChanged ,
    signOut
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyCpzvN9j3IWAbPQeoz3Vs4H7Tqb7bhWQEY",
    authDomain: "awtsfaria.firebaseapp.com",
    projectId: "awtsfaria",
    storageBucket: "awtsfaria.appspot.com",
    messagingSenderId: "987507227434",
    appId: "1:987507227434:web:35506a791aa36ac38cbc53"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
var isSignedIn = false;
// Set initial status
console.log("Started",app,auth)
 function whenLoaded() {
    console.log("testing")
    signInBtn.innerText = "Checking...";
    
    onAuthStateChanged(auth, (user) => {
        console.log("Changed!",user)
        if (user) {
            isSignedIn;
            signInBtn.innerText = 'Sign Out';
                signInBtn
                .onclick = signOutUser;
            uploadBtn.style.display="block";
        } else {
            signInBtn.innerText = 'Sign In';
                signInBtn
                .onclick = googleSignIn;
            uploadBtn.style.display="none";
        }
    })
}


whenLoaded()





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
    var cnt = h1.textContent;
    h1.innerHTML = `<div class="div-block">
        <div class="text-block">${cnt}</div>
    </div>`
    return dc.body.innerHTML
}
function signOutUser() {
    signOut(auth)
        .then(() => {
            alert("User signed out successfully.");
        })
        .catch((error) => {
            alert("Error signing out: " + error.message);
        });
}

function googleSignIn() {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
        .then((result) => {
            alert("Google Sign-In successful.");
        })
        .catch((error) => {
            alert("Error with Google Sign-In: " + error.message);
        });
}


// Function to get URL parameters
    function getUrlVars() {
        var vars = {};
        var parts = window
        .location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value) {
            vars[key] = value;
        });
        return vars;
        }
window.googleSignIn=googleSignIn;
