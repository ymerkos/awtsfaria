//B"H


//B"H
/*
await aiify({
    prompt: `B"H
 bearded rabbi wearing fur hat streimal with  cloaked face candlelit apartment at desk quickly turns around at the sound of knocking on his door, through window KGB agents can be seen outside in snowing leningrad.
Super hyper realistic cinematic hyper detailed. atoms ripping existence apart COMPLETELY revealing the hidden light within.
    `
})*/
function htmli(txt) {
    return (new DOMParser()).parseFromString(txt,"text/html")
}
var dp = new DOMParser()
function aiify({prompt,times,progress, download=false}={}) {
    return new Promise(async r => {
        
        var ok = null;
        var k = null;
        var myFetch = window?.awtsmoosFetch;
        if(!myFetch) {
            return alert("Need Awtsmoos server extension");
        }
        var base = "https://bing.com";
        async function hasTokens() {
            var y = await myFetch(base+"/images/create")
            var t = await y.text()
            var doc = htmli(t)
            var tokenBalElement = doc
                .getElementById('token_bal'); // Token balance element
            if(!tokenBalElement) {
                progress({message: "You're not logged in!!!"})
               // console.log(window.d=doc);
                return "no";
            }
            return tokenBalElement.innerText !== "0" 

        }
        if(typeof(progress) !="function"){
            progress=(s)=>{
             //   console.log("LOL",s)
            };
        }
        prompt = prompt.split("\n").join(" ")
        var txp = encodeURIComponent(prompt)
        var sq = new URLSearchParams({prompt, qs: "ds"})
        if(!times) times = 1;
        for(var i = 0; i < times; i++) {
            await once(prompt)
        }

        async function once(prompt) {
            var toyk = await hasTokens();
            if(toyk == "no") return;
            progress({message: "Submitting..."})
            ok=await myFetch(
                "https://www.bing.com/images/create?"+
                new URLSearchParams({
                    q: prompt,
                    rt: (toyk?"4":"3"),
                    FORM: "GENCRE",

                }), {
              "body": sq+"",
              "method": "POST",
            });

            k=await ok.text()
            var dc = htmli(k)
            var gr = dc.querySelector("#gir")
            progress({message: "Submitted! Checking progress..."})
            if(toyk) {
            //    console.log("Hi!",gr,dc)
                var url = null;
                try {
                    url=gr.dataset.c
                } catch(e){

                }
                if(!url) throw ("NOPE!")
                var pak = null;
                var h = null
                while(!h){
                  //  console.log("Loading pics...")
                    pak = await myFetch(base + url)
                    h = await pak.text()
                }
                await parseAndDownloadPics(h)

            } else {
                var m =(gr.dataset.mc)
     //           console.log("Checking at URL!",m);
                var pics = await checkIfDone(m)
                if(!pics) {
                    console.log("Problem");return;
                }
                var href = pics.href;
                var ur = new URL(href);
                var myURL = base +ur.pathname+"?"+ur.searchParams
                var r = await myFetch(myURL)
                var h = await r.text()
                await parseAndDownloadPics(h)
            //    console.log(m,pics)
            }
        }


        async function parseAndDownloadPics(h/*html txt of completed images page*/) {
            var dct = htmli(h)
            console.log("newDoc",dct,h)
            progress({message: "Pictures made. Downloading..."})
            var picis=Array.from(dct.querySelectorAll("a.iusc"))
                .map(w=>JSON.parse(w.getAttribute("m")))
                .map(w=>({title:w.Title, url:JSON.parse(w.CustomData).MediaUrl}));
            console.log("Got pics",picis)

            if(download) {
                await Promise.all(picis.map(async (w,i)=>{
                    var r = await fetch(w.url)
                    var b = await r.blob()
                    var a = document.createElement("a");
                    var url = URL.createObjectURL(b)
                    a.href=url;

                    a.download=sanitizeFilename(
                        "BH_"+i+"_"+w.title.split("").slice(0,37).join("")+".png"
                    )
                    a.click()
                }))
            }
            progress({message: "Done?!"})
            r(picis);
        }

        function sanitizeFilename(filename) {
            return filename.replace(/[^a-zA-Z0-9_$]/g, '');
        }

        async function checkIfDone(url, time=0) {
            var t = await myFetch(base+url)
            var r = await t.text()
            var doc = htmli(r);
            var s = doc.querySelector("a.seled")
            if(!s) {
                console.log("Issue!",doc,s,url)
                return null
            }
            var hasPics=s.dataset["imgcount"]
            if(time==0){
                console.log("GOT",s,hasPics)
            }
            if(hasPics == "0") {
                console.log("Not there, checking more... Time: ",time++)
                progress({
                    message: `Checking if done. Times checked: ${time}`
                })
                await wait(3);
                return await checkIfDone(url, time)
            } else {
                return s;
            }
        }

        function wait(scnd) {
            return new Promise((r) => {
                setTimeout(r, scnd*1000)
            });
        }
    })
}

export default aiify;
//Blessings and Success
