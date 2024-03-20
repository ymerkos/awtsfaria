//B"H



//add new comment

//B"H
g = await fetch(`https://awtsmoos.com/api/social/heichelos/ikar/post/BH_POST_1710482432861_1407_sefarim_9_0/comments`, {
	method: "POST",
	body: new URLSearchParams({
		aliasId: "sefarim",
		dayuh: JSON.stringify({
			sections: [
				'B"H',
				"Great post"
			]
		})
	})
})

var h = await g.json()

return h;



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





//B"H
g = await fetch(`https://awtsmoos.com/api/social/heichelos/ikar/comment/BH_1710912212007_commentBy_sefarim?`
+
	new URLSearchParams({
		propertyMap: JSON.stringify({
			author: true, parentId: true
		})
	})
)

var h = await g.json()

return h;

