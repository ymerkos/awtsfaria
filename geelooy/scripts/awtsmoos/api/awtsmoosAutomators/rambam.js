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
		for(var halacha in sefer.children) {
			/**
				new sub series
			**/
			var halachaTitle =
				halacha.header;
			var halachaDescription =
				halacha.content[0].connections;
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
					)
			}
		}
	}
}
