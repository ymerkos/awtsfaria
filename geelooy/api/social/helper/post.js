/**
 * B"H
 */
  
module.exports = {
    detailedPostOperation,
    getPost,
    getPostsInHeichel,
    addPostToHeichel,
    deletePost,
	editPostDetails,
	getPostByProperty
}
var {
    NO_LOGIN,
    sp
} = require("./_awtsmoos.constants.js");

var {
    loggedIn,
    er,
    myOpts
	
} = require("./general.js");

var {
    verifyHeichelAuthority
} = require("./heichel.js")

var {
    addContentToSeries,
    getSeries
} = require("./series.js");

var {
	deleteAllCommentsOfParent
} = require("./comment.js")

async function getPostByProperty({
	heichelId,
	parentSeriesId,
	propertyValue,
	$i,
	propertyKey
}) {
	if(!propertyKey && propertyKey !== 0) {
		return er({
			message: "Property key needed",
			code: "PROP_KEY_NEEDED"
		})
	}

	try {
		var opts = myOpts($i)
		var bs /*base*/ = await $i.db.get(`${
			sp
		}/heichelos/${
			heichelId
		}/series/${
			parentSeriesId
		}`, opts);

		if(!bs) {
			return er({
				message: "No parent series found",
				code: "NO_PAR_SER",
				details: {
					parentSeriesId,
					heichelId
				}
			})
		}

		var postIDs = await $i.db.get(`${
			sp
		}/heichelos/${
			heichelId
		}/series/${
			parentSeriesId
		}/posts`, opts);
		if(!postIDs) {
			return er({
				message: "No sub series!"
				,
				code: "NO_SUB_SER",
				details: {
					parentSeriesId,
					heichelId,
					postIDs
				}
			})
		}

		if(postIDs.length == 0) {
			return er({
				length:0,
				details: {
					propertyKey,
					propertyValue,
					heichelId,
					parentSeriesId
				}
			})
		}

		var filtered = [];
		for(var i = 0; i < postIDs.length; i++) {
			var c = postIDs[i];
			var withProp = await $i.db.get(`${
				sp
			}/heichelos/${
				heichelId
			}/posts/${
				c
			}`, {
				propertyMap: {
					[propertyKey]: true
				}
			});
			/*filtered.push({
				c,
				heichelId,
				withProp,
				propertyKey
			});
			*/
			if(withProp) {
				if(withProp[propertyKey] == propertyValue) {
					filtered.push(c)
				}
			}
		}
		return filtered;
	} catch(e) {
		return er({
			message: "Something happpened",
			code: "SERVER_ERROR",
			details: e+""
		})
	}
}

async function addPostToHeichel({
    $i,
    heichelId
}) {
    if (!loggedIn($i)) {
        return er({message:NO_LOGIN});
    }

    var title = $i.$_POST.title;
    var content = $i.$_POST.content;
    
    var aliasId = $i.$_POST.aliasId;
	var dayuh = $i.$_POST.dayuh;

    var ver = await verifyHeichelAuthority({
        heichelId,
        
        aliasId,
        $i
    });
    if (!ver) {
        return er({message:
            "You don't have authority to post to this heichel",
		   code:"NO_AUTH"
		});
    }



	if(title > 50) {
		return er({
			message: "Title too long. Max:  50",
			proper: {
				title: 50
			}
		})
	} 
	if(content > 50) {
		return er({
			message: "Content too long. Max:  15784",
			proper: {
				content: 15784
			}
		})
	} 
		
	
    
	title = title.trim();
	content = content.trim();
    var postId = "BH_POST_"+
		Date.now() + "_"
		+(Math.floor(
			Math.random()*770	
		)+770)+"_"+
	    aliasId+"_"
	    +title.length+"_"+content.length//$i.utils.generateId(title);
    var pi /*post info*/= {
		title,
		content,
		postId,
		author: aliasId
	};

	if(dayuh) {
		pi.dayuh = dayuh;
	}

	/*
         the parent series id to
	 add the post to
  */
    

	var seriesId = $i.$_POST.seriesId || 
		$i.$_POST.parentSeriesId
		||"root";
	pi.parentSeriesId = seriesId;
	try {
		
		
		await $i.db.write(
			sp +
			`/heichelos/${
				heichelId
			}/posts/${
				postId
			}`, pi
		);
		await $i.db.write(sp + `/aliases/${aliasId}/heichelos/${
			heichelId
		}/series/${seriesId}/posts/${postId}`);

		
		$i.$_POST.contentType = "post";
		$i.$_POST.contentId = postId;
		var fa = await addContentToSeries({
			heichelId,
			myParentSeriesId:seriesId,
			$i
		});
		if(!fa) {
			return er({
				code:"NO_SERIES"

			})

		}
		if(fa.indexAddedTo) {
		//	pi.indexInSeries = fa.indexAddedTo;
		}
		if(fa.error) {
			return er({code: "COULDN'T_ADD", details:fa.error});
		}
		return {success: {
			title,
			postId
		}};
		
	} catch(e) {
		return er({code: "PROBLEM_ADDING: "+e.stack});
	}


	

}

/**
 * 
 * @param {} $i.$PUT: 
 * 	newTitle || title
 *  newContent || content
 * @returns 
 */
async function editPostDetails({
	$i,
	heichelId,
	postID,
	verified = false
}) {
	if (!loggedIn($i)) {
		return er(NO_LOGIN);
	}

	

	
	
	var override = !$i.$_PUT.dontOverride;
	var aliasId = $i.$_PUT.aliasId 
	
	if(!verified) {
		
		var ha = await verifyHeichelAuthority({
			$i,
			aliasId,
			heichelId
			

		})

		if (!ha) {
			return er({
				code: "NO_AUTH",
				alias: aliasId,
				heichel: heichelId
			})

		}

	}

	var postId = postID
	var newTitle = $i.$_PUT.newTitle ||
		$i.$_PUT.title || $i.$_PUT.name;

	var newContent = $i.$_PUT.newContent ||
		$i.$_PUT.content || $i.$_PUT.description;

	var parentSeriesId = $i.$_PUT.parentSeriesId;

	var dayuh = $i.$_PUT.dayuh;
	if (newTitle && typeof(newTitle) == "string") {
		if(newTitle.length > 50) {
			return er({
				message: "Invalid new title"
			,
			proper: {
				title : 50
			}
			});
		}
	}
	

	if (
		newContent &&
		typeof(newContent) == "string" &&
		newContent.length > 5784
	) {
		{
			return er({message:
				"Invalid content length (max: 5784)",
				code:"INVALID_CONTENT_LENGTH",
				needed:5784
			})
		}
	}
	
	try {
		// Fetch the existing data
		var postData = {};
		//if(override) 
			postData = await $i.db
			.get(sp + `/heichelos/${heichelId}/posts/${postId}`);
		var wrote = {}
		// Update the title and content in the existing data
		if (newTitle && newTitle != "undefined")
			postData.title = newTitle;
			wrote.title = true;
			if(parentSeriesId) {
				await $i.db.write(sp + `/heichelos/${
					heichelId
				}/aliases/${aliasId}/series/${parentSeriesId}/posts/${postId}`, {title: newTitle});
			}
		if (newContent&& newContent != "undefined") {
			postData.content = newContent;
			wrote.content = true
		}

		if(dayuh) {
			
			if(override) postData.dayuh = dayuh;
			else {
				var existingDayuh = postData.dayuh;
				if(existingDayuh) {
					Object.assign(existingDayuh, dayuh)
					postData.dayuh = existingDayuh;
				} else 
					postData.dayuh = dayuh;
			}
			wrote.dayuh = true;
		}

		if(parentSeriesId && parentSeriesId != "undefined") {
			postData.parentSeriesId = parentSeriesId;
			wrote.parentSeriesId = true;
		}
		// Write the updated data back to the database
		await $i.db
			.write(sp + `/heichelos/${heichelId}/posts/${postId}`, postData, {
				onlyUpdate: !override /*if we don't override that menas we only update the values.
    					if we do (default) it deletes the entry and rewrites it*/
			});

		return {
			message: "Post updated successfully",
			newTitle,
			newContent,
			wrote
		};
	} catch (error) {
		console.error("Failed to update post", error);
		return er({message:"Failed to update post", code:"NO_UPDATE_POST"});
	}
	
}

async function deletePost({
	heichelId,
	$i,
	postID
}) {
	

	
	
	

	var aliasId = $i.$_DELETE.aliasId
	var ha = await verifyHeichelAuthority({
		$i,
		aliasId,
		heichelId
		

	})

	if (!ha) {
		return er({
			code: "NO_AUTH",
			alias: aliasId,
			heichel: heichelId
		})

	}

	var postId = postID
	/**
	 * 
	 * try to delete comments
	 */
	/*var commentsAtPost = await $i.db.get(`${
		sp
	}/heichelos/${heichelId}/comments/atPost/${
		postId
	}`)*/
	var deleted = {

	}
	try {
		var com = await deleteAllCommentsOfParent({
			heichelId,
			parentId: postId,
			parentType: "post"
		})
		deleted.comments = {
			message: "Deleted post comments successfully",
			comments:com
		}
	} catch(e) {

	}
	try {
		// Delete post details
		await $i.db.delete(sp + `/heichelos/${heichelId}/posts/${postId}`);
		deleted.post= {
			message: "Post deleted successfully"
		};
		try {
			var {author, parentSeriesId} = $i.db.get(sp + `/heichelos/${
				heichelId
			}/posts/${postId}`, {
				propertyMap: {
					author: true,
					parentSeriesId: true
				}
			})
			
			if(author && parentSeriesId) {
				await $i.db.delete(sp + `/aliases/${author}/heichelos/${
					heichelId
				}/series/${parentSeriesId}/posts/${postId}`);
				deleted.post.authorAdded = {author, parentSeriesId}
			} else {
				deleted.post.authorAdded =  er({message:  e.stack,message: "didn't deelte full"})
			}
		} catch(e) {
			deleted.post.authorAdded = er({message:  e.stack})
		}
		
	} catch (error) {
		console.error("Failed to delete post", error);
		deleted.post= er({message:"Failed to delete post", code:"NO_DELETE_POST"});
	}
	return deleted;
}

async function detailedPostOperation({
	heichelId,
	
	userid,
	postID,
	$i
}) {
	if ($i.request.method == "GET") {



		var post$i = await getPost({
			heichelId,
			
			userid,
			postID,
			$i
		})

		if (!post$i) return null;
		return post$i;
	}

	if ($i.request.method == "PUT") {
		return await editPostDetails({
			heichelId,
			postID,

			$i
		})
	}

	if ($i.request.method == "DELETE") {
		return await deletePost({
			heichelId,
			postID,

			$i
		})
		
	}
}
async function getPost({
	heichelId,
	postID,
	$i,
	
	
	
	userid
}) {
	var isAllowed = true;/* await verifyHeichelPermissions({
		heichelId,
		$i,
		
		
		

		userid
	})*/;

	if (isAllowed) {
		var opts =myOpts($i)
		var post = await $i.db.get(
			sp +
			`/heichelos/${
		  heichelId
		}/posts/${
		  postID
		}`, opts
		);
		
		
		if(post)
			post.id = postID
		return post;
	}

	return null;

}


//gets IDs only
async function getPostsInHeichel({
	$i,
	
	heichelId,
	withDetails = false, 
	properties
}) {
	if(!properties) 
		properties={};
	var options = myOpts($i)
	
	var parentSeriesId = $i.$_POST.seriesId || $i.$_GET.seriesId || "root";

	var parentSeries = await getSeries({
		$i,
		seriesId:parentSeriesId,
		withDetails: true,
		heichelId
	});
	
	
	if(parentSeries.error) {
		return [];//er({code: "NO_PARENT_SERIES", details: parentSeries.error});
	}
	
	var p = parentSeries.posts;
	if(!p) {
		return [];//er({code: "NO_POSTS"});
	}
	if(!withDetails) {
		return p
	}
	
	var posts = [];
	for(
		var i = 0;
		i < p.length;
		i++
	) {
		var s = p[i];
		//if(!s) continue;
		var pst = await $i.db.get(
			sp +
			`/heichelos/${
			  heichelId
			}/posts/${s}`,
			options
		);
	//	console.log("Got it",pst,s,p,parentSeries)
		if(pst) {
			pst.id = s;
			if(properties) {
				var prop;
				for(
					prop of
					Object. keys(properties)

				) {
					if(pst[p]){
						var pr=
							properties[prop];
						try {
							if(pr===false) {
								delete pst[prop]

							} else if(typeof(pr)=="number") {
								if(typeof(pst[prop])=="string") {
									pst[prop]=pst[prop]
									. substring(0, pr)

								}

							}

						} catch(e) {
							console.log(e)
						}
					}

				}

			}
			pst.indexInSeries = i;
			pst.seriesId = parentSeriesId;
			
			
			posts.push(pst);
		} else {
			//posts.push({error: "Not found"})	
		}
	}
	
	
	


	return posts;
}
