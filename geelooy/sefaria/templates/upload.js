//B"H

import parshaList from "../parshaList.js";
    console.log(window.parshaList=parshaList)
    var values = {
        Parsha_id: (el) => {
            parshaList.forEach(w=> {
                console.log(w,w.id,w.Transliteration)
                var op = document.createElement("option")
                op.value = w.id;
                op.innerHTML = w.Transliteration;
                el.appendChild(op)
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

        const firebaseConfig = {
            apiKey: "AIzaSyCpzvN9j3IWAbPQeoz3Vs4H7Tqb7bhWQEY",
            authDomain: "awtsfaria.firebaseapp.com",
            projectId: "awtsfaria",
            storageBucket: "awtsfaria.appspot.com",
            messagingSenderId: "987507227434",
            appId: "1:987507227434:web:35506a791aa36ac38cbc53"
        };

        const docData = {
            Footnotes:"ASD",
            Main_text:"asdgd",
            Parsha_id:"389uqu ",
            Sicha_num:4,
            Volume:8
        };
        
        // Initialize Firebase
        const app = initializeApp(firebaseConfig);
        const auth = getAuth();
        const db = getFirestore();
        const form = document.getElementById('uploadForm');
        async function test() {
            return;
            try {
                const docRef = await 
                addDoc(
                    collection(
                        db, 
                        "books", 
                        "Likkutei Sichos", 
                        "Sichos"
                    ), docData
                );
            } catch(e) {
                alert(e+"")
            }
        }


        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const Footnotes = document.getElementById('Footnotes').value;
            const Main_text = document.getElementById('Main_text').value;
            const Parsha_id = document.getElementById('Parsha_id').value;
            const Sicha_num = document.getElementById('Sicha_num').value;
            const Volume = document.getElementById('Volume').value;
            
            var awtsmoosTitle = docment.getElementById("AwtsTitle").value;
            const docData = {
                Footnotes,
                Main_text,
                Parsha_id,
                Sicha_num,
                Volume,
                awtsmoosTitle
            };

            try {
            const docRef = await addDoc(collection(db, "books", "Likkutei Sichos", "Sichos"), docData);
                alert("Document written with ID: "+ docRef.id);
            } catch (e) {
              alert("Error adding document: " + e+"");
            }
        });
        
         // Set initial status
        document.addEventListener("DOMContentLoaded", () => {
          
          
          onAuthStateChanged(auth, async (user) => {
              console.log("Signed in",user)
              if (user) {
                 await test();
              } else {
                  alert("You're not signed in!");
              }
          });
      });


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
        });



        function parseHTMLFile(file) {
                
        var reader = new FileReader();
        reader.onload = function(e) {
            var text = e.target.result;
            var parser = new DOMParser();
            var doc = parser.parseFromString(text, 'text/html');

            var bodyContent = doc.body;
            var mainText = '';
            var footnotes = '';

            bodyContent.querySelectorAll('*').forEach(function(el) {
            let tag = el.tagName;
            let classes = el.className ? ' class="' + el.className + '"' : '';
            let dirAttr = el.getAttribute("dir") === "rtl" ? ' dir="rtl"' : '';
            
            if (tag === 'H1') {
                mainText += `<h1>${el.textContent}</h1> `;
            } else if (tag === 'P') {
                var c = el.children[0]
                let innerContent = c.innerHTML;

                let tagWithAttributes = `<${tag.toLowerCase()}>`;
                if (el.className === 'p2') {
                mainText += `${tagWithAttributes}${innerContent}</${tag.toLowerCase()}> `;
                } else if (el.className === 'p3') {
                footnotes += `${tagWithAttributes}${innerContent}</${tag.toLowerCase()}> `;
                }
            }
            });
            Main_text.value=mainText;
            Footnotes.value=footnotes
            // Here you would typically send 'mainText' and 'footnotes' to Firestore
            console.log('Main Text:', mainText);
            console.log('Footnotes:', footnotes);
        };

        reader.readAsText(file);
        }
