/**B"H
 * 
 * to be called on chabadlibrary at the
 * index level of a volume (with pages in front of u)
 * like https://chabadlibrary.org/books/300010001
 */

//B"H
var temp = `https://chabadlibrary.org/books/api/main?id=`
async function downloadKeserShemtovVolume(url) {
    var id = url.split("/").splice(-1)[0]
    console.log(id)
    var doc = await gd(temp+id, "json")
    
    var pages = []
    console.log("Doing",url,doc)
    for(var c of doc.children) {
        
        var cid = c.id
        var hd = c.heading;
        var d = await gd(temp+cid,"json")
        var page = d.page.text;
        var notes = d.page.haoros;
        var ob = {
            name: hd,
            text: page,
            notes
        }
        pages.push(ob)
        console.log("Child",c,cid,d,ob)
        
    }
    return pages;
}

async function getPageContent(url) {
    var doc = await gd(url)
    //B"H
    var p = Array.from(doc.querySelectorAll(".page > div")).map(w => Array.from(w.childNodes).map(w=>w.outerHTML || w.textContent))

}

async function gd(url,type) {
    var r = await fetch(url)
    if(type == "json") {
        var j = await r.json()
        return j
    }
    var t = await r.text()
    var dp = new DOMParser()
    var doc = dp.parseFromString(t,"text/html")
    return doc;
}

g=await downloadKeserShemtovVolume(location.href)