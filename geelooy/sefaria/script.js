//B"H

var signInBtn = document.getElementById("awtsmoos-sign-in");
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
                await loadScript("./templates/"+p)
				checkTools()
            }
        }
}

var bar  = document.getElementById("w-nav-overlay-1")
async function loadScript(pth) {
	return new Promise((r,j) => {
			
		var sc = document.createElement("script");
		sc.src=pth;
		sc.type="module"
		sc.onload = () => {
			r()
		};
		sc.onerror = () => {
			r("Error");
		}
		document.head.appendChild(sc);
	});
}

function checkTools() {
	if(window.tools && typeof(window.tools == "function")) {
		if(bar) {
			bar.innerHTML = "";
			tools(bar);
		}
	}
}


window.getUrlVars = getUrlVars;


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
var app = initializeApp(firebaseConfig);
var auth = getAuth();
var isSignedIn = false;
// Set initial status	
window.currentUser = null;	
console.log("Started",app,auth)
 function whenLoaded() {
    console.log("testing")
    signInBtn.innerText = "Checking...";
    
    onAuthStateChanged(auth, (user) => {
        console.log("Changed!",user)
		window.currentUser = user;
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
    var provider = new GoogleAuthProvider();
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
    var parts = window.location.search.substring(1).split('&');
    for (var i = 0; i < parts.length; i++) {
        var pair = parts[i].split('=');
        if (pair.length === 2) {
            vars[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
        }
    }
    return vars;
}


window.googleSignIn=googleSignIn;