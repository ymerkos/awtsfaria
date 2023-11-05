//B"H

const signInBtn = document.getElementById("awtsmoos-sign-in");
console.log(signInBtn)
var pageToScript = {
    "sichos": "homepageScript.js",
    "upload":"upload.js",
    "viewer":"viewer.js"
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
import firebaseConfig from "./config.js"
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
window.getUrlVars = getUrlVars;