//B"H
/*
to be run on wikisource from computer to download entire Rambam to file system. Which can later be used to upload things to Awtsmoos
*/

//B"H
export default downloadRambamToFilesystem;
async function downloadRambamToFilesystem(maxPrakim=0) {
    var sefarimDone = 0;
    var halachosDone = 0;
    var prakimDone = 0;
    var ind = await getMainIndex()
    var newInd = Array.from(ind).map(w=>Object.assign({}, w));
   
    for(var sefer of newInd) {
        sefer.awtsmoos=Date.now();
        
        var info = await getSeferInfo(sefer.link)
        sefer.info = info;
        sefer.wow = info.length;
        for(var halacha of sefer.children) {
            
            
            var hal = await getPerek(halacha.link); 
            hal = Object.assign({}, hal);
            //halacha.info = hal;
            console.log(hal, "HAL");
            halacha.wow = "CANT BELIEVE";
            halacha.content = hal;
           var main = "דפוס";
           var regularChapterLike = hal[main];
            if(!regularChapterLike) {
                var section = hal[0]?.connections;
                if(section) {
            
                

                    var chaptersDoc = parseHTML(section)
                    var chapts = Array.from(
                        chaptersDoc.querySelectorAll("a")
                    );

                    hal.chapters = chapts.map(w=>({
                        header: w.textContent,
                        link: w.href
                    }))
                    console.log("Doing chapters",hal,chapts);
                    hal.chapts = "awts";
                    for(var perek of hal.chapters) {
                        var p = await getPerek(perek.link);
                        perek.content = Object.assign({},p);
                        prakimDone++;
                        if(maxPrakim && prakimDone >= maxPrakim) {

                        }
                    }
                } else {
                    console.log("NO chapters???",hal);
                }
            } else {
                console.log("NOT regular?",hal)
            }
            //halacha.content = Object.assign({},hal);
            console.log("ADDED",halacha);
               
            
            
         
        }

    }
    
    download("Rambam_"+Date.now()+".json",newInd);
    return newInd
}

async function download(nm, obj) {
    var str = JSON.stringify(obj);
    var a = document.createElement("a")
    a.href = URL.createObjectURL(new Blob([str]));
    a.download = nm;
    a.click()
}
//B"H

async function getPerek(url) {
    var doc = await getDoc(url)
    if(!doc) return null;
    //B"H

    var mainHeadings = Array.from(doc.querySelectorAll(".mw-heading.mw-heading2"));
    if(!mainHeadings.length) {
        mainHeadings = Array.from(doc.querySelectorAll(".mw-heading.mw-heading4"));
    }
    var subSections = Array.from(doc.querySelectorAll(".mw-heading.mw-heading3"))

    var mainParent = doc.querySelector("#mw-content-text > div.mw-content-rtl.mw-parser-output")
    var allChildren = Array.from(mainParent.children)
        .map((w,i) => w)
    var headingIndecies = mainHeadings.map(w=>[w,allChildren.indexOf(w)])
    var halachaIndecies = subSections.map(w=>[w,allChildren.indexOf(w)]);

    var sortedSections = []
    var start = headingIndecies?.[0]?.[1] || 0;
    var curSection = null;
    var curChildHeader = null;
    var curChildSection = null;
    var regular = !!subSections.length;
    var connections = allChildren[4]?.innerHTML;
    if(connections)
        sortedSections.push({
            connections
        })
    for(
        var i = start;
        i < allChildren.length;
        i++
    ) {
        var cur = allChildren[i];
        var hidx = mainHeadings.indexOf(cur);
        if(hidx > -1) {
            curSection = {
                name: cur.textContent.replace("[עריכה]",""),
                children: []
            }
            sortedSections.push(curSection)
            //console.log("did it",cur,curSection,i)
        }
        if(curSection) {
            if(regular) {
               if(hidx != -1) {
                //    console.log("skip",cur, hidx);
                    continue;
               }
            }
            if(cur.classList.contains("mw-heading")) {
                curChildHeader = cur.textContent;
                curChildSection = {
                    header: curChildHeader.replace("[עריכה]",""),
                    children: []
                }
                curSection.children.push(curChildSection);
                //console.log("DID",i,allChildren,cur)
            } else if(curChildSection) {

                curChildSection.children.push(cur.innerHTML)
            } else {
               

               // console.log("NO child section?!",cur)
                
                if(!curChildSection) 
                    curChildSection = {
                        header: "extra",
                        children: []
                    }
                curChildSection.children.push(cur.innerHTML);
                sortedSections.push(curChildSection)
            }
            
        } else {
          // console.log("WHAT",i,cur)
        }
    }

    if(!regular) {

        sortedSections = sortedSections.map(
            q=> q.children && q.children.length == 1 ?
             q.children[0] : q
        )
    }
    return sortedSections;

}


async function getHalachaPage(url) {
    var d = await getDoc(url)
    if(!d) return null;
    return getSeferInfo(url)
}

async function getSeferInfo(seferLink) {
    var d = await getDoc(seferLink)
    if(!d) return null;
    var cn = d.querySelectorAll("center")?.[2];
    if(!cn) return null;
    return cn.innerHTML;
}

async function getMainIndex() {
    var mainPage = await getDoc("https://he.wikisource.org/wiki/%D7%9E%D7%A9%D7%A0%D7%94_%D7%AA%D7%95%D7%A8%D7%94_%D7%9C%D7%A8%D7%9E%D7%91%22%D7%9D")

    var mainContent = mainPage.querySelector("#mw-content-text")
    if(!mainContent) return null;
    var index = Array.from(mainContent.querySelector("ul")?.children)
    return index.map(w => ({
        ...(h => ({
            header: h?.innerText,
            link: h?.href
        }))(w.querySelector("b a")),
        children: Array.from(w.children)
            .filter(w=>w.tagName != "B")
            .map(r=>({
                header: r.textContent,
                link: r.href
            }))
    }));
}

function parseHTML(txt) {
    try {
        var dp = new DOMParser()
        return dp.parseFromString(txt, "text/html")
    } catch(e) {
        console.log(e);
        return null;
    }
}

async function getDoc(url) {
    try {
        var txt = await (await fetch(url)).text()
        return parseHTML(txt);
    } catch(e) {
        console.log(e)
        return null;
    }
}

function downloadToichenPage() {
    //B"H
    var d = document.querySelector(".mw-content-rtl.mw-parser-output")
    m=document.querySelectorAll(".mw-editsection").forEach(w=>w.parentNode.removeChild(w));
    k=Array.from(d.children).slice(3).map(w=>w.innerHTML);
    function downloadFile(nm, json) {
            var b = new Blob([`${JSON.stringify(json,null,"\t")}`], {
                type: "application/json"
            });
            var u = URL.createObjectURL(b);
            var a = document.createElement("a")
            a.href=u;
            a.download=(nm || "BH_"+Date.now()) + ".js";
            a.click();
        }
    downloadFile("BH_lsitingOfMitzvosRambam.json",k);
}
