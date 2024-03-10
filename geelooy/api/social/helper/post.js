/**
 * B"H
 */

module.exports = {
    detailedPostOperation,
    getPost,
    getPostsInHeichel,
    addPostToHeichel,
    deletePost
}
var {
    NO_LOGIN,
    sp
} = require("./_awtsmoos.constants.js");

var {
    loggedIn,
    er
} = require("./general.js");

var {
    verifyHeichelAuthority
} = require("./heichel.js")

var {
    addContentToSeries,
    getSeries
} = require("./series.js");


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
				message: "Title too long. Max:  5784",
				proper: {
					content: 5784
				}
			})
		} 
		
	
    
	title = title.trim();
	content = content.trim();
    var postId = "BH_POST_"+
		Date.now() + "_"
		+(Math.floor(
			Math.random()*770	
		)+770)+"_"+title//$i.utils.generateId(title);
    var pi /*post info*/= {
		title,
		content,
		postId,
		author: aliasId
	};

	/*
         the parent series id to
	 add the post to
  */
    

	var seriesId = $i.$_POST.seriesId || 
		$i.$_POST.parentSeriesId
		||"root";
	
	try {
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
		if(fa.error) {
			return er({code: "COULDN'T_ADD", details:fa.error});
		}
		
		await $i.db.write(
			sp +
			`/heichelos/${
			heichelId
			}/posts/${
			postId
			}`, pi
		);
		return {success: {
			title,
			postId
		}};
		
	} catch(e) {
		return er({code: "PROBLEM_ADDING: "+e});
	}


	

}

/**
 * 
 * @param {} $i.$PUT: 
 * 	newTitle || title
 *  newContent || content
 * @returns 
 */
async function editPostDetilas({
	$i,
	heichelId,
	postID
}) {
	if (!loggedIn($i)) {
		return er(NO_LOGIN);
	}

	
	
	
	

	var aliasId = $i.$_PUT.aliasId
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
	var newTitle = $i.$_PUT.newTitle ||
		$i.$_PUT.title;

	var newContent = $i.$_PUT.newContent ||
		$i.$_PUT.content;

	if (newTitle)
		if (!$i.utils.verify(newTitle, 50)) {
			return er("Invalid new title");
		}

	if (
		newContent &&
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
	if (
		newTitle ||
		newContent
	) {
		try {
			// Fetch the existing data
			var postData = await $i.db
				.get(sp + `/heichelos/${heichelId}/posts/${postId}`);

			// Update the title and content in the existing data
			if (newTitle)
				postData.title = newTitle;

			if (newContent)
				postData.content = newContent;

			// Write the updated data back to the database
			await $i.db
				.write(sp + `/heichelos/${heichelId}/posts/${postId}`, postData);

			return {
				message: "Post updated successfully",
				newTitle,
				newContent
			};
		} catch (error) {
			console.error("Failed to update post", error);
			return er({message:"Failed to update post", code:"NO_UPDATE_POST"});
		}
	} else {
		return er({code:"NO_REQUEST",message:"No $i to update."})
	}
}

async function deletePost({
	heichelId,
	$i,
	postID
}) {
	if (!loggedIn($i)) {
		return er(NO_LOGIN);
	}

	
	
	

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

	try {
		// Delete post details
		await $i.db.delete(sp + `/heichelos/${heichelId}/posts/${postId}`);

		return {
			message: "Post deleted successfully"
		};
	} catch (error) {
		console.error("Failed to delete post", error);
		return er({message:"Failed to delete post", code:"NO_DELETE_POST"});
	}
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
		return await editPostDetilas({
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
		var post = await $i.db.get(
			sp +
			`/heichelos/${
		  heichelId
		}/posts/${
		  postID
		}`
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
	var options = {
		page: $i.$_GET.page || 1,
		pageSize: $i.$_GET.pageSize || 1000
	};
	
	var parentSeriesId = $i.$_POST.seriesId || "root";

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
		if(!s) continue;
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
		}
	}
	
	
	


	return posts;
}
