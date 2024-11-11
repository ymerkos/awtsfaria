//B"H
/**
call it on awtsmoos.com/editor
**/
var json = await loadJSON();
window.json = json
window.rambamSeries = "BH_1731270366023_715_sefarim"

window.addRambamToAwtsmoos=addRambamToAwtsmoos;
//B"H
/**
aliasId: rambam
title: asdfgg
content: asdfgjhg
heichel: ikar
parentSeriesId: BH_1731292675539_705_rambam
dayuh: {"meta":{}}


**/
async function addNewSeries({
    heichelId,
    aliasId,
    description,
    title,
    parentSeriesId,
    dayuh
}) {
    return await (await fetch(
        location.origin+
        `/api/social/heichelos/${
            heichelId
        }/addNewSeries`, {
            method: "POST",
            body: new URLSearchParams({
                aliasId,
                description,
                title,
                parentSeriesId,
                dayuh: JSON.stringify(dayuh)
            })
        })).json();
}
async function addNewPost({
    heichelId,
    aliasId,
       
    content="",
    title,
    parentSeriesId,
    dayuh
}) {
    return await (await fetch(
        location.origin+
        `/api/social/heichelos/${
            heichelId
        }/posts`, {
            method: "POST",
            body: new URLSearchParams({
                aliasId,
                content,
                title,
                parentSeriesId,
                dayuh: JSON.stringify(dayuh)
            })
        })).json();
}

async function editPost({
    heichelId,
    aliasId,
    postId,
    content="",
    title,
    parentSeriesId,
    dayuh
}) {
    return await (await fetch(
        location.origin+
        `/api/social/heichelos/${
            heichelId
        }/post/${postId}`, {
            method: "PUT",
            body: new URLSearchParams({
                aliasId,
                content,
                title,
                parentSeriesId,
                dayuh: JSON.stringify(dayuh)
            })
        })).json();
}


async function addRambamToAwtsmoos(rambamJSON, parentSeriesId) {
	var times = 0;
	for(var sefer of rambamJSON) {
        if(times++ < 9) {
            console.log("SKIPPED",sefer);
            continue; 

        }
		var seferTitle = sefer.header
		var seferDescription = sefer.info;
		var f=await addNewSeries({
		    title: seferTitle,
		    heichelId: "ikar",
		    aliasId: "rambam",
            dayuh: {},
		   // description: seferDescription,
		    parentSeriesId:  parentSeriesId
		})
		var seferSeriesId = f?.success?.newSeriesID;
		if(!seferSeriesId) {
			console.log("Sefer series NOT made!",f,sefer);
			return;
		}
		var introPost = await addNewPost({
            title: "Sefer Introduction",
		    heichelId: "ikar",
		    aliasId: "rambam",
            dayuh: {},
            parentSeriesId:  seferSeriesId,
            content: seferDescription
        })
        console.log("Made intro post",introPost);
		for(var halacha of sefer.children) {
			/**
				new sub series
			**/
			var halachaTitle =
				halacha.header;

            
			var halachaDescription =
				halacha.content[0].connections;
			
			if(halacha?.content?.chapters?.length) {
                console.log(" HAVE chapters. NOT intro",halacha,sefer);
             
				var h=await addNewSeries({
				    title: halachaTitle,
				    heichelId: "ikar",
				    aliasId: "rambam",
				    
				    parentSeriesId: seferSeriesId
				})
				var halachaSeriesId = h?.success?.newSeriesID;
				if(!halachaSeriesId) {
					console.log("halacha series NOT made!",h, halacha);
					return;
				}

                var heichelIntroPost = await addNewPost({
                    title: "Halacha Introduction",
                    heichelId: "ikar",
                    aliasId: "rambam",
                    dayuh: {},
                    parentSeriesId:  halachaSeriesId,
                    content: halachaDescription
                })
				for(
					var chapter of halacha
						.content
						.chapters
				) {
					var chapterTitle =
						chapter.header;
        

                    var chap = 'פרק';
                    if(chapterTitle.slice(0,3) != chap) {
                        console.log("NOT a chapter!", chapter);
                        continue;
                    }
                    var ar = objToArray(chapter.content)
                    
					var halachos =
						ar
                        .find(w=>w.name=="דפוס");
                    if(!halachos) {
                        halachos = ar.find(
                            w => w.header == "דפוס"
                        )
                    }
                    if(!halachos) return console.log(
                        "NO halachos",
                        halachos, halacha, sefer, chapter
                    );
					var connections = chapter.content[0]?.connections;
                    var parst = halachos.children.map(q=>
                            q.children?q.children.map(w=>{
                                var p =document.createElement("p")
                                p.classList.add("awtsPar")
                                p.innerHTML = w;
                                return p.outerHTML;
                            }):q
                        ).flat()
	                console.log("GOT",halachos.children,parst);
					var p=await addNewPost({
						title: chapterTitle,
						heichelId: "ikar",
						aliasId: "rambam",
						/*content: "B\"H"+
						"\nA great chapter.",*/
						
						parentSeriesId: halachaSeriesId,
						dayuh: {
                            sections: parst,
							meta: {
								connections
							}
						}
					});
					console.log("MADE post", p, chapter, halacha, sefer);
				}
			} else {
                console.log("DO NOT HAVE chapters",halacha,sefer);
            
				/**
					is introduction which has "posts" directly
     					attached to the "halacha" but not separate chapters
    				**/
				var sections = objToArray(halacha.content)
                    .find(w=>w.header=="דפוס");

                if(!sections) {
                    sections = objToArray(halacha.content)
                    .find(w=>w.name=="דפוס");
                }
                if(!sections) {
                    //find others
                    sections = objToArray(halacha.content)
                        .filter(w=>!w.connections)
                    var ch = sections.map(q=>q.children.map(w=> {
                        var p =document.createElement("p")
                        p.innerHTML = w;
                        return p.outerHTML;
                    })).flat();
                    console.log("new sections",ch,sections);
                    sections = ch;
                } else {
                    console.log("Print sections",sections);
                    sections = sections.children;
                }
				if(!sections) {
					console
                    .log(
                       "Couldn't find sub sections",
                        halacha, 
                        sefer, 
                        sections
                    );
					return;
				}
                
                console.log("GOT sections of intro",sections, halacha,sefer);
				var p=await addNewPost({
					title: halachaTitle,
					heichelId: "ikar",
					aliasId: "rambam",
					
					/*content: "B\"H"+
						"\nA good chapter.",*/
					parentSeriesId: seferSeriesId,
					dayuh: {
                        sections:sections,
						meta: {
							connections
						}
					}
				});
				
			}
		}
	
		//if(times > 1) return console.log("DONE")
	}
}

function objToArray(obj) {
    var keys =  new Float64Array(Object.keys(obj));
    keys = keys.sort()
    var base = Array.from({length:keys[0] + 1});
    keys.forEach((w,i) => base[w] = obj[w]);
    return base;
    
}
