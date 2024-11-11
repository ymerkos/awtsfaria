//B"H
/**
call it on awtsmoos.com/editor
**/
var json = await loadJSON();
window.json = json
async function addRambamToAwtsmoos(rambamJSON) {
	for(var sefer in rambamJSON) {
		var seferTitle = sefer.header
		var seferDescription = sefer.info;
		var f=await makeSeries({
		    seriesName: seferTitle,
		    heichelId: "ikar",
		    aliasId: "rambam",
		    description: seferDescription,
		    parentSeries: "BH_1731270366023_715_sefarim"
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
					chapter.content.find(w =>
						w.name == "דפוס"
					);
				var connections = chapter.content[0]?.connections;

				f=await makePost({
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
				})
			}
		}
	}
}
