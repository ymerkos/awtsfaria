//B"H
/**
chabad library parser

start https://chabadlibrary.org/books/admur/index.htm for now
**/


async function parseRebbe(
    startBook=0,
    startSub=0,
    startSubSub=0
) {
    var books = {};
    var lnk = Array.from(document.querySelectorAll("a.toc"));
    var mn/*main*/=await getDir();
    var dir = await mkdir("books",mn);
    console.log("got main");
    var i;
    for(
        i=startBook;
        i<lnk.length;
        i++
    ) {
        var sub = await getSubSection(
            lnk[i],dir,startSub,startSubSub
        );
        books[lnk[i].textContent]=sub;
    }
    return books;
}

async function getSubSection(a,dir,st=0,sts=0) {
    var data = {};
    var g = await getDoc(a.href)
    var subLinks = Array.from(g.querySelectorAll("a.toc"));
    var sub = await mkdir(
        rn(a.textContent), dir
    );

    console.log("got sub sec",a.textContent);
    var i;
    for(
        i=st;
        i<subLinks.length;
        i++
    ) {
        var subSub = await getSubSubSection(
            subLinks[i], sub, sts
        );
        data[a.textContent]=subSub
    }
}

async function getSubSubSection(f, dr, subsub=0) {
    var pages = {};
    var d = await getDoc(f.href);
    var a = Array.from(d.querySelectorAll("a.toc"));
    var sub = await mkdir(
        rn(f.textContent),
        dr
    );
    console.log("got sub sub sec",f.textContent);
    var i;
    for(
        i=subsub;
        i<a.length;
        i++
    ) {
        var page = await parsePage(
            a[i], sub
        );
        pages[f.textContent]=page;
    }
}

async function parsePage(a, dir) {
    var d = await getDoc(a.href);
    var inner = d.getElementById("inner-content");
    if(inner) {
        var c = pageToJsonAwtsmoosed(inner);
        var f= await mkfl(
            rn(a.textContent)+".json",
            dir,
            JSON.stringify(c)
        );
        console.log("writing",a.textContent);
        return c;
    }

    return null;
}

function pageToJsonAwtsmoosed(ic/*innerContent*/) {
    var info = {}
    var pages = {};
    info.pages=pages;
    var curPage = null;
    Array.from(ic.children).forEach(q=>{
        if(
            q.className == "pagenumber" ||
            q.className == "pageno"
        ) {
            curPage = q.textContent;
            pages[curPage] = [];
            return;
        }

        if(curPage === null) return;

        if(q.nodeName == "P")
            pages[curPage].push(q.outerHTML);
    });
    var footes = Array.from(ic.querySelectorAll("p.ftntext"));
    footes.forEach(w=>{
        if(!info.footnotes) {
            info.footnotes = {};
        }

        var a = w.children[0];
        if(a) {
            var nm = a.name;
            if(nm) {
                var num = nm.substring(5);
                if(num != nm) {
                    info.footnotes[num] = a.innerHTML;
                }
            }
        }
    });

    return info;
}

var rnd = 0;
function rn/*rename better*/(t) {
    if(t && typeof(t) == "string")
        return t.split(" ")
        .join("_")
        .split('"')
        .join("-");
    return "BH_"+Date.now()+"_"+(rnd++);
}

async function getDoc(href) {
    var p = new DOMParser();
    var g = await fetch(href);
    var t = await g.text()
    var s = p.parseFromString(t,"text/html")
    return s;
}

async function getDir() {
    return await showDirectoryPicker();
}

async function mkdir(nm, dir) {
    return await dir.getDirectoryHandle(nm, {
        create:true
    });
}


/**
 * 
 * @param {String} nm
 *  the name of the file to make 
 * @param {DirectorySystemHandle} dir
 * the parent dir 
 * @param {String} txt
 * content 
 * @returns FileSystemHandle 
 */
async function mkfl(nm, dir, txt) {
    var fh = await dir.getFileHandle(nm, {
        create:true
    });
    var w = await fh.createWritable();
    console.log("About to write to",nm,txt,w)
    await w.write(txt);
    await w.close();
    return fh;
}

books = await parseRebbe();