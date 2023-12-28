//B"H

import parshaList from "../parshaList.js";

var parser = new DOMParser();
    console.log(window.parshaList=parshaList)
    var values = {
        Parsha_id: (el) => {
            parshaList.forEach(s=> {
                s.parshos.forEach(w => {
                 //   console.log(w,w.id,w.Transliteration)
                    var op = document.createElement("option")
                    op.value = w.id;
                    op.innerHTML = w.Transliteration;
                    el.appendChild(op)
                })
                
            });
        },
        Sicha_num: el => {
            Array.from({length:6}).fill(1).forEach((_,w)=> {
                var op = document.createElement("option")
                op.value = w+1;
                op.innerHTML = w+1;
                el.appendChild(op)
            });
        },
        Volume: el => {
            Array.from({length:40}).fill(1).forEach((_,w)=> {
                var op = document.createElement("option")
                op.value = w+1
                op.innerHTML = w+1;
                el.appendChild(op)
            });
        }
    }
    function populateInputs() {
        Object.keys(values)
        .forEach(q=> {
            values[q](document.getElementById(q))
        })
    }
    populateInputs()
    // Import the functions you need from the SDKs you need
    import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
        import {
             getFirestore, 
             doc, 
             setDoc, 
			 query,
			 deleteDoc,
			 where,
			 getDocs,
             getDoc,
             addDoc,
             collection
        } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

        import { getAuth, 
            createUserWithEmailAndPassword ,
            signInWithEmailAndPassword,
            GoogleAuthProvider,
            signInWithPopup,
            onAuthStateChanged ,
            signOut
        } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

        var firebaseConfig = {
            apiKey: "AIzaSyCpzvN9j3IWAbPQeoz3Vs4H7Tqb7bhWQEY",
            authDomain: "awtsfaria.firebaseapp.com",
            projectId: "awtsfaria",
            storageBucket: "awtsfaria.appspot.com",
            messagingSenderId: "987507227434",
            appId: "1:987507227434:web:35506a791aa36ac38cbc53"
        };

        
        // Initialize Firebase
        var app = initializeApp(firebaseConfig);
        var auth = getAuth();
        var db = getFirestore();
        var form = document.getElementById('uploadForm');
        


        Main_text.onclick = async () => {
            var clp = await readClipboardHtml()
            var dc = parser.parseFromString(clp,"text/html")
            console.log(window.h=dc)
            var parsedTxt = parseHTMLFile(clp)
            Main_text.value = parsedTxt;
        }

        var ftnDiv =  document.getElementById('Footnotes');
        ftnDiv.onclick = async () => {
            var clp = await readClipboardHtml();
            var parsedTxt = parseHTMLFile(clp)
            ftnDiv.value = parsedTxt;
        }
		
		fullTexter.onclick = async () => {
			var clp = await readClipboardHtml()
            var dc = parser.parseFromString(clp,"text/html")
            console.log(window.h=dc)
			
			var mainElements = [];
			var footnoteElements = [];
			var titleAwts = "";
			var h1 = dc.body.querySelector("h1");
			if(h1) {
				titleAwts = h1.innerText;
				var newH1 = document.createElement("h1")
				newH1.innerText=h1.innerText;
				mainElements.push(newH1)
			}
			Array.from(dc.body.querySelectorAll("p")).forEach(q=> {
				
				var ch = q.children[0];
				if(ch.tagName != "SPAN")
					return;
				var cm = ch.style["font-size"]
				if(cm == "10pt") {
					footnoteElements.push(q);
				} else {
					mainElements.push(q)
				}
			});
			
			var mainTxt = parseHTMLFile(
				mainElements.map(w=>w.outerHTML).join("")
			);
			
			if(mainTxt)
				Main_text.value = mainTxt
			
			var footnoteTxt = parseHTMLFile(
				footnoteElements.map(f=>f.outerHTML).join("")
			);
			
			if(footnoteTxt)
				ftnDiv.value = footnoteTxt
			
			if(titleAwts) {
				AwtsTitle.value = titleAwts;
			}
		}
        
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            var Footnotes = document.getElementById('Footnotes').value;
            var Main_text = document.getElementById('Main_text').value;
            var Parsha_id = document.getElementById('Parsha_id').value;
            var Sicha_num = document.getElementById('Sicha_num').value;
            var Volume = document.getElementById('Volume').value;
            
            var awtsmoosTitle = document.getElementById("AwtsTitle").value;
            
						
						
			var docData = {
			  Footnotes,
			  Main_text,
			  Parsha_id,
			  Sicha_num,
			  Volume,
			  Title: awtsmoosTitle
			};

			// Reference to the Sichos subcollection
			var sichosRef = collection(db, "books", "Likkutei Sichos", "Sichos");

			try {
			  // Create a query with all conditions
			  var q = query(sichosRef, 
				where("Parsha_id", "==", Parsha_id),
				where("Sicha_num", "==", Sicha_num),
				where("Volume", "==", Volume),
				where("Title", "==", awtsmoosTitle)
			  );

			  // Get the documents matching the query
			  var querySnapshot = await getDocs(q);

			  // Delete the documents found
			  for (var doc of querySnapshot.docs) {
				await deleteDoc(doc.ref);
			  }

			  // Add the new document
			  var docRef = await addDoc(sichosRef, docData);
			  alert("Document written with ID: " + docRef.id);
			} catch (e) {
			  alert("Error adding document: " + e);
			}
        });
        
         // Set initial status
        document.addEventListener("DOMContentLoaded", () => {
          
          
          onAuthStateChanged(auth, async (user) => {
              console.log("Signed in",user)
              if (user) {
                 
              } else {
                  alert("You're not signed in!");
              }
          });
      });


      /*
      var dropZone = document.getElementById('drop_zone');

        dropZone.addEventListener('dragover', function(e) {
            e.stopPropagation();
            e.preventDefault();
            e.dataTransfer.dropEffect = 'copy';
        });

        dropZone.addEventListener('drop', function(e) {
            e.stopPropagation();
            e.preventDefault();
            var files = e.dataTransfer.files;

            for (let i = 0; i < files.length; i++) {
            var file = files[i];
            if (file.type === 'text/html') {
                parseHTMLFile(file);
            }
            }
        });*/


		
        function parseHTMLFile(text) {
                
            var doc = parser.parseFromString(text, 'text/html');
            console.log(
                "parsing", doc
            )
            var bodyContent = doc.body;
            var mainText = '';



            bodyContent.querySelectorAll('*').forEach(function(el) {
                if(el.tagName == "P") {
                    var mainP = document.createElement("p");
                    var dir = el.getAttribute("dir")
                    mainP.setAttribute("dir",dir)
                    Array.from(el.children)
                    .forEach(w=> {

                        if(w.children[0]) {
                            
                            if(w.children[0].tagName == "SPAN") {
                                
                                var sp = document.createElement("sup");
                                sp.innerText = w.children[0].innerText;
                                mainP.innerHTML += sp.outerHTML;
                            } else if(w.children[0].tagName == "BR") {
                                mainP.innerHTML += "<br>"
                            }
                        } else {
                            var isBold = w.style["font-weight"] == "700"
                            mainP.innerHTML += (isBold?"<b>":"")+w.innerHTML
                            +(isBold?"</b>":"")
                        }
                    });
                    mainText += mainP.outerHTML
                } else if(el.tagName=="H1"){
                    var h1  =document.createElement("h1");
                    h1.innerText = el.innerText;
                    mainText+=h1.outerHTML
                } 
                
            });
            return mainText;
        };




        async function readClipboardHtml() {
            try {
              // Check if the Clipboard API is available
              if (!navigator.clipboard) {
                console.error('Clipboard API not available');
                return;
              }
          
              // Request permission to read from the clipboard
              var permissionStatus = await navigator.permissions.query({ name: 'clipboard-read' });
          
              // Check if permission is granted
              if (permissionStatus.state === 'granted' || permissionStatus.state === 'prompt') {
                // Read from the clipboard
                var clipboardItems = await navigator.clipboard.read();
          
                for (var clipboardItem of clipboardItems) {
                  for (var type of clipboardItem.types) {
                    if (type === 'text/html') {
                      // Get the clipboard item as a Blob
                      var blob = await clipboardItem.getType(type);
                      // Read the Blob as text
                      var html = await blob.text();
                      return html; // Contains the HTML from the clipboard
                    }
                  }
                }
              } else {
                console.error('Clipboard permissions denied');
              }
            } catch (err) {
              console.error('Failed to read clipboard contents: ', err);
            }
          }

          window.readClipboardHtml=readClipboardHtml