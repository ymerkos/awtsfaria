//B"H
//B"H  
var parshiosNames = {
    Bereishis: [
		{ english: "Bereishis", hebrew: "בראשית" },
		{ english: "Noach", hebrew: "נֹחַ" },
		{ english: "Lech Lecha", hebrew: "לך לך" },
		{ english: "Vayeira", hebrew: "וַיֵּרָא" },
		{ english: "Chayei Sarah", hebrew: "חַיֵּי שָׂרָה" },
		{ english: "Toldos", hebrew: "תּוֹלְדוֹת" },
		{ english: "Vayeitzei", hebrew: "וַיֵּצֵא" },
		{ english: "Vayishlach", hebrew: "וַיִּשְׁלַח" },
		{ english: "Vayeishev", hebrew: "וַיֵּשֶׁב" },
		{ english: "Miketz", hebrew: "מִקֵּץ" },
		{ english: "Vayigash", hebrew: "וַיִּגַּשׁ" },
		{ english: "Vayechi", hebrew: "וַיְחִי" },
	],
	Shemos: [
		{ english: "Shemos", hebrew: "שְׁמוֹת" },
		{ english: "Va'eira", hebrew: "וָאֵרָא" },
		{ english: "Bo", hebrew: "בֹּא" },
		{ english: "Beshalach", hebrew: "בְּשַׁלַּח" },
		{ english: "Yisro", hebrew: "יִתְרוֹ" },
		{ english: "Mishpatim", hebrew: "מִּשְׁפָּטִים" },
		{ english: "Terumah", hebrew: "תְּרוּמָה" },
		{ english: "Tetzaveh", hebrew: "תְּצַוֶּה" },
		{ english: "Ki Sisa", hebrew: "כִּי תִשָּׂא" },
		{ english: "Vayakhel", hebrew: "וַיַּקְהֵל" },
		{ english: "Pekudei", hebrew: "פְקוּדֵי" },
	],
	Vayikra: [
		{ english: "Vayikra", hebrew: "וַיִּקְרָא" },
		{ english: "Tzav", hebrew: "צַו" },
		{ english: "Shemini", hebrew: "שְּׁמִינִי" },
		{ english: "Tazria", hebrew: "תַזְרִיעַ" },
		{ english: "Metzora", hebrew: "מְּצֹרָע" },
		{ english: "Acharei Mos", hebrew: "אַחֲרֵי מוֹת" },
		{ english: "Kedoshim", hebrew: "קְדֹשִׁים" },
		{ english: "Emor", hebrew: "אֱמֹר" },
		{ english: "Behar", hebrew: "בְּהַר" },
		{ english: "Bechukosai", hebrew: "בְּחֻקֹּתַי" },
	],
	Bamidbar: [
		{ english: "Bamidbar", hebrew: "בְּמִדְבַּר" },
		{ english: "Nasso", hebrew: "נָשֹׂא" },
		{ english: "Beha'aloscha", hebrew: "בְּהַעֲלֹתְךָ" },
		{ english: "Sh'lach", hebrew: "שְׁלַח" },
		{ english: "Korach", hebrew: "קֹרַח" },
		{ english: "Chukas", hebrew: "חֻקַּת" },
		{ english: "Balak", hebrew: "בָּלָק" },
		{ english: "Pinchas", hebrew: "פִּינְחָס" },
		{ english: "Matos", hebrew: "מַּטּוֹת" },
		{ english: "Masei", hebrew: "מַּסְעֵי" }
	],
	Dvarim: [
		{ english: "Devarim", hebrew: "דְּבָרִים" },
		{ english: "Vaeschanan", hebrew: "וָאֶתְחַנַּן" },
		{ english: "Eikev", hebrew: "עֵקֶב" },
		{ english: "Re'eh", hebrew: "רְאֵה" },
		{ english: "Shoftim", hebrew: "שֹׁפְטִים" },
		{ english: "Ki Seitzei", hebrew: "כִּי תֵצֵא" },
		{ english: "Ki Savo", hebrew: "כִּי תָבוֹא" },
		{ english: "Nitzavim", hebrew: "נִצָּבִים" },
		{ english: "Vayeilech", hebrew: "וַיֵּלֶךְ" },
		{ english: "Ha'azinu", hebrew: "הַאֲזִינוּ" },
		{ english: "V'zos Habracha", hebrew: "וְזֹאת הַבְּרָכָה" }	
	]

}
function awtsmoosAliyaParse(source, bookName="Bereishis") {
    var d = Object.assign(source);
    const aliyahNames = [
       // "ראשון",
        "Rishon",
        "שני",
        "שלישי",
        "רביעי",
        "חמישי",
        "ששי",
        "שביעי",
        "מפטיר"
    ];
    var levi = "[לוי]";
    
    var curParsha = {name: "Bereishis", aliyos: []}
    var parshos = []
    var currentAliaName = "Rishon";
    var currentAliyaIndex = 0;
    var curAlia = {name: currentAliaName}
    var lastSection = null;
	var parshaIdx = 0;
    var lastParsha = null;
    var lastAliyah = null;
    var curAliasIdx = 0;
    var firstAliyaStart = null;
    var curData = {}
    
    d.forEach((w,idx, ar) => {
        w.postIdx = parseInt(w.postIdx)
        curData.end = Object.assign({},w);
        if(idx == 0) {
            curData.start = {postIdx:0,end:0}
        }
        var l = w.html;
        lastSection = w.end;
        var ind = aliyahNames.indexOf(l)
        
        if(ind > -1) {
           //if(currentAliaName != "Rishon")
            curParsha.aliyos.push({
                aliyahName: currentAliaName,
                data: curData
            });
            curAliasIdx++;
            lastAliyah = curParsha.aliyos[curParsha.aliyos.length-1]
            var pos = lastAliyah.data?.end;

            curData = {end:w}
            if(lastAliyah.aliyahName !="Rishon")
            if(pos) curData.start = Object.assign({},pos);
            currentAliaName = l;
        }
        
         if(currentAliyaIndex > -1) {
                if(
                    ind > currentAliyaIndex + 1
                    
                    

                ) {
                    if(lastAliyah) {
                        var pos = lastAliyah.data?.start
                        if(pos) {
                            var lastAliayhNm = lastAliyah.aliyahName
                            var lastIdx = aliyahNames
                                .indexOf(lastAliayhNm);
                           
                            if(ind == lastIdx + 2) {
                                if(lastAliyah.aliyahName !="Rishon"){
                                    curData.start=
                                        lastAliyah.data.end
                                    
                                    curData.start.section = 0;
                                    curData.LOL=2
                                }
                            }
                        }
                    } else {
                       curData.start={
                            postIdx: 0,
                            end: 0
                        }
                    }
                    //skipped
             ///       console.log("SKIPPED aliah",w)
                    curParsha.aliyos.push({
                        aliyahName: aliyahNames?.[ind - 1],
                        data: curData
                    })
                    curAliasIdx++;
                    var pos = lastAliyah.data?.end;

                    curData = {end:w}
                    if(pos) curData.start = Object.assign({},pos);
                    
                    lastAliyah = curParsha.aliyos[curParsha.aliyos.length-1]
                } else if(
                    ind < currentAliyaIndex -1 
                    
                    

                ) {
                    //skipped
                //    console.log("SKIPPED aliah something happpened",w)
                    
                    if(currentAliaName == "שביעי") {
                        /**
                            means we skipped something else but we 
                            need maftir...
                        **/
                        var sec = curData.end;
                        if(sec.html.includes("<b>")) {
                            var mafPos = Object.assign({},sec)
                            mafPos.section = 0;
                            curData.needMaftir=mafPos;
                            
                        }
                    }
                }
            } else {

                if(
                        //currentAliaName == "שלישי"
                    aliyahNames.includes(currentAliaName) &&
                    aliyahNames.includes(w.html) ||
                    w.html == "[לוי]"
                 ) {
                    var newIdx = aliyahNames.indexOf(w.html);
                    var previousAliyah = aliyahNames[newIdx - 1]
                    //curParsha.aliyos.push()
                    
                    if(w.html == levi) {
                        firstAliyaStart = Object.assign({},w);
                    }
                    if(w.html != levi) {
                        
                       // if(parshos.length > 0)
                            var la = Object.assign({},lastAliyah);
                            if(la && la.aliyahName == previousAliyah) {
                                lastAliyah
                                .firstAliyaStart=firstAliyaStart
                               
                                if(lastAliyah.aliyahName != "Rishon"){
                                    lastAliyah.data.start=
                                    lastAliyah.data.end
                                    lastAliyah.data.start.section=0;
                                }
                            
                            } else if(la) {
                                
                                if(lastAliyah.aliyahName=="Rishon") {
                                   
                                    lastAliyah
                                        .data
                                        .start = firstAliyaStart;
                                   var beforeLast = lastParsha?.aliyos[
                                        lastParsha?.aliyos.length-1
                                   ]
                                    
                                    var sec=beforeLast?.data?.end;
                                    if(sec?.html?.includes("<b>")){
                                        lastAliyah .data
                                        .start = sec
                                    } else {
                                    	lastAliyah.last=9
                                        lastAliyah .data
                                        .start.section=0;
                                    }
                                }
                                if(
                                    previousAliyah == "Rishon" &&
                                    curAliasIdx > 0
                                ) {
                                    curParsha.name = parshiosNames[bookName][parshaIdx]

                                    parshos.push(curParsha)
                                    parshaIdx++;
                                    curAliasIdx = 0;
                                    if(curParsha.aliyos.length < 7) {
                                       
                                    }
                                    
                                    addMissing(curParsha)
                                    
                                    curParsha = {name: "unknown", aliyos:[]}
                                    
                                    
                                   
                                }
                                if(previousAliyah=="Rishon" ){
                                    curData.start = Object
                                    .assign({},firstAliyaStart);
                                    curData.start.section=0;
                                }
                                 curData.awts=770
                                    
                                 curParsha.aliyos.push({
                                    aliyahName: previousAliyah,
                                    
                                    data: {
                                      start:curData.start,
                                        end:curData.end
                                    },
                                    
                                })
                                 return;
                            }
                    }
                    //var lastParsha = parshos[lastParshaIdx]
                  
                }
            }
        currentAliyaIndex = ind;

        if(l.indexOf("<b>") > -1) {
            
            curParsha.aliyos.push({
                aliyahName: currentAliaName,
                data: curData
            })
            curAliasIdx = 0;
            var moft = null;
            if(curData.needMaftir) {
                moft = curData.end;
                curParsha.aliyos.push({
                    aliyahName: "מפטיר",

                    data: {
                       start: Object.assign({},mafPos),
                        end: Object.assign({},curData.end)
                    }
                })
            }
            curData = {end:w}
            if(moft) {
                curData.start = Object.assign({}, moft)
                
            }
            lastAliyah = curParsha.aliyos[curParsha.aliyos.length-1]
            currentAliaName = "Rishon";
            curParsha.name = parshiosNames[bookName][parshaIdx]
            parshos.push(curParsha);
			parshaIdx++;
            lastParsha = parshos[parshos.length-1]
            curParsha = {name: l, aliyos: []}
            
            curParsha.name = parshiosNames[bookName][parshaIdx]
        }
        if(idx == ar.length-1)
            curParsha.aliyos.push({
                aliyahName:currentAliaName,
                data:curData
            })
        
    });
    
    parshos.push(curParsha)



    
    parshos.forEach((par,pid,parshaAr) => {
        
        par.aliyos.forEach((p,i,ar) => {
            /**
                fix missing positions
            **/
            var start = p.data?.start;
            var end = p?.data?.end;
            if(
                start?.html == end?.html 
                && start?.section == end?.section
                && start?.postIdx == end?.postIdx

            ) {
                start.section = 0;
            }
            var aliaNm = p.aliyahName;
            var nmIdx = aliyahNames.indexOf(aliaNm)
            if(aliaNm == "Rishon") nmIdx = 0;
            var nxt = ar[i+1]
            if(!nxt) {
                var nextParsha = parshaAr[pid+1]
                if(!nextParsha) {
                    return console.log("LAST maftir?",p,i,ar,par,pid,parshaAr)
                }
                var first = nextParsha.aliyos[0];
                var h = p?.data?.end?.html
                if(!h?.includes("<b>") && !h?.includes(levi)) {
                    p.data.end = Object.assign({},first.data.start)
                   //\ console.log("ENDED",p,first)
                }
                return //console.log("WELL?",p);
            }
            if(!nxt.data) return console.log("das?",nxt,p,i)
            var nxtNm = end?.html;
           
            if(nxtNm && nxtNm.includes("<b>")) {
                console.log("LLOL",nxtNm)
            } else {
                var nxtNmIdx = aliyahNames.indexOf(nxtNm)

                if(nxtNmIdx == nmIdx + 2) {
                    var realEnd = Object.assign({},end);
                    realEnd.section = 0;
                    //nxt.data.end=realEnd;
                  ///  console.log("FIOXED",nxt,p)


                } else if(nxtNmIdx == nmIdx + 1) {
                    nxt.data.start = end;
                }

                nxt.data.start = end;

            }
        })
    });

    /**
        for example if it says sheini then
        really rishon ENDS at the label sheini but sheini only
        begins one after the sheini.
        so except for if the section is 0,
        we always end at whatever it says but
        we always begin one more
    **/
    
     var first = true
     parshos.forEach((par,pid,parshaAr) => {
        
        par.aliyos.forEach((p,i,ar) => {
            /**
                fix missing positions
            **/
            var start = p.data?.start;
            var end = p?.data?.end;
            p.data.start = Object.assign({}, start);
            p.data.end = Object.assign({}, end)
            if(isNaN(p.data.start.section)) {
                p.data.start.section = 0;
            }
            //console.log(p,"asdf")
            if(first) {
              
                first  = false;
                return;
            }
            if(start?.section > 0) {
               
                p.data.start.section++
               // console.log("DID MORE ",p, )
               // p.data.end.section++
                
            } else {
                if(i > 0) {
                    var last = ar[i-1]
                    if(!last) return //console.log("NO",i,ar);
                   // console.log("HAS LAST",last,p)
                    if(last.data?.end?.section == 0) {
                   //    console.log("LOL",last,"WOW",ar,i);
                        last.data.end.section = "MAX",
                        last.data.end.postIdx--;
                    }
                }
            }
            


          
        })
    });

    var updatedParshos = [];
    //**combine maftir to shvvii**/
    parshos.forEach((par,pid,parshaAr) => {
        var last = par.aliyos[par.aliyos.length - 1]
        var newParsha = Object.assign({}, par);
        var shvii = newParsha.aliyos[newParsha.aliyos.length - 2]
        shvii.meta = last;
        shvii.data.end = Object.assign({},last.data.end);
        newParsha.aliyos = newParsha.aliyos.slice(0, newParsha.aliyos.length - 1)
        updatedParshos.push(newParsha)
    });
    function addMissing(parsha) {
        var alia = null;
        var nextAlia = null;
        Array.from(parsha.aliyos).forEach((w,i,ar) => {
            
            nextAlia = ar[i+1];
            if(!nextAlia) {
                
                return 
            }
            var aliaNameIdx = aliyahNames.indexOf(w.aliyahName)
            var nxtIdx = aliyahNames.indexOf(nextAlia.aliyahName)
            if(nxtIdx > aliaNameIdx + 1) {
                var realNextAliyah = aliyahNames[aliaNameIdx+1];

                parsha.aliyos.splice(i+1, 0, {
                    aliyahName: realNextAliyah,
                    data: {
                        start: w.data.end,
                        end: nextAlia.data.start
                    }
                })
               // console.log("WOW".parsha);
            } else {
             ///   console.log(nxtIdx,aliaNameIdx,w)
            }
        })
        return parsha;
    }

    return updatedParshos;
}



//B"H
var TorahSeries = "BH_1710482432662_771_sefarim"
var Bereishis = "BH_1710482432718_757_sefarim"
const numberToOrdinal = {
    1: "1st",
    2: "2nd",
    3: "3rd",
    4: "4th",
    5: "5th",
    6: "6th",
    7: "7th",
    8: "8th",
    9: "9th"
};
async function addAliyosToSeifer(seferSeries, parshos) {
    //
       var keys = Object.keys(parshos);
       for(var key of keys) {
            var parsha = parshos[key]
            var name = parsha.name
           var aliyos = parsha?.aliyos;
            var parshaName = name.hebrew+  " |  "
                    +name.english
           if(!Array.isArray(aliyos)) return console.log(
                "need array", parshaName, aliyos);
            var parshaSeries = await makeSeries({
                heichelId: "ikar",
                aliasId: "sefarim",
                parentSeriesId: seferSeries,
                title:  parshaName,
                
                
            })
            var parshaId = parshaSeries?.success?.newSeriesID;
            if(!parshaId) console.log("OSSIE",parshaName,aliyos,seferSeries)
            console.log("MADE parsha",parshaName,parshaSeries)
            
            var aliyaN = 1;
            for(var aliya of aliyos) {
                var ob = {
                    sourceSeriesId: seferSeries,
                    start: {
                        postNum: aliya.data.start.postIdx,
                        section: aliya.data.start.section
                    },
                    end: {
                        postNum: aliya.data.end.postIdx,
                        section: aliya.data.end.section
                    }

                 }
                if(aliya.meta) ob.meta=aliya.meta;
                
                var num = numberToOrdinal[aliyaN]
                if(!num) return console.log("WHOOPS",aliya,parshaName)
                var aliyaPost = await makePost({
                    heichelId: "ikar",
                    aliasId: "sefarim",
                    title: num + " Reading",
                    parentSeriesId: parshaId,
                    dayuh: {
                        sections: 
                             "<$awtsmoosRefStart:"+
                                 JSON.stringify(ob)
                                + ":awtsmoosRefEnd$>"
                        
                            
                    }
                    

                })
                console.log("MADE aliya?",aliya,aliyaN++,aliyaPost);
            }
            
       }
    //for(var 
}
//B"H
// Function to find aliyah markers in sections
function findMarkersInSections(post) {
    var sec = post?.dayuh?.sections;
    if (!Array.isArray(sec)) return [];

    var labels = [];
    var dp = new DOMParser();
    sec.forEach((q, i) => {
        var p = dp.parseFromString(q, "text/html");
        var spans = Array.from(p.querySelectorAll("span"));
        spans.forEach(s => {
            if (s.textContent && s.style.color.trim() === "rgb(1, 98, 0)") {
                labels.push({ html: s.innerHTML, section: i });
            }
        });
    });
    return labels;
}

// Function to process all posts and track aliyah start/end
async function processAliyahs(seriesId, seriesType) {
    var series = await getSeries(seriesId, seriesType);
    let results = [];
    let currentParsha = null;
    let currentAliyah = [];
    let parshaStartPost = 0;
    let isFirstParsha = true;
    var data = []
    // Loop through each post in the series
    for (let postIdx in series.posts) {
        let post = await getPost(series, postIdx, seriesType);
        let markers = findMarkersInSections(post);
        var res={postIdx, markers}
        data.push(res)
        
    }
    return data
}

// Example call
/*processAliyahs("BH_1710482432718_757_sefarim", "ikar").then((results) => {
    console.log(JSON.stringify(results, null, 2));
});
*/

//var parshal = awtsmoosAliyaParse(flataliyos)


