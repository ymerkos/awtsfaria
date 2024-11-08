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
	editComment
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
	userid,
	postId /**needed only if adding reply to comment in a larger post*/,
}) {
	try {
    var aliasId = $i.$_POST.aliasId;
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

    var chaiPath = `${
        sp
    }/heichelos/${
        heichelId
    }/comments/chai/${
        myId
    }`
    var cm = await $i.db.write(chaiPath, shtar);

    var atPost;

	
    var postPath = `${
        sp
    }/heichelos/${
        heichelId
    }/comments/${link}/${
        parentId
    }/author/${
        aliasId
    }/${
        myId
    }`

	
	var wrote = await $i.db.write(postPath);
    
    
	var index = await addCommentIndexToAlias({
		parentId,
		heichelId,
		parentType,
		postId,
		userid,
		aliasId,
		commentId: myId
	})
    return {
	message: "Added comment!",
	details: {
		id: myId,
		setCommentIndex: index,
		wrote: {
			parentId,
			aliasId,
			wrote
		},
		paths: {
			postPath,
			chaiPath,
		
		},
		
		dayuh
	}
    }
		
	} catch(e) {
		return er({
			message: "Issue adding comment",
			details: e+""
		})
	}
}

async function updateAllCommentIndexes({
	$i,
	aliasId,
	heichelId,
	parentId,
	postId /**needed only if adding reply to comment in a larger post*/,
	userid
}) {
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

async function addCommentIndexToAlias({
	parentId,
	parentType,
	userid,
	commentId,
	heichelId,
	postId /**needed only if adding reply to comment in a larger post*/,
	
	$i,
	aliasId/*author of comment*/
}) {
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
				code: "NO_PARENT"
			})
		}
		
	
		var chatPath = `${
		        sp
		    }/heichelos/${
		        heichelId
		    }/comments/chai/${
		        commentId
		    }`;
		var comment = await $i.db.get(chatPath, {
			propertyMap: {
				dayuh: {
					verseSection: true
				}
			}
		});
		
		if(!comment) {
			return er({
				message: "Comment not found",
				detail: commentId
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
		
		
		var commentPath = `${
			sp
		}/aliases/${
			aliasId
		}/comments/heichel/${
			heichelId
		}/atSeries/${
			seriesParentId	
		}/${
			isPost ? 
			link + 
			"/" +
			parentId + "/root"
			: /*is reply to comment
   				which also exists in a post.
       				need to provide post ID in this case
       			*/
			"atPost/" + postId + "/" +
			link/*atComment*/
			
			+ parentId
			/**
				so if its a reply
    				to a comment, in a post, it would be
				/:heichelId/atSeries/:seriesId/atPost/:postId/atComment/:commentId <-the parent comment
    				but if it's just a comment to the post itself 
				/:heichelId/atSeries/:seriesId/atPost/:postId/root/ <-a comment to post root directly
   			**/
		}/verseSection/${
			verseSection /**
				posts and comments could have sections. 
    				maybe he replied to a section of another comment etc
   			**/
		}/${
			commentId
		}`;

		/**
			how many authors 
   			exist in each verse section
  		**/
		var versesInParent = `${
			sp
		}/heichelos/${
			heichelId
		}/comments/${link}/${
			parentId
		}/verseSection/${
			verseSection
		}/author/${
			aliasId
		}`;
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
				aliasIndex
			}
		}
	} catch(e) {
		return er({
			message: "Internal comment index error",
			details: e+""
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
    commentId
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


    //get existing comment;
    var existing = await $i.db.get(`${
        sp
    }/heichelos/${
        heichelId
    }/comments/chai/${
        myId
    }`);
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
    var shtar = existing;

    var fields = {}
    if(content && typeof(content) == "string") {
        shtar.content = content;
        fields.content = true
    }

    if(dayuh && typeof(dayuh) == "object") {
        shtar.dayuh = dayuh;
        fields.dayuh = true
    }

    var chaiPath = `${
        sp
    }/heichelos/${
        heichelId
    }/comments/chai/${
        myId
    }`
    var cm = await $i.db.write(chaiPath, shtar);


    return {
        message: "Edited comment!",
        details: {
            id: myId,
            fieldsWritten: fields,
            paths: {
                wrote: cm,
                chaiPath,
                
            },
            shtar
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
	var opts = myOpts($i)
	var postPar = $i.$_POST.parentType;
	if(postPar) {
		parentType = postPar;	
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
    
    if(!aliasParent) {
        var pth = `${
            sp
        }/heichelos/${
            heichelId
        }/comments/${subPath}/${
            parentId
        }/author`
        var aliases = await $i.db.get(pth, opts);

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
	
        return aliases
	
    } else {
        /**
         * this means we get the specific comment IDs of that alias
         */

	var verseSection = $i.$_GET["verseSection"]
	if(!verseSection && verseSection !== 0) {
		verseSection = null	
	}
	/**
		if the verseSection param is there
  		we only get the comment(s) that are on that
    		verse section, by that author.
 	**/
	var commentPath = verseSection === null ?
		/*we get ALL*/
		`${
	            sp
	        }/heichelos/${
	            heichelId
	        }/comments/${subPath}/${
	            parentId
	        }/author/${
	            aliasParent
	        }` : 
		`${
			sp
		}/aliases/${
			aliasId
		}/comments/${link}/${
			parentId
		}/verseSection/${
			verseSection
		}`;
  
        var commentIDs = await $i.db.get(`${
            sp
        }/heichelos/${
            heichelId
        }/comments/${subPath}/${
            parentId
        }/author/${
            aliasParent
        }`, opts);
        if(!commentIDs) return [];
	
	var gm/*get meta data*/ = $i.$_GET.metadata ||
		$i.$_GET.propertyMap;
	if(!gm) 
        return commentIDs

	var metadataComments = []
	var chaiPath = (cid)=> `${
                sp
            }/heichelos/${
                heichelId
            }/comments/chai/${
                cid
            }`;
	for(var id of commentIDs) {
		try {
			var com = 
				await $i.db.get(chaiPath(id), {
					...opts

				})
			com.id=id
			metadataComments.push(com)
			

		} catch(e) {

		}

	}
	return metadataComments;
	
    }
    return "getting comments!"
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
  
}) {
    
    var opts = myOpts($i);
	
    try {
        var chaiPath = `${
            sp
        }/heichelos/${
            heichelId
        }/comments/chai/${
            commentId
        }`
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

async function deletecommentIndex({
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
	var commentPath = `${
		sp
	}/aliases/${
		aliasId
	}/comments/heichel/${
		heichelId
	}/${link}/${
		parentId
	}/verseSection/${
		verseSection
	}/${
		commentId
	}`;

	/**
		how many authors 
		exist in each verse section
	**/
	var versesInParent = `${
		sp
	}/heichelos/${
		heichelId
	}/comments/${link}/${
		parentId
	}/verseSection/${
		verseSection
	}/author/${
		aliasId
	}`;
	return await $i.db.delete(path);
	
}
async function deleteComment({
    $i,
    commentId,
    heichelId,
    
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
    try {
        var pth = `${
            sp
            }/heichelos/${
                heichelId
            }/comments/chai/${
                commentId
            }`
        var {
            author,
            parentId,
	    dayuh
        } = await $i.db.get(pth, {
                propertyMap: {
                    author: true, 
                    parentId: true,
			dayuh: {
				verseSection: true	
			}
                }
            }
        );
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
            delIndex = await  deletecommentIndex({
		commentId,
		aliasId,
		heichelId,
		parentId,
		verseSection,
		parentType,
		$i
		    
		    
	    })
            delPost = await $i.db.delete(authPath);
            rest = await $i.db.get(authors)
            if(!rest || rest.length == 0) {
                restPath = await $i.db.delete(authors)
            }
            
        } catch(e) {
            return er({
                message: "Problem",
                error:e+""
            })
        }

        var chaiPath
        var delChai;
        try {
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
        }

        return {
            success: {
                deleted: {
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
            error: JSON.stringify(e)
        })
    }
}
