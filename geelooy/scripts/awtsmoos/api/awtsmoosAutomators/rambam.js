//B"H
/**
call it on awtsmoos.com/editor
**/
var json = await loadJSON();
window.json = json
window.rambamSeries = "BH_1731270366023_715_sefarim"

window.addRambamToAwtsmoos=addRambamToAwtsmoos;
async function addRambamToAwtsmoos(rambamJSON, parentSeriesId) {
	for(var sefer in rambamJSON) {
		var seferTitle = sefer.header
		var seferDescription = sefer.info;
		var f=await makeSeries({
		    seriesName: seferTitle,
		    heichelId: "ikar",
		    aliasId: "rambam",
		    description: seferDescription,
		    parentSeries:  parentSeriesId
		})
		var seferSeriesId = f?.success?.newSeriesID;
		if(!seferSeriesId) {
			console.log("Sefer series NOT made!",f,sefer);
			return;
		}
		
		for(var halacha in sefer.children) {
			/**
				new sub series
			**/
			var halachaTitle =
				halacha.header;
			var halachaDescription =
				halacha.content[0].connections;
			
			if(halacha.content.chapters) {
				var h=await makeSeries({
				    seriesName: halachaTitle,
				    heichelId: "ikar",
				    aliasId: "rambam",
				    description: halachaDescription,
				    parentSeries: seferSeriesId
				})
				var halachaSeriesId = f?.success?.newSeriesID;
				if(!halachaSeriesId) {
					console.log("halacha series NOT made!",h, halacha);
					return;
				}
				for(
					var chapter in halacha
						.content
						.chapters
				) {
					var chapterTitle =
						chapter.header;
					var halachos =
						Array.from(chapter.content).find(w =>
							w.name == "דפוס"
						);
					var connections = chapter.content[0]?.connections;
	
					var p=await makePost({
						postName: chapterTitle,
						heichelId: "ikar",
						aliasId: "rambam",
						sections:halachos,
						parentSeries: halachaSeriesId,
						dayuh: {
							meta: {
								connections
							}
						}
					});
					console.log("MADE post", p, chapter, halacha, sefer);
				}
			} else {
				/**
					is introduction which has "posts" directly
     					attached to the "halacha" but not separate chapters
    				**/
				var sections = Array.from(halacha.content).find(w=>w.name=="דפוס");
				if(!sections) {
					console.log("Couldn't find sub sections",halacha, sefer, sections);
					return;
				}
				var p=await makePost({
					postName: halachaTitle,
					heichelId: "ikar",
					aliasId: "rambam",
					sections:sections.children,
					parentSeries: seferSeriesId,
					dayuh: {
						meta: {
							connections
						}
					}
				});
				
			}
		}
	}
}
