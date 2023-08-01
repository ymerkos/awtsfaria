//B"H

var totalPages = {};
function formatPage(doc) {
    var c = (doc || document).getElementById("TorahTextsContentContainer");
    var c = Array.from(c.children[0].children[1].children)
    var m = c.map(q=>(
        {

            text:q.textContent,
            children:Array.from(q.children).map(w=>({
                className:w.className,
                                                text:w.textContent
            }))
        }))

    var pr = m.map(w=>({
        info: w.children.map(c=>({
            text: c.className.includes("book-promo")?"":c.text,
            type: c.className.includes("verse__commentary ng-tns-c118-125 last-commentary ng-star-inserted") ? "Tosafos" : c.className == "verse__commentary ng-tns-c118-124 ng-star-inserted" ? "Rashi"  : c.className == "verse-wrapper__hebrew ng-tns-c120-38 ng-star-inserted" ? "Gemara Hebrew" : c.className == "verse-wrapper__native ng-tns-c120-38 ng-star-inserted" ? "Gemara English" : "Other"
        }))
    })).map(w=>w.info.length?w.info:null).filter(w=>w);

    return pr;
}

async function getDafData(startIndex = 0) {
    var nav = await fetch(
        "https://www.chabad.org/api/v2/chabadorg/torahtexts/book-navigation/5299444"
    )
    var j = await nav.json();

    var talmuds = j.children;
    console.log("Got!",w=talmuds)

    var t;
    for(
        t = startIndex;
        t < talmuds.length;
        t++
    ) {
        var tractate = talmuds[t];
        if(!tractate) continue;
        
        var chapters = tractate.children;
        console.log("Chap",chapters)
        var i;
        for(
            i = 0;
            i < chapters.length;
            i++
        ) {
            var pages = chapters[i].children;
            var c;
            console.log("pages",pages)
            for(
                c = 0;
                c < pages.length;
                c++
            ) {
                var pg = pages[c];
                if(!pg) {
                    console.log("no page!",pg);
                    continue;
                }
                console.log("page",pages[c])
                var article = pg[
                    "article-id"
                ];
                var urlBase
                = 
                "https://www.chabad.org/api/v2/chabadorg/torahtexts/book-content/"

                var articleURL = urlBase + article;
                var dafName = pg[
                    "native-title-2"
                ].split(" ").join("_");

                var art = await fetch(articleURL);
                var js = await art.json();

                var v = js.verses;    
                
                console.log("verses",v)
                var newFil = await file.getFileHandle(
                    dafName+".json", {
                        create:true
                    }
                )
                var wr = await newFil.createWritable();
                await wr.write(JSON.stringify(
                    v
                ));
                await wr.close();
            }   
            
            



        }
    }
}

/*old*/async function getPage(url) {
    var prs = new DOMParser();
 
    
    var res = await fetch(url);
    var text = await res.text();
    
    var doc = prs.parseFromString(text,"text/html")
    var titleD = doc
    .getElementsByClassName
    ("header__title")[0];
    var title = "BH_" + url.split("/")
        .join("_")
        .split(":")
        .join("$")
        .split(".")
        .join("--")
        .split("?")
        .join("__");

    if(titleD) {
        title = titleD.textContent
            .trim()
            .split(" ")
            .join("_")
    }
    var formatted = formatPage(doc);
    totalPages[url] = formatted;

    var nextPageA = doc
    .getElementsByClassName("navigation-buttons__link navigation-buttons__link--next ng-star-inserted")[0]
    
    if(nextPageA) {
        var href = nextPageA.href;
        if(href) {
            await getPage(href);
        }
    }

}

var file = await showDirectoryPicker();
await getDafData(1);