//B"H
console.log("B\"H")
async function downloadAllTenach() {
  var t = document.querySelector("table")
  TanachRows = Array.from(t.rows).slice(1, 4);
  var subTables = TanachRows.map(w => w.querySelector("table"))
  var categories = subTables.map(q => ({
    title: q.rows[0].textContent.trim(),
    books: Array.from(q.rows).slice(1).map(
      q =>
      Array.from(q.querySelectorAll("a")).filter(w => w.parentNode.tagName != "B")
    ).flat()

  }));


  for (var i = 0; i < categories.length; i++) {
    /*
    	get chapter index of each bok

    */
    var cat = categories[i];
    for (var y = 0; y < cat.books.length; y++) {
      var index = await getBookChaptersIndex(cat.books[y].href)

      /**
      	get index of verses in each chapter now
      **/
      for (var z = 0; z < index.length; z++) {

        var versesIndex = await getChapterSectionsIndex(index[z].href)
        index[z] = {
          link: aToObj(index[z]),
          sections: versesIndex.map(r => aToObj(r))
        }
      }


      cat.books[y] = {
        link: aToObj(cat.books[y]),

        content: index
      }
    }



  }
  return categories

}

function aToObj(a) {
  return {
    title: a.textContent,
    href: a.href
  }
}
async function getBookChaptersIndex(url) {
  var d = await doc(url);
  try {
    //B"H
    var f = d.getElementById("mw-content-text")
    var center = f.querySelector("center")
    var a = Array.from(center.querySelectorAll("a"))
    return a;
  } catch (e) {
    console.log("Issue", e, url)
    return null;
  }
}

async function getChapterSectionsIndex(url) {
  var d = await doc(url);
  try {
    //B"H
    var f = document.getElementById("mw-content-text")
    var navA = Array.from(f.querySelectorAll(".NavFrame a.mw-redirect"))

    var a = Array.from(f.querySelectorAll("a.mw-redirect"))
      .filter(w =>
        !navA.includes(w) &&
        w.parentNode.tagName == "SPAN"
      )
    return a;
  } catch (e) {
    console.log("There was an issue!", e)
    return null;
  }
}

async function doc(url) {
  var dp = new DOMParser();

  try {
    var p = await fetch(url)
    var txt = await p.text()
    var d = dp.parseFromString(txt, "text/html");
    return d;
  } catch (e) {
    return null;
  }
}

function downloadJSON(json, nm) {
  var a = document.createElement("a")
  a.href = URL.createObjectURL(
    new Blob([
      JSON.stringify(json, null, "\t")
    ], {
      type: "application/json"
    })
  );

  a.download = (
    nm || "BH_" + Date.now()
  ) + ".json";

  a.click()

}



/*

g = await getChapterSectionsIndex("https://he.wikisource.org/wiki/%D7%91%D7%A8%D7%90%D7%A9%D7%99%D7%AA_%D7%90")
*/


g = await downloadAllTenach()
downloadJSON(g)
g;