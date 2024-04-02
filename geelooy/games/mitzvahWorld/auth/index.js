/**B"H
 * 
 * firebase auth rules
 */

import config from "./config.js";
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.0/firebase-app.js';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'https://www.gstatic.com/firebasejs/9.6.0/firebase-auth.js';
import { 
    getFirestore, 
    doc, 
    setDoc, 
    getDoc,
    updateDoc,
    collection
 } from 'https://www.gstatic.com/firebasejs/9.6.0/firebase-firestore.js';


const app = initializeApp(config);
const auth = getAuth(app);
const db = getFirestore(app);

export default {
    signInWithGoogle,
    readFromFirestore,
    writeToFirestore,
    db,
    app,
    collection,
    setDoc,
    getDoc,
    doc,
    updateDoc,
    auth,
    startAll,
    updateProgress
}

window.db=db;
window.app=app;
window.doc=doc;
window.setDoc=setDoc;
window.getDoc=getDoc;
window.collection=collection;
window.writeToFirestore=writeToFirestore
window.readFromFirestore=readFromFirestore;
var dt = new Date()
var pageLoad = dt.toISOString()+"";

function updateProgress(data) {
    return new Promise((r,j) => {
        var myName = localStorage.getItem("name");
        var session = localStorage.getItem("sessionId")
        
        writeToFirestore(
            "names", 
            "sessions", 
            session, 
            myName,
            "pageLoads",
            pageLoad,
            data
        ).then(rs=>{
            
         //   console.log("Wrote!",rs);
            r({
                name: myName,
                sessionId: session,
                data
            })
        }).catch(e => {
            console.log("No")
            j(e)
        })
    })
    
}

function startAll() {
    var myName = localStorage.getItem("name");
    var session = localStorage.getItem("sessionId")
    if(!myName || !session) {
        var name = prompt("What is your (nick) name?");
        if(name) {
            alert("Great! Enjoy");
            var sessionId = "BH_"+Date.now()+"_session"
            writeToFirestore("names", "sessions", sessionId, name, {
                sessionId,
                name
            }).then(r=>{
                localStorage.setItem("name", name);
                localStorage.setItem("sessionId", sessionId);
                console.log("Wrote!",r)
            }).catch(e => {
                console.log("No")
            })
        }
    }
}
// Google Sign-in
async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    console.log("Logged in as:", user.displayName);
  } catch (error) {
    console.error("Google Sign-in Error:", error);
  }
}


// Firestore database operations
async function writeToFirestore(...pathSegments) {
    try {
      var seg = pathSegments.slice(0, pathSegments.length-1)
      var data = pathSegments[pathSegments.length - 1];
      const docRef = doc(db, ...seg);
      
      if ((await getDoc(docRef)).exists()) {
     //   console.log("Document exists, updating:", seg, data);
        // Update data in Firestore
        await updateDoc(docRef, data);
      //  console.log("Document updated successfully!");
      } else {
    //    console.log("Document doesn't exist, creating:", seg, data);
        // Create new document in Firestore
        await setDoc(docRef, data);
   //     console.log("Document created successfully!");
      }
    } catch (error) {
      console.error("Error writing document:", error);
    }
}
  
  async function readFromFirestore(collectionPath, documentPath) {
    try {
      const docSnap = await getDoc(doc(db, collectionPath, documentPath));
      if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error reading document:", error);
    }
  }