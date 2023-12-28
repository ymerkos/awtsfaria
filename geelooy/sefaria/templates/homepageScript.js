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
var app = initializeApp(firebaseConfig);


import parshaList from "../parshaList.js"
var navbar2 = document.getElementsByClassName("navbar-2 w-nav")[0];
if(navbar2)
navbar2.parentNode.removeChild(navbar2)
var parshaBtn = document.getElementById("w-tabs-0-data-w-tab-0");
var volumeBtn = document.getElementById("w-tabs-0-data-w-tab-1");

var volumeTab = document.getElementById("w-tabs-0-data-w-pane-1")
var parshaTab = document.getElementById("w-tabs-0-data-w-pane-0")
var onParshaPage = true;


var seferDivClass = "w-layout-blockcontainer container-5 w-container"

var parshaClass = "parsha-names w-button"
var greenBar = parshaBtn.children[0];


function makeParshaContainer() {
    var dv = document.createElement("div")
        dv.className = seferDivClass;
        return dv;
}
function populateAllTabs() {
    parshaTab.innerHTML = "";
    //parshos tab
    parshaList.forEach(s => {
        
        var dv = makeParshaContainer();
        var h1 = document.createElement("h3");
        parshaTab.appendChild(h1)
        parshaTab.appendChild(dv)
        h1.className="heading-2"
        h1.innerText = s.sefer;

        s.parshos.forEach(w => {
            var a = document.createElement("a");
            a.className = parshaClass;
            dv.appendChild(a);
            a.innerText = w.Transliteration;
            a.onclick = () => {
                whenClickedParsha(w.id);
            }
        });
    })
}

populateAllTabs();

function whenClickedParsha(parshaId) {
    var db = getFirestore();
    // Fetch the document from Firestore
   // Fetch the document from Firestore
    var q = query(
        collection(db, 'books', 'Likkutei Sichos', 'Sichos'),
        where('Parsha_id', '==', parshaId+"")
    );
    console.log("Checking",parshaId)

    
    getDocs(q)
    .then((querySnapshot) => {
        console.log("Hi there!",querySnapshot)
        var sz = querySnapshot.size;
        if(!sz) {
            alert("Sicha not found! Here's some default balak text")
        }

        var allDocs = []
        querySnapshot.forEach((doc) => {
            console.log("LOL!",doc)
        // Doc data
            var docData = doc.data();
            allDocs.push(docData)
        })
        
        console.log("Day",allDocs)
        showParshaList(allDocs);
    });
}

function showParshaList(parshaDataAll) {
    parshaTab.innerHTML = "";
    var backBtn = document.createElement("button");
    backBtn.innerText="Back"
    parshaTab.appendChild(backBtn);
    backBtn.onclick = () => {
        populateAllTabs();
    }

    var dv = makeParshaContainer();
    parshaTab.appendChild(dv);

    parshaDataAll.forEach(w=> {
        
        var a = document.createElement("a");
        a.innerText = w.Title;
        a.className="parsha-names w-button"
        dv.appendChild(a)
        a.href="./?page=viewer&sicha="+w.Sicha_num
        +"&volume="+w.Volume
        +"&parsha="+w.Parsha_id
    })
}

volumeBtn.onclick = () => {
    if(onParshaPage) {
        volumeTab.classList.add("w--tab-active");
        parshaTab.classList.remove("w--tab-active")
        onParshaPage = false;
        parshaBtn.classList.remove("w--current")
        volumeBtn.classList.add("w--current")
        updateGreenBar(100);
        parshaTxt.style.color=""
        volTxt.style.color="rgb(0,0,0)"
    } 
}

parshaBtn.onclick = () => {
    if(!onParshaPage) {
        onParshaPage = true;
        volumeTab.classList.remove("w--tab-active")
        parshaTab.classList.add("w--tab-active")
        
        volumeBtn.classList.remove("w--current")
        parshaBtn.classList.add("w--current")
        updateGreenBar(0)
        
        volTxt.style.color=""
        parshaTxt.style.color="rgb(0,0,0)"
    }
}

function updateGreenBar(val) {
    greenBar.style.transform = `translate3d(${
        val
    }%, 0px, 0px)`+
    ` scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) `+
    `rotateZ(0deg) skew(0deg, 0deg)`;
}