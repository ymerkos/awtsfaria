/**
B"H
@requires div with id "postsList"

for displaying and editing one's posts.
@requires EntityModule 
**/
import Awts from "../alerts.js";

import EntityModule from './EntityModule.js';
console.log(window.heichelID)
function go() {

	var a = document.createElement("a")
	try {
		if(!window.heichelID) {
			Awts.alert("No Heichel ID found");
			return;
		}
		var postsHandler = new EntityModule({
			apiEndpoint: '/api/social/',
			containerID: "postsList",
			entityIds: "postIds",
		subPath: "/heichelos/"+window.heichelID,
			entityType: "posts", //entityType
			editableFields: [
				"title",
				"content"
			],
			readonlyFields: [
		"id",
				"author"
			],
			getFn: async (entity, mod) => {
				var heych = await mod.getPost(entity)
				return heych
			},
			updateDataFn: async (r) => {
				return {
					postId: r.id,
					content: r.updatedData.content ||
						r.entity.content,
					title: r.updatedData.title || r.entity.title
				}
			},
			viewURL: m=>`/heichelos/${
				heichelID
			}/post/${m.id}`,
			
			createFn: async m => {
				var postName = await Awts.prompt("enter post title")
				var aliasID = await Awts.prompt("Enter your alias ID to match it")
				var hid = window.heichelID
				var description = await Awts.prompt("enter content");
				try {
				var r = await m.createEntity({
						title: postName,
						content: description,
						aliasId: aliasID,

						heichelId: hid
					});
				await Awts.alert("Made "+JSON.stringify(r));
			
				
				} catch (e) {
					await Awts.alert(
					"Error: "+e

					)

				}
		return r;
		
			}
		});
	postsHandler.initialize();
	} catch ($) {
	console.log($)
	}
}

go()