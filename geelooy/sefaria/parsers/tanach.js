/**B"H 
 * 
 * to be run in console
 * from https://he.wikisource.org/wiki/%D7%9E%D7%A7%D7%A8%D7%90
*/

//B"H
async function getAllTenach() {
    var dr = await showDirectoryPicker();
    f = await getSubSections(dr);
    return f;
}

async function getSectionsOfPageIntoJS(dr) {
    var mtc= document.getElementById("mw-content-text")
    if(!mtc) return alert("Not found");
    var mainTable = mtc.querySelector("table");
    var subTables = mainTable.getElementsByTagName("table");
    var s = [...subTables].slice(1,4);
    var mapped = s.map(w => ({
        mainSection: w.rows[0].innerText,
        subSections: Array.from(w.rows)
            .slice(1,w.rows.length)
            .map(r => 
                            (r => r.length?r:null)(Array.from(r.getElementsByTagName("a")).filter(a=>
                                
                      a.title != "קטגוריה:תרי עשר"                                                                          )
            ))
            .filter(a => a)
            .flat()

        
    }));
    return mapped;
}

async function getSubSections(dr) {
    var s = await getSectionsOfPageIntoJS(dr);
    var pr = new DOMParser();
    console.log(s,222)
    for(var k = 0; k < s.length; k++) {
        var ms = await dr.getDirectoryHandle(s[k].mainSection, {
         create:true   
        })
        for(var y = 0; y < s[k].subSections.length; y++) {
            var sec = s[k].subSections[y];
            var ssb = await ms.getDirectoryHandle(
                y+"_"+sec.textContent, {
                    create: true
                }
            )
            var href = await fetch(sec.href);
            var txt = await href.text();
            var doc = pr.parseFromString(txt, "text/html");
            var eb = await getEntireBook(doc);
            s[k].subSections[y] = eb?
                {chapters:
                    eb.map(r=>({link:r.href,text:r.textContent})),
                 name: {
                    text: sec.textContent,
                     link:sec.href
                 }
                }:null;
            if(s[k] && s[k].subSections[k] &&
               s[k].subSections[k].chapters)
            for(
                var w = 0; 
                w < s[k].subSections[k].chapters.length;
                w++ 
            ) {
                var ch = s[k].subSections[k].chapters[w];
                var cdr = await ssb.getDirectoryHandle(
                    w+"_"+ch.text, {
                        create: true
                    }
                )
                var pg = await fetch(ch.link)
                var tx = await pg.text();
                var doc = pr.parseFromString(tx, "text/html")
                var psu = await parsePesukim(doc);
                ch.pesukim = psu;
                for(var j =0;j<psu.length;j++) {
                    var fg = psu[j];
                    var psd = await cdr.getDirectoryHandle(
                        j+"_"+fg.id, {create:true}
                    )
                    var f = await psd.getFileHandle(
                        "verse.txt", {create:true}
                    );
                    var wr = await f.createWritable();
                    await wr.write(fg.text);
                    await wr.close()
                }
            }
        }
    }
    return s;
}
//B"H

async function getEntireBook(doc) {
 
    var mct = doc.getElementById("mw-content-text")
    if(!mct) return alert("LOL");
    var chapterContainer = mct.getElementsByTagName("center")[0]
    if(!chapterContainer) return "NOPE!";
    var p = chapterContainer.getElementsByTagName("p")[0];
    if(!p) return alert("Wow");
    var lnks = Array.from(p.getElementsByTagName("a"))
    return lnks;
}

//B"H
function parsePesukim(doc) {
    var mtc = doc.getElementById("mw-content-text");
    if(!mtc) return alert("asd");
    var dv = Array.from(mtc.querySelectorAll("div"))
        .find(q=>q&&q.lang=="hbo")
    if(!dv) {
        return alert("Not ");
    }
    var p = dv.getElementsByTagName("p")[0];

    var pesukim = [];
    var currentTexts = [];
    var lastID = null;
    for(var i = 0; i < p.childNodes.length; i++) {
        var c = p.childNodes[i];
        if(c.id) {
            if(lastID) {
                pesukim.push({id:lastID,text: 
                    currentTexts
                    .map(w=> 
                        w.innerHTML ||
                        w.textContent
                    )
                    
                    .join("")
                    .split("\n")
                    .join("")
                })
                currentTexts = [];
            }
            lastID = c.id;
            
        } else if(
                c.tagName == "BIG" ||
                c.nodeName == "#text"
            ) {
                currentTexts.push(c)
            
        }
        
    }
    return pesukim;
}

