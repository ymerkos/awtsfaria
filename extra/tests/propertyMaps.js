//B"H
//B"H
g = await fetch(`https://awtsmoos.com/api/social/heichelos/ikar/post/BH_POST_1710482432861_1407_sefarim_9_0?` + new URLSearchParams({
	propertyMap: JSON.stringify({
		dayuh: {
			sections: {
				"0":5
			}
		}
	})
}))

var h = await g.text()

return h;