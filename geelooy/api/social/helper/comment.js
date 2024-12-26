/**
 * B"H
 */


module.exports = {
	addComment,
	getComments,
	getComment,
	deleteComment,
	updateAllCommentIndexes,	
	addCommentIndexToAlias,
	deleteAllCommentsOfAlias,
	deleteAllCommentsOfParent,
	editComment,

	denyComment,
	getSubmittedComments,
	approveComment
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
} = require("./heichel.js");

var {
	verifyAliasOwnership
} = require("./alias.js");

/**
 * 
 * data structure of comments: 
 * aliasId - author
 * parent - {
 *      type: either post or another comment
 *      id: the id of its parent
 * 
 *          each comment should only have
 *          access to it's immediete parent
 * }
 * id -- unique id for the comment
 * 
 * content -- html or text
 * dayuh -- extra user data that could include custom content like secionts
 * (time created and time updated is automated)
 * 
 * getting each post should get all of the comments in its root.
 * 
 * then if you get one of the comments of the root, u can get all of its children.
 * 
 * if you only have the child, you can only get its parent (one at a time)
 * 
 * the "comments" folder / database should be in the heichel of the 
 * post commenting to, but the comments aren't necessarilu on the heichel itself,
 * although they could be in the future
 * 
 * when a comment is added to a post, then it adds each (root) comment to the
 * dayuh object of that post, organized by aliasId and an array of comments
 * that aliasId made
 * 
 * For example one named Yackov comments to post with id BH_191032831092480,
 * then leaves several more comments to same root level post, they should
 * all be stored in the root level of the post - dayuh - comments (object) with
 * a key of the aliasId Yackov and in there is an array of all of the comments left,
 * in order of when they were created
 * 
 * and so too for other aliases commenting on the same post. And for child comments,
 * same thing exactly, each child comment is stored at root level of the 
 * /comments database in that heichel, but the list of child comment IDs is
 * stored in its parent dayuh object under parent comment - dayuh -> comments
 * ->aliasId -> array of child comments (replies essentially) in order.
 * 
 * Each of these sub replies and comments in general could be either a comment / reply
 * to entire parent post / parent comment, or a "section" (sections can be
 * elements of an array stored in dayuh to have sequential post data
 * ).
 * 
 * Whether or not a comment is on the entire post or on a section of that post,
 * is determined by a property in the dayuh section of each comment
 * 
 * for example in a comment the dayuh object can have (in addition to sub comments)
 * parentSection: 0.
 * 
 * If one were to find all comments that are only on one section as opposed to all
 * comments, one first gets all of the comment IDs for the root level, then
 * uses the database to filter through all of the comments that have the property
 * dayuh.parentSection for example at the index one wants, and gets the content
 * of the comments that way.
 * 
 * 
 * Also when adding a new comment, in addition to storing the comment details in the
 * /comments folder, one should also store 
 * a reference to that comment ID that's associated with one's alias,
 * in order to get all comments one has made. at that directory structure.
 * 
 * So need to modify dayhu property of /alias main area,
 * to include comments. Also maybe need to do for posts also
 */


/**
 * 
 * @method addCommentToPost
 * request: POST
 * requires: aliasId of commenter 
 *  content text/html OR dayuh / sections.
 * 
 * optional: dayuh -> sub section id
 * Also needs: 
 *  parentType: "post or comment",
 *  parentId
 * 
 * 
 */
async function addComment({
	$i,
	parentType = "post",
	parentId,
	heichelId,
	aliasId,
	userid,
	postId /**needed only if adding reply to comment in a larger post*/ ,
}) {
	try {

		if (!aliasId) aliasId = $i.$_POST.aliasId;
		var owns = await verifyAliasOwnership(
			aliasId,
			$i,
			userid
		);
		if (!owns) {
			return er({
				message: "You don't have permission to post as this alias.",
				details: {
					aliasId,
					userid
				}
			});
		}
		var ver = await verifyHeichelAuthority({
			heichelId,

			aliasId,
			$i
		});
		// If not authorized, call submitComment instead of returning an error.
		if (!ver) {
			return await submitComment({
				$i,
				parentType,
				parentId,
				heichelId,
				aliasId,
				userid,
				postId
			});

			return er({
				message: "You don't have authority to post to this heichel",
				code: "NO_AUTH"

			});
		}
		return await addOrApproveComment({
			$i,
			parentType,
			parentId,
			heichelId,
			aliasId,
			userid,
			postId /**needed only if adding reply to comment in a larger post*/ ,
		})
	} catch (e) {
		return er({
			details: e.stack

		})

	}

}
async function submitComment({
                $i,
                parentType,
                parentId,
                heichelId,
                aliasId,
                userid,
                postId
   }) {
  const {content, dayuh } = $i.$_POST; // Extracting data from $_POST
  const db = $i.db; // Accessing the database
  
  const timestamp = Date.now();
  const commentId = "BH_tempComment_by_"+aliasId+"_at_"+timestamp;
  const commentData = { aliasId, parentId, parentType, content, dayuh, timestamp };
  
  
  
  const fullPath =await  getSubmittedCommentPath({
	parentType,
	heichelId,
	parentId,
	postId,
	commentId,
	$i,
	aliasId
	
})
	if(typeof(fullPath) != "string" || fullPath.error) {
		return fullPath;
	}
  const allSubmittedPath = `${sp}/heichelos/${heichelId}/comments/submitted/all/${commentId}`;
  
  // Step 3: Add metadata to the comment data
  commentData.awtsmoosDayuh = {
	BH: "Boruch Hashem",
    	fullPath, // Full path to the organized comment
   	submittedPath: allSubmittedPath, // Simple path for approval/denial access
 	parentId,
	parentType,
	postId,
	commentAliasId: aliasId
  };

  // Step 4: Store comment in both locations
  await db.write(fullPath, commentData.awtsmoosDayuh);
  await db.write(allSubmittedPath, commentData);

  return { success: true, commentId, fullPath, allSubmittedPath };
}


// Shared function for adding or approving a comment
async function addOrApproveComment({
    $i,
    parentType,
    parentId,
    heichelId,
    aliasId,
	userid,
    postId, // Needed only if replying to a comment
    isApproval = false // Determines if we're approving the comment
}) {
    try {
    if(!parentType) {
        parentType = $i.$_POST.parentType
    }

    if(!parentId) {
        parentId = $i.$_POST.parentId
    }

    
    var parent;
	var link = parentType == "post" ?
		"atPost" : parentType == "comment" 
			? "atComment" : null;
	if(!link) return er({
	    message:"You need to supply a parent type",
	    code:"MISSING_PARAMS"
	    
	});
	var postId = $i.$_POST.postId;
	var isPost = parentType = "post";
	var postId = isPost?parentId : postId;
	if(!postId) {
		return er({
			message: "If commenting on post, provide parent ID."
				+"If replying to comment in a larger post, provide parentId of comment and postId",
			code: "MISSING_PARAMS",
			details: "postId"
				
		})
	}
	/*adding comment to post.
	need to check if it exists*/
	var path = `${
	    sp
	}/heichelos/${
	    heichelId
	}/posts/${
	    postId
	}`
	post = await $i.db.access(path);
	if(!post) {
	    return er({
		message: "Post parent not found",
		code: "PARENT_NOT_FOUND",
		details: {
		    post: postId,
		    heichelId: heichelId,
		    path
		}
	    })
	}
    
    
	
    if(!post) {
        return er({
            message: "No parent",
            code: "PARENT_NOT_FOUND"
        })
    }

    var myId = "BH_"+Date.now()+"_commentBy_"+aliasId;
    var content = $i.$_POST.content;
    var dayuh = $i.$_POST.dayuh;

    var shtar = {};
    shtar.author = aliasId;
    shtar.parentType = parentType;
    shtar.parentId = parentId;

    if(content && typeof(content) == "string" && content != "undefined") {
        shtar.content = content
    }

    if(dayuh && typeof(dayuh) == "object") {
        shtar.dayuh = dayuh;
    }

    /*var chaiPath = `${
        sp
    }/heichelos/${
        heichelId
    }/comments/chai/${
        myId
    }`
    var cm = await $i.db.write(chaiPath, shtar);*/

    var atPost;

	
    var postPath = getCommentToPostPath({
		heichelId,
		link,
		parentId,
		aliasId,
		commentId: myId
	})

	
	
    	
    	var wrote = await $i.db.write(postPath, shtar);
	var got = {
		commentId: myId,
		postPath
	};
	var didIGet = await $i.db.get(postPath);
	if(!didIGet) {
		return er({
			message: "did NOT properly add comment",
			wrote,
			shtar,
			...got
		})
	}
	var index = await addCommentIndexToAlias({
		parentId,
		heichelId,
		$i,
		parentType,
		postId,
		userid,
		aliasId,
		commentId: myId,
		postPath,
		commentPostedAt:postPath
	});
	if(index.error) {
		return index.error
	}
	
    return {
	message: "Added comment!",
	details: {
		id: myId,
		setCommentIndex: index,
		index,
		wrote: {
			parentId,
			aliasId,
			wrote
		},
		paths: {
			postPath,
			
		
		},
		
		dayuh
	}
    }
		
	} catch(e) {
		return er({
			message: "Issue adding comment",
			details: e.stack
		})
}

	
}
        
function getCommentToPostPath({
	heichelId,
	link,
	parentId,
	aliasId,
	commentId
}) {
	return `${
	        sp
	    }/heichelos/${
	        heichelId
	    }/comments/${link}/${
	        parentId
	    }/author/${
	        aliasId
	    }/${
	        commentId
	    }`
}
/**
 * Approve a submitted comment.
 * @param {Object} params - The parameters for approval.
 * @param {Object} params.$i - The database interaction object.
 * @param {string} params.heichelId - The ID of the heichel.
 * @param {string} params.aliasId - The alias ID of the admin user approving the comment.
 * @param {string} params.commentId - The ID of the comment to approve.
 */
async function approveComment({
	$i, heichelId,
	aliasId,//the alias of the admin approving
	commentId,
	userid
}) {
    try {
        
	var owns = await verifyAliasOwnership(
		aliasId,
		$i,
		userid
	);
	if (!owns) {
		return er({
			message: "You don't have permission to post as this alias.",
			details: {
				aliasId,
				userid
			}
		});
	}
        // Verify the admin user has authority to approve comments in this heichel
        const isAuthorized = await verifyHeichelAuthority({ heichelId, aliasId, $i });
        if (!isAuthorized) {
            return er({
                message: "You don't have the authority to approve comments in this heichel.",
                code: "NO_AUTH"
            });
        }

        // Path to the submitted comment
        const submittedCommentPath = `${sp}/heichelos/${heichelId}/comments/submitted/all/${commentId}`;
        const submittedComment = await $i.db.get(submittedCommentPath);

        if (!submittedComment) {
            return er({
                message: "Submitted comment not found.",
                code: "NOT_FOUND",
		details: {
			submittedCommentPath		}
            });
        }

	var commentAliasId = null;
        // Extract fullPath and parent details
        var {
	     	aliasId,
		parentId,
		parentType,
		postId,
		content,
		dayuh
	} = submittedComment;
	if(aliasId && !commentAliasId) {
		commentAliasId = aliasId;
	}
        if (!parentId || !parentType || !commentAliasId ) {
            return er({
                message: "Invalid comment data. Missing ",
		details: {
			parentId,
			parentType,
			postId,
			commentAliasId,
		},
                code: "DATA_CORRUPT"
            });
        }
	if(parentType == "post") {
		postId = parentId;
	}

        var commentDataPath  = await getSubmittedCommentPath({
		parentType,
		heichelId,
		parentId,
		$i,
		postId,
		commentId,
		aliasId: commentAliasId
		
	})
	   
	    $i.$_POST.content = content;
	    $i.$_POST.dayuh = dayuh;
	    $i.$_POST.aliasId = aliasId;
	    var add = await addOrApproveComment({
		$i,
		parentType,
		parentId,
		userid,
		heichelId,
		aliasId,
		
		postId /**needed only if adding reply to comment in a larger post*/,
	   })
        // Remove the submitted comment from the submitted path
        var fullSubmittedPath = await $i.db.delete(submittedCommentPath);
	var detailedIndex = await $i.db.delete(commentDataPath);
	    

        return {
            message: "Comment approved and moved to its parent.",
            details: {
                commentId,
             
		deleted: {
			fullSubmittedPath,
			detailedIndex

		},
		added: add
            }
        };
    } catch (e) {
        return er({
            message: "Issue approving comment.",
            details: e.stack
        });
    }
}

/**
 * Get all submitted comments needing approval for a heichel.
 * @param {Object} params - The parameters for retrieving comments.
 * @param {Object} params.$i - The database interaction object.
 * @param {string} params.heichelId - The ID of the heichel.
 * @param {string} params.aliasId - The alias ID of the admin user retrieving the comments.
 */
async function getSubmittedComments({ $i, heichelId, aliasId }) {
    try {
        
	if(!aliasId)
		aliasId = $i.$_GET.aliasId
        // Verify the admin user has the authority to view submitted comments in this heichel
        const isAuthorized = await verifyHeichelAuthority({ heichelId, aliasId, $i });
        if (!isAuthorized) {
            return er({
                message: "You don't have the authority to view submitted comments in this heichel.",
                code: "NO_AUTH"
            });
        }

        // Path to submitted comments
        const submittedCommentsPath = `${sp}/heichelos/${heichelId}/comments/submitted/all`;
        const submittedComments = await $i.db.get(submittedCommentsPath);

        if (!submittedComments || Object.keys(submittedComments).length === 0) {
            return {
                message: "No submitted comments found.",
                comments: []
            };
        }

        // Return the submitted comments
        return {
            message: "Submitted comments retrieved successfully.",
            comments: submittedComments
        };
    } catch (e) {
        return er({
            message: "Issue retrieving submitted comments.",
            details: e.stack
        });
    }
}

/**
 * Deny a submitted comment.
 * @param {Object} params - The parameters for denial.
 * @param {Object} params.$i - The database interaction object.
 * @param {string} params.heichelId - The ID of the heichel.
 * @param {string} params.aliasId - The alias ID of the admin user denying the comment.
 * @param {string} params.commentId - The ID of the comment to deny.
 */
// Deny comment function
async function denyComment({
    $i,
   
    heichelId,
    aliasId,
    commentId,

	userid
}) {
    try {
	var owns = await verifyAliasOwnership(
		aliasId,
		$i,
		userid
	);
	if (!owns) {
		return er({
			message: "You don't have permission to post as this alias.",
			details: {
				aliasId,
				userid
			}
		});
	}
        if(!postId) postId=$i.$_POST.postId;
	if(!aliasId)
		aliasId = $i.$_GET.aliasId
        // Verify the admin user has the authority to view submitted comments in this heichel
        const isAuthorized = await verifyHeichelAuthority({ heichelId, aliasId, $i });
        if (!isAuthorized) {
            return er({
                message: "You don't have the authority to view submitted comments in this heichel.",
                code: "NO_AUTH"
            });
        }        // Define paths for comment's data and alias's submitted comment list
        const fullPath = `${sp}/heichelos/${heichelId}/comments/submitted/all/${commentId}`;
	var submittedComment = await $i.db.get(fullPath, {
		propertyMap:  { awtsmoosDayuh: {
			fullPath: true,
			parentId: true,
			parentType: true,
			postId: true,
			commentAliasId
		}}	
	})
	// Extract fullPath and parent details
        var { awtsmoosDayuh: {
		
		parentId,
		parentType,
		postId,
		commentAliasId
	} = {} } = submittedComment;
	const submittedPath = await getSubmittedCommentPath({
		parentType,
		heichelId,
		parentId,
		$i,
		postId,
		commentId,
		aliasId: commentAliasId		
	})
       var submitted=await $i.db.delete(submittedPath);
        
        

        // Delete the actual comment reference from the all comments list
        var full = await $i.db.delete(fullPath);

        return {
            success: true,
            message: "Denied and deleted comment reference successfully!",
		deleted: {
			submitted,
			full

		}
        };
    } catch (e) {
        return er({
            message: "Issue denying/deleting comment",
            details: e.stack
        });
    }
}
async function getSubmittedCommentPath({
	parentType = "post",
	heichelId,
	parentId,
	postId,
	commentId,
	aliasId,
	$i

}) {
	var db = $i.db;
	// Step 1: Determine `parentSeriesId`
	let parentSeriesId = null;
	// If the parent is a comment, verify `postId` is provided
	if (parentType == "comment" && !postId) {
		return er("postId is required when replying to a comment.");
	}
	var postPath = `${sp}/heichelos/${heichelId}/posts/${
		parentType === "post" ?
			parentId :
			postId
	}`;
	
	
	// Get `parentSeriesId` directly from the post

	const post = await db.get(postPath, {
		propertyMap: {
			parentSeriesId: true
		}
	});
	if (!post || !post.parentSeriesId) {
		return er({
			message: "Invalid parent post or missing parentSeriesId.",
			details: {
				postPath,
				post
			}
		});
	}
	parentSeriesId = post.parentSeriesId;

	
	

	const subPath = parentType === "post" ?
		`/atPost/${parentId}/${commentId}` :
		`/atComment/${parentId}/${commentId}`;
	return `${sp}/heichelos/${heichelId}/comments/submitted/${aliasId}/atSeries/${parentId}/comment/${commentId}`;


}

async function updateAllCommentIndexes({
	$i,
	aliasId,
	heichelId,
	parentId,
	postId /**needed only if adding reply to comment in a larger post*/,
	userid
}) {
	$i.response.setHeader('Transfer-Encoding', 'chunked') // Important for streaming
	$i.response.setHeader('Connection', 'keep-alive');
	var t = $i.$_POST.testStreaming;
	if(t) {
		
		for(var i = 0; i < 9; i++) {
			await new Promise(r =>(setTimeout(() => {r()}, 300)));
			$i.response.write("WOW "+ i);
		}
		$i.response.end("LOL");
		return
	}
	try {
		var opts = myOpts($i)
		var owns = await verifyAliasOwnership(
			aliasId,
			$i,
			userid
		);
		if (!owns) {
			return er({
				message: "You don't have permission to post as this alias."
			});
		}
		var parentType = $i.$_POST.parentType;
		var link = parentType == "post"  ?
			"atPost" : parentType == "comment" ? "atComment"
			: null;
		if(!link) {
			return er({
			    message:"You need to supply a parent type",
			    code:"MISSING_PARAMS",
			    detail: "parentType"
			});
		}

		if(parentId) {
			var indexesDone = await updateCommentIndexesAtParent({
				parentId,
				$i,
				aliasId,
				parentType,
				heichelId,
				userid
			});
			return {
				success: {
					indexesDone,
					parentId,
					parentType
				}
			}
		}
		var getParentIDsPath =  `${
		        sp
		    }/heichelos/${
		        heichelId
		    }/comments/${link}`;
		var parentIDs = await $i.db.get(getParentIDsPath, opts);
		if(!Array.isArray(parentIDs)) {
			return er({
				message: "Did not get array of IDs of parents",
				code: "NO_PARENT_IDs",
				detail: parentIDs
			})
		}
		var parentsDone = [];
		for(var parentId of parentIDs) {
			var indexesDone = await updateCommentIndexesAtParent({
				parentId,
				$i,
				aliasId,
				parentType,
				userid,
				heichelId
			});
			parentsDone.push({
				parentId,
				parentType,
				aliasId,
				indexesDone
			})
		}
		return parentsDone;
	} catch(e) {
		return er({
			message: "Internal update index error",
			details: e+"",
			code: 501
		})
	}
}

async function updateCommentIndexesAtParent({
	$i,
	aliasId,
	parentId,
	parentType,
	postId /**needed only if adding reply to comment in a larger post*/,
	heichelId,
	userid
}) {
	var link = parentType == "post"  ?
		"atPost" : parentType == "comment" ? "atComment"
		: null;
	if(!link) {
		return er({
		    message:"You need to supply a parent type",
		    code:"MISSING_PARAMS",
		    detail: "parentType"
		});
	}
	
	var idPath = `${
		sp
	}/heichelos/${
		heichelId
	}/comments/${link}/${
		parentId
	}/author/${
		aliasId
	}`;
	var opts = myOpts($i)
	var IDs = await $i.db.get(idPath, opts);
	if(!Array.isArray(IDs)) {
		return er({
			message: "Did not get array of IDs",
			detail: IDs
		})
	}
	var indexesDone = [];
	for(var id of IDs) {
		var index = await addCommentIndexToAlias({
			parentId,
			heichelId,
			parentType,
			$i,
			userid,
			aliasId,
			commentId: id
		});
		indexesDone.push({index})
	}
	return {
		success: {
			indexesDone,
			parentType,
			parentId,
			aliasId
		}
	}
}

function verseSectionsCommentPath({
	aliasId,
	heichelId,
	seriesParentId,
	isPost,
	parentId,
	verseSection
}) {
	if(!verseSection && verseSection !== 0) {
		verseSection = "root"
	}
	return `${
		sp
	}/aliases/${
		aliasId
	}/comments/heichel/${
		heichelId
	}/atSeries/${
		seriesParentId	
	}/${
		isPost ? 
		"atPost" + 
		"/" +
		parentId + "/root"
		: /*is reply to comment
			which also exists in a post.
			need to provide post ID in this case
		*/
		"atPost/" + postId + "/" +
		
		"atComment/"
		
		+ parentId
		/**
			so if its a reply
			to a comment, in a post, it would be
			/:heichelId/atSeries/:seriesId/atPost/:postId/atComment/:commentId <-the parent comment
			but if it's just a comment to the post itself 
			/:heichelId/atSeries/:seriesId/atPost/:postId/root/ <-a comment to post root directly
		**/
	}/verseSection/${
		verseSection/**
			posts and comments could have sections. 
			maybe he replied to a section of another comment etc
		**/
	}`
}
function makeCommentIndexPath({
	aliasId,
	heichelId,
	seriesParentId,
	isPost,
	commentId,
	parentId,
	verseSection
}) {
	return verseSectionsCommentPath({
		aliasId,
		heichelId,
		seriesParentId,
		isPost,
		parentId,
		verseSection
	}) + "/"+ commentId;
}

function getShtarPath({
	heichelId,
	parentId,
	link,
	aliasId,
	commentId
}) {
	return `${
		sp
	    }/heichelos/${
		heichelId
	    }/comments/${link}/${
		parentId
	    }/author/${
		aliasId
	    }/${
		commentId
	    }`;
}

function getVerseSectionPath({
	heichelId,
	parentId,
	link,
	aliasId,
	commentId = null,
	verseSection
}) {
	return `${
		sp
	}/heichelos/${
		heichelId	
	}/comments/${
		link
	}/${
		parentId
	}/verseSection/${
		verseSection
	}/author/${aliasId}${
		 commentId !== "null" ?
		"/"+commentId : ""
	}`;
	
}
async function addCommentIndexToAlias({
	parentId,
	parentType,
	userid,
	commentId,
	heichelId,
	postId /**needed only if adding reply to comment in a larger post*/,
	
	$i,
	aliasId/*author of comment*/,
	commentPostedAt=null
}) {
	
	var chaiOverride = $i.$_POST.chaiOverride;
	try {
		
		if(!commentId) {
			return er({
				message:"You need to supply a commentId",
				code:"MISSING_PARAMS",
				details: "commentId"
			    
			});
		
		}
		var owns = await verifyAliasOwnership(
			aliasId,
			$i,
			userid
		);
		if (!owns) {
			return er({
				message: "You don't have permission to post as this alias.",
				details: {
					aliasId,
					userid
				}
			});
		}

		
	
		var link = parentType == "post" ?
			"atPost" : parentType == "comment" 
				? "atComment" : null;
		if(!link) return er({
		    message:"You need to supply a parent type",
		    code:"MISSING_PARAMS"
		    
		});

		
		var isPost = parentType == "post";
		if(isPost) {
			postId = parentId;
		} else if(!postId) {
			return er({
				message: "If you're commenting on another comment, need to provide postId",
				code: "MISSING_PARAMS",
				details: "postId"
			})	
		}

		var seriesParentId /*only if we're commenting on a post*/
		var post = await $i.db.get(
			`${
				sp
			 }/heichelos/${
				heichelId	
			}/posts/${
				parentId/*postID*/	
			}`, {
				propertyMap: {
					parentSeriesId:true	
				}
			}
		);
		seriesParentId = post.parentSeriesId;
		if(!seriesParentId) {
			return er({
				message: "That post has no series parent, not even root!",
				code: "NO_PARENT",
				details: {
					parentType,
					parentId,
					post
				}
			})
		}
		
		var overrodeChai = null;
		var shtarPath = getShtarPath({
			heichelId,
			parentId,
			link,
			aliasId,
			commentId
		})
		
		if(chaiOverride) {
		    var chaiPath = `${
		        sp
		    }/heichelos/${
		        heichelId
		    }/comments/chai/${
		        commentId
		    }`;
			var shtar = await $i.db.get(chaiPath);
			try {
				var wr = await $i.db.write(shtarPath, shtar)
				overrodeChai = wr;
				/*$i.response.write(JSON.stringfiy({
					doingStuff: {
						wr, commentId, time:Date.now(),
						parentId,
						parentType,
						heichelId
					}
				}))*/
			} catch(e) {
				return er({
					message: "Couldn't override CHAI",
					details: e.stack
				})
			}
		}
		
		var comment = await $i.db.get(shtarPath, {
			propertyMap: {
				dayuh: {
					verseSection: true
				}
			}
		});
		
		if(!comment) {
			return er({
				message: "Comment not found",
				detail: commentId,
				shtarPath,
				comment,
				commentPostedAt
			})
		}
		
		var verseSection = comment?.dayuh?.verseSection;
		if(!verseSection && verseSection !== 0) {
			verseSection = "root";
		}

		/**
			gets all 
   			verseSection comments
      			that THAT alias made
  		**/
		
		
		var commentPath = makeCommentIndexPath({
			aliasId,
			heichelId,
			parentId,
			seriesParentId,
			isPost,
			commentId,
			verseSection
		})

		/**
			how many authors 
   			exist in each verse section
  		**/
		var numVerses = verseSectionsCommentPath({
			aliasId,
			heichelId,
			seriesParentId,
			isPost,
			parentId,
			verseSection
		});
		var num = await $i.db.get(numVerses)
		var count = num?.length || 0;
		count++;
		var versesInParent = getVerseSectionPath({
			heichelId,
			parentId,
			link,
			aliasId,
			commentId,
			verseSection
		});
		 var authorsOfVerseSection = `${
			sp
		}/heichelos/${
			heichelId	
		}/comments/${
			link
		}/${
			parentId
		}/verseSection/${
			verseSection
		}/author`;
		var verseSectionAtParentIndex = await $i.db.write(versesInParent);
		var aliasIndex = await $i.db.write(commentPath);
		return {
			success: {
				message: "Made comment index",
				parentId,
				parentType,
				commentId,
				verseSection,
				aliasId,
				verseSectionAtParentIndex,
				versesInParent,
				aliasIndex
			}
		}
	} catch(e) {
		return er({
			message: "Internal comment index error",
			details: e.stack
		})
	}
	
}


/**
 * 
 * @method editComment
 * request: PUT
 * requires: aliasId of commenter 
 *  content text/html OR dayuh / sections.
 * 
 * optional: dayuh -> sub section id
 * Also needs: 
 *  parentType: "post or comment",
 *  parentId
 * 
 * 
 */
async function editComment({
	$i,
	parentType = "post",
	parentId,
	heichelId,
	aliasId/*must be the author*/,
	commentId,
	userid,
	postId /**needed only if adding reply to comment in a larger post*/ ,
}) {
    var aliasId = $i.$_PUT.aliasId;
    var ver = await verifyHeichelAuthority({
        heichelId,
        
        aliasId,
        $i
    });
    if(!ver) {
        return er({
            message:
            "You don't have authority to post to this heichel",
            code:"NO_AUTH"
            
        });
    }

    if(!parentType) {
        parentType = $i.$_PUT.parentType
    }

    if(!parentId) {
        parentId = $i.$_PUT.parentId
    }
   if(!commentId)
   	commentId = $i.$_PUT.commentId;
   if(!commentId) {
	return er({
		message: "Missing commentId"
	})
   }

    
    var parent;
    if(parentType == "post") {
        /*adding comment to post.
        need to check if it exists*/
        var path = `${
            sp
        }/heichelos/${
            heichelId
        }/posts/${
            parentId
        }`
        parent = await $i.db.access(path);
        if(!parent) {
            return er({
                message: "Post parent not found",
                code: "PARENT_NOT_FOUND",
                details: {
                    post: parentId,
                    heichelId: heichelId,
                    path
                }
            })
        }
    } else if(parentType == "commment") {
        /**TODO add comment to comment */
    }

    if(!parent) {
        return er({
            message: "No parent",
            code: "PARENT_NOT_FOUND"
        })
    }

    var myId = commentId;
    var content = $i.$_PUT.content;
    var dayuh = $i.$_PUT.dayuh;
    var link = parentType == "post" ? "atPost" : "atComment"
    var existingPath = getCommentToPostPath({
		heichelId,
		link,
		parentId,
		aliasId,
		commentId: myId
	})
    //get existing comment;
    var existing = await $i.db.access(existingPath);
    if(!existing) {
        return er({
            message: "That comment wasn't found",
            code: "COMMENT_NOT_FOUND",
            details: {
                commentId,
                heichelId
            }
        })
    }
	
    var shtar = {};
    var printFull = $i.$_PUT.printFull
    var fields = {}
    if(content && typeof(content) == "string") {
        shtar.content = content;
        fields.content = true
    }

    if(dayuh && typeof(dayuh) == "object") {
	/*var day = existing?.dayuh;
	if(day && typeof(dayuh) == "object") {
		shtar.dayuh = {
			...day,
			...dayuh
		}
	} else*/
        shtar.dayuh = dayuh;
        fields.dayuh = true
    } else {
	fields.whatIsDayuh = dayuh;
    }

    
    var cm = await $i.db.write(existingPath, shtar);


    return {
        message: "Edited comment!",
        details: {
            id: myId,
            fieldsWritten: fields,
            paths: {
                wrote: cm,
            
                
            },
            shtar: printFull ? shtar : Object.keys(shtar)
        }
    }
}
/**
 * 
 * @method getComments (IDs)
 of all authors at specific post 
 (or parent comment) OR 
 gets all comments IDs of alias,
 depending on what's provided.

 after the IDs are retrieved OR mapped data, 
 must then call getComment with specific ID to
 get details.
 * request: GET
 * 
 */
async function getComments({
    $i,
    parentType = "post",
    parentId,
    heichelId,
    aliasParent = null
	}) {
	var aliasId
	try {
		var opts = myOpts($i)
		var map = $i.$_GET.map;
		var count = $i.$_GET.count;
		var postPar = $i.$_GET.parentType;
		if(!aliasParent) aliasParent = $i.$_GET.aliasParent || 
			$i.$_GET.aliasId;
		aliasId = aliasParent
		if(postPar) {
			parentType = postPar;	
		}
		if(!parentType) parentType = "post"
		if(!parentId) parentId = $i.$_GET.parentId;
		if(!parentId) {
			return er({
				message: "need parent ID"
			})
		}
	
		if(!parentType) {
			return er({
				message: "need parent type"
			})
		}
		
	    /**
	     * if not alias parent then
	     * we get all ALIAS IDs for that
	     * parent, not the comment IDs themselves.
	     * 
	     * If aliasParent is provided we get all
	     * COMMENT IDs from that alias in that parent
	     */
	
		var subPath = parentType == "post" ? "atPost"
	        : "atComment";
		var link = subPath
		var verseSection = $i.$_GET["verseSection"]
		if(!verseSection && verseSection !== 0) {
			verseSection = null	
		}
	    if(!aliasParent) {
		/*returns all authors for entire post*/
	        var pth = `${
	            sp
	        }/heichelos/${
	            heichelId
	        }/comments/${subPath}/${
	            parentId
	        }/author`;
	
		/*gets all authors for specific verse section in post*/
		var authorsOfVerseSection = getAliasesAtVerseSectionPath({
			heichelId,
			subPath,
			parentId,
			verseSection
		});
		    
		var otherPath = getVerseSectionPath({
			heichelId,
			parentId,
			link: subPath,
			aliasId,
			verseSection
		}) 
		
	        var aliases = [];
		if(verseSection !== null) {
			aliases = await $i.db.get(authorsOfVerseSection, opts);
		} else {
			aliases = await $i.db.get(pth, opts);	
		}
	
	        if(!aliases) return er({
	            message: "no comments yet!",
	            details: {
	                path: pth,
	                heichelId,
	                parentId,
	                parentType,
	                subPath
	            }
	        })

		if(!map) {
	        	return !count ? aliases : aliases.length
		}
		var realAliases = [];
		for(var al of aliases) {
			var commentsOfAlias = await getCommentsOfAlias({
				$i,
				heichelId,
				subPath,
				parentId,
				parentType,
				aliasId: al,
				map, 
				count,
				verseSection,
				opts
			});
			if(commentsOfAlias.length) {
				var al = {
					comments: commentsOfAlias, id:al
				}
				realAliases.push(al);
			}
		}
		return !count ? realAliases : (realAliases.length + "");
		
	    } else {
	        var commentsOfAlias = await getCommentsOfAlias({
			$i,
			heichelId,
			subPath,
			parentId,
			parentType,
			aliasId,
			map, 
			count,
			verseSection,
			opts
		});
		return commentsOfAlias;
	    }
	} catch(e) {
		return er({
			message: "error getting comments",
			stack: e.stack,
			details: {
				aliasId,
				parentType,
				parentId,
				heichelId
			}
		})
	}
    return "getting comments!"
}

async function getCommentsOfAlias({
	$i,
	heichelId,
	subPath,
	parentId,
	parentType,
	aliasId,
	map, 
	count,
	verseSection,
	opts
}) {
	var aliasParent = aliasId;
	/**
	 * this means we get the specific comment IDs of that alias
	 */

	    
	var commentPath = null;
	var shtarPath = getAliasCommentsPath({
		heichelId,
		subPath,
		parentId,
	
		aliasId
	});
	if(verseSection !== null) {
		var parent = null;
		if(parentType == "post") {
			parent = await $i.db.get(
				sp + `/heichelos/${
					heichelId
				}/posts/${
					parentId
				}`, {
					propertyMap: {
						parentSeriesId: true	
					}
				})
			
		}
		if(!parent) {
			return er ({
				message: "No parent with that id!",
				details: {
					parentId,
					parentType,
					aliasParent,
					heichelId
				}
			})
		}
	
		var parentSeries = parent.parentSeriesId;
	
		if(!parentSeries) {
			return er ({
				message: "No series in parent!",
				details: {
					parentId,
					parent,
					parentType,
					aliasParent,
					heichelId
				}
			})
		}
		commentPath = getCommentIDsAtVerseSectionPath({
			aliasId,
			heichelId,
			parentSeries,
			link: subPath,
			parentId,
			verseSection
		})
	} else {
	/**
		if verse section is supplied we get
		get all comments of THAT alias for
		that verse sectoin

		if not we get all of their comments for 
		that post
	**/
	
			
		
		commentPath = shtarPath
	}
	var chaiPath = cid => commentPath + "/" + cid;
	var commentIDs = await $i.db.get(commentPath, opts);
	if(!commentIDs) return [];

	if(!map) {
		return count ? commentIDs.length : commentIDs	
	}
	var mappedComments = [];
	for(var id of commentIDs) {
		var mainCommentPath = getCommentPath({
			heichelId,
			subPath,
			parentId,
			aliasId,
			commentId: id
		});
		var mainComment = await $i.db.get(mainCommentPath, opts);
		if(!mainComment) continue;
		mainComment.id = id;
		mappedComments.push(mainComment);
	}
	
	return count ? mappedComments.length : mappedComments
}

function getCommentIDsAtVerseSectionPath({
	aliasId,
	heichelId,
	parentSeries,
	link,
	parentId,
	verseSection
}) {
	return `${
			sp
	}/aliases/${
		aliasId
	}/comments/heichel/${
		heichelId
	}/atSeries/${
		parentSeries
	}/${link}/${
		parentId
	}/root/verseSection/${
		verseSection
	}`
}
function getAliasesAtVerseSectionPath({
	heichelId,
	subPath,
	parentId,
	verseSection
}) {
	return `${
		sp
	}/heichelos/${
		heichelId	
	}/comments/${
		subPath
	}/${
		parentId
	}/verseSection/${
		verseSection
	}/author`
}

function getAliasCommentsPath({
	heichelId,
	subPath,
	parentId,

	aliasId,
}) {
	return `${
	    sp
	}/heichelos/${
	    heichelId
	}/comments/${subPath}/${
	    parentId
	}/author/${
	    aliasId
	}`;
}

function getCommentPath({
	heichelId,
	subPath,
	parentId,
	aliasId,
	commentId
}) {
	return getAliasCommentsPath({
		heichelId,
		subPath,
		parentId,
		aliasId,
	}) + `/${commentId}`
}
/**
 * 
 * @method addCommentToPost
 * request: POST
 * requires: aliasId of commenter 
 *  content text/html OR dayuh / sections.
 * 
 * optional: dayuh -> sub section id
 * Also needs: 
 *  parentType: "post or comment",
 *  parentId
 * 
 * 
 */
async function getComment({
	$i,
	commentId,
	heichelId,
	parentType,
	parentId,
	aliasId
}) {

	if(!aliasId) aliasId = $i.$_GET.aliasId;
	if(!aliasId) return er({
		message: "No aliasId Provided!"	
	})
	if(!parentType) parentType = $i.$_GET.parentType;
	if(!parentId) parentId = $i.$_GET.parentId;
	if(!parentId) return er({
		message: "No parentId Provided!"	
	})
	if(!parentType) return er({
		message: "No parentType Provided!"	
	})
	var opts = myOpts($i);
	var subPath = parentType == "post" ? "atPost"
	: "atComment";
    try {
        var chaiPath = getCommentPath({
		heichelId,
		subPath,
		parentId,
		aliasId,
		commentId
	});
        var cm = await $i.db.get(chaiPath, opts);
        if(!cm) {
            return er({
                message:"Couldn't find that comment!",
                code: "NO_COMMENT",
                details: {
                    commentId,
                    heichelId
                }
            })
        }
        return cm;
    } catch(E) {
        return er({
            message:"Server error",
            details: E
        })
    }

    
    return "getting comment!"
}


async function deleteAllCommentsOfParent({
    $i,
 
    heichelId,
    parentId,
 
    parentType
}) {
    var aliasId = $i.$_POST.aliasId || 
        $i.$_DELETE.aliasId;
    var ver = await verifyHeichelAuthority({
        heichelId,
        
        aliasId,
        $i
    });
    if(!ver) {
        return er({
            message:
            "You don't have authority to post to this heichel",
            code:"NO_AUTH"
            
        });
    }
	var link = parentType == "post" ?
		"atPost" : parentType == "comment" ?
		"atComment" : null;
	if(!link) return er({
		message: "No parent type provided",
		code: "MISSING_PARAMS",
		detail: "parentType"
	})
	
	var authors = `${
	    sp
	    }/heichelos/${
		heichelId
	    }/comments/${link}/${
		parentId
	    }/author/`;
	var opts = myOpts($i)
	var authorInfo = await $i.db.get(authors, opts);
	if(!authorInfo || !Array.isArray(authorInfo)) {
	    return er({
		message: "No comments found for that author"
		,
		details: {
		    heichelId,
		    parentId
		}
	    })
	}
	
	var results = [];
	for(var i = 0; i < authorInfo.length; i++) {
	    var author = authorInfo[i];
	    var res = await deleteAllCommentsOfAlias({
		$i,
		heichelId,
		parentId,
		author,
		parentType
	    });
	    results.push({
		id: author,
		result: res
	    })
	}
	return {
	    deleteStatus: results
	}
    
}

async function deleteAllCommentsOfAlias({
    $i,
 
    heichelId,
    parentId,
    author,
    parentType
}) {
    var aliasId = $i.$_POST.aliasId || 
        $i.$_DELETE.aliasId;
    var ver = await verifyHeichelAuthority({
        heichelId,
        
        aliasId,
        $i
    });
    if(!ver) {
        return er({
            message:
            "You don't have authority to post to this heichel",
            code:"NO_AUTH"
            
        });
    }
	var link = parentType == "post" ?
		"atPost" : parentType == "comment" ?
		"atComment" : null;
	if(!link) return er({
		message: "No parent type provided",
		code: "MISSING_PARAMS",
		detail: "parentType"
	})
    
        var authors = `${
            sp
            }/heichelos/${
                heichelId
            }/comments/${link}/${
                parentId
            }/author/${
                author
            }`;
	var opts = myOpts($i)
        var authorInfo = await $i.db.get(authors, {
            pageSize:1000000
        });
        if(!authorInfo || !Array.isArray(authorInfo)) {
            return er({
                message: "No comments found for that author"
                ,
                details: {
                    author,
                    heichelId,
                    parentId
                }
            })
        }

        var results = [];
        for(var i = 0; i < authorInfo.length; i++) {
            var c = authorInfo[i];
            var res = await deleteComment({
                $i,
                commentId: c,
                heichelId
            });
            results.push({
                id: c,
                result: res
            })
        }
        return {
            deleteStatus: results
        }
    
}

async function deleteCommentIndex({
	$i,
	commentId,
	parentId,
	verseSection,
	heichelId,
	aliasId,
	parentType
}) {
	var link = parentType == "post" ?
		"atPost" : parentType == "comment" ?
		"atComment" : null;
	
	if(!link) return er({
		message: "No parent type provided",
		code: "MISSING_PARAMS",
		detail: "parentType"
	})

	var parentSeriesId = null;
	if(parentType == "post") {
		var post = await $i.db.get(`/social/heichelos/${
				heichelId
			}/posts/${parentId}`, {
			propertyMap: {
				parentSeriesId: true
				}
			});
		parentSeriesId = post.parentSeriesId
		if(!parentSeriesId) {
			return er({
				message: "Couldnt find parent",
				code: "NO_PAR",
				details: {
					parentType,
					parentId,commentId,
					heichelId,
					aliasId
				}
			})
		}
	}
	var path = `${
		sp
	}/aliases/${
		aliasId
	}/comments/${link}/${
		parentId
	}/verseSection/${
		verseSection
	}/${
		commentId
	}`;
	var commentPath = makeCommentIndexPath({
		aliasId,
		heichelId,
		seriesParentId:parentSeriesId,
		isPost: parentType=="post",
		
		commentId,
		parentId,
		verseSection
	})
	

	/**
		how many authors 
		exist in each verse section
	**/

	var numVerses = verseSectionsCommentPath({
		aliasId,
		heichelId,
		seriesParentId:parentSeriesId,
		isPost:parentType == "post",
		
		verseSection
	});
	var num = await $i.db.get(numVerses)
	var count = num?.length || 0;
	if(count > 0) count--;
	var verseSectionPath = getVerseSectionPath({
		heichelId,
		parentId,
		getVerseSectionPath,
		link,
		aliasId,
		verseSection
	})
	var done = {}
	done.deletedVerseSection = await $i.db.delete(verseSectionPath);/*
	if(count > 0)
		done.verseSectionAtParentIndex = await $i.db.write(verseSectionPath, count);
	else {
		
	}*/
	done.commentPathDeleted = await $i.db.delete(commentPath);
	return done 
	
}
async function deleteComment({
	$i,
	commentId,
	heichelId,
	parentId,
	parentType,
	aliasId
    
}) {
	
    if(!aliasId) aliasId = $i.$_POST.aliasId || 
        $i.$_DELETE.aliasId;
    if(!parentId) {
	parentId = $i.$_POST.parentId || 
        $i.$_DELETE.parentId;
    }
   if(!parentType) {
	parentType = $i.$_POST.parentType || 
        $i.$_DELETE.parentType;
    }
    var ver = await verifyHeichelAuthority({
        heichelId,
        
        aliasId,
        $i
    });
    if(!ver) {
        return er({
            message:
            "You don't have authority to post to this heichel",
            code:"NO_AUTH",
		details: aliasId,parentId,parentType,heichelId
            
        });
    }
	
	if(!parentId) return er({
		message: "No parent type provided",
		code: "MISSING_PARAMS",
		detail: "parentType"
	})
	var link = parentType == "post" ?
		"atPost" : parentType == "comment" ?
		"atComment" : null
	if(!link) return er({
		message: "No parent type provided",
		code: "MISSING_PARAMS",
		detail: "parentType"
	})
    try {
        var pth = `${
		sp
	}/heichelos/${
		heichelId
	}/comments/${link}/${
		parentId
	}/author/${
		aliasId
	}/${commentId}`;
        var res = await $i.db.get(pth, {
                propertyMap: {
                    author: true, 
                    parentId: true,
			dayuh: {
				verseSection: true	
			}
                }
            }
        );
	var author = res?.author;
	var parentId = res?.parentId;
	var dayuh = res?.dayuh;
        if(!author || !parentId) {
            return er({
                message: "Didn't delete, couldn't find author or parentId",
                code: "NO_AUTHOR_OR_PARENTID",
                details: {
                    path:pth,
                    commentId,
                    author, parentId,
                    heichelId
                }
            })
        }
	    var verseSection = dayuh?.verseSection;
	    if(!verseSection && verseSection !== 0) {
		verseSection = "root"    
	    }
        var delPost = null;
        var rest;
        var restPath = null;
        var authors = `${
            sp
            }/heichelos/${
                heichelId
            }/comments/${link}/${
                parentId
            }/author/${
                author
            }`
	var delIndex = null;
        var authPath = authors+`/${
                commentId
            }`
        try {
            delIndex = await  deleteCommentIndex({
		commentId,
		aliasId,
		heichelId,
		parentId,
		verseSection,
		parentType,
		$i
		    
		    
	    })
	if(delIndex.error) {
		return  er(delIndex.error)
	}
            delPost = await $i.db.delete(authPath);
            rest = await $i.db.get(authors)
            if(!rest || rest.length == 0) {
                restPath = await $i.db.delete(authors)
            }
            
        } catch(e) {
            return er({
                message: "Problem",
                error:e.stack
            })
        }

        var chaiPath
        var delChai;
        /*try {
            chaiPath = `${
                sp
            }/heichelos/${
                heichelId
            }/comments/chai/${
                commentId
            }`;
            delChai  = await $i.db.delete(chaiPath)
        } catch(e) {
            return er({
                message: "Issue",
                error: e
            })
        }*
	TODO fix delete path
	*/

        return {
            success: {
                deleted: {
			delIndex,
                    entireAuthorSection: {
                        restPath,
                        rest
                    },
                    chai: delChai,
                    chaiPath,
                    post: delPost,
                    postPath: authPath
                }
            }
        }
     } catch(e) {
        return er({
            message: "Problem",
            error: e.stack
        })
    }
}
