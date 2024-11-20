/*B"H*/


var {
	NO_LOGIN,
	sp,
   
  
  } = require("./helper/_awtsmoos.constants.js");


var {
	addComment,
	getComments,
	getComment,
	editComment,
	deleteComment,
	er,
	deleteAllCommentsOfAlias,
	deleteAllCommentsOfParent,
	updateAllCommentIndexes,	
	addCommentIndexToAlias,
	
	denyComment,
	getSubmittedComments,
	approveComment
} = require("./helper/index.js");

var {
	loggedIn,
	er,
	 myOpts
} = require("./helper/general.js");



module.exports = ({
	$i,
	userid,
} = {}) => ({
	//getSubmittedComments
  "/heichelos/:heichel/submittedComments": async vars => {
        if($i.request.method == "GET") {
            return await getSubmittedComments({
		heichelId: vars.heichel,
		$i
	    })
        } 
    },
    "/heichelos/:heichel/submittedComments/approve": async vars => {
	var commentId = $i.$_POST.commentId || 
		$i.$_GET.commentId;
	if(!commentId) {
		return er({
			message:"Need commentId",
			code: "MISSING_ARGS"
		})
	}
	var aliasId = $i.$_POST.aliasId ||
		$i.$_GET.aliasId;
	if(!aliasId) {
		return er({
			message:"Need aliasId",
			code: "MISSING_ARGS"
		})
	}
        if($i.request.method == "POST") {
            return await approveComment({
		heichelId: vars.heichel,
		$i,
		userid,
		aliasId,
		commentId
	    })
        } 
    },
"/heichelos/:heichel/submittedComments/deny": async vars => {
	var commentId = $i.$_POST.commentId || 
		$i.$_GET.commentId;
	if(!commentId) {
		return er({
			message:"Need commentId",
			code: "MISSING_ARGS"
		})
	}
	var aliasId = $i.$_POST.aliasId ||
		$i.$_GET.aliasId;
	if(!aliasId) {
		return er({
			message:"Need aliasId",
			code: "MISSING_ARGS"
		})
	}
        if($i.request.method == "POST") {
            return await denyComment({
		heichelId: vars.heichel,
		$i,
		aliasId,
		userid,
		commentId
	    })
        } 
    },
  /**
     * 
     * get all alias IDs that left a comment here
     */
    "/heichelos/:heichel/post/:post/comments/aliases": async vars => {
        if($i.request.method == "GET") {
            return await getComments({
                $i,
                heichelId: vars.heichel,
                parentType: "post",

                parentId: vars.post
            });
        } 
    },
    /**
     * 
     * leave a comment directly on a post or get comments of post,
     * organized by the alias who left the comment
     */
    "/heichelos/:heichel/post/:post/comments/": async vars => {
        if($i.request.method == "GET") {
            return er({
                BH:"B\"H",
                message: "Can't get all comments, need to get by alias. "
                +"To get all aliases that left comments, go to endpoint: "
                +"/heichelos/:heichel/post/:post/comments/aliases, then "
                +"to get all comments of that alias go to "
                + " /heichelos/:heichel/post/:post/alias/:alias/comments/ ",
                code: "WRONG_ENDPOINT",
                endpoints: {
                    aliases: 
                    "/heichelos/:heichel/post/:post/comments/aliases",
                    comments: 
                    "/heichelos/:heichel/post/:post/alias/:alias/comments/"
                }
            })
        } else if($i.request.method == "POST") {
            return await addComment({
                $i, 
                heichelId: vars.heichel,
                parentId: vars.post,
		userid,
                parentType: "post"
            })
        } else if($i.request.method == "PUT") {
            return await editComment({
                $i, 
                heichelId: vars.heichel,
                parentId: vars.post,
		userid,
                parentType: "post"
            })
        } else if($i.request.method == "DELETE") {
            try {
                return await deleteAllCommentsOfParent({
                    $i,
                    heichelId: vars.heichel,
                    parentId: vars.post,
                    parentType: "post"
                })
            }
            catch(e) { 
                return er({
                    message: "Couldn't delete!",
                    details:e+""
                })
            }
        }
    },
    /**
     * 
     * leave a comment directly on a post or get comments of post,
     * organized by the alias who left the comment
     */
    "/heichelos/:heichel/post/:post/comments/aliases/:alias": async vars => {
        if($i.request.method == "GET") {
            return await getComments({
                $i,
                heichelId: vars.heichel,
		userid,
                parentType: "post",
                aliasParent: vars.alias,
                parentId: vars.post
            });
        } else if($i.request.method == "POST") {
            return await addComment({
                $i,
                heichelId: vars.heichel,
                parentId: vars.post,
                aliasId: vars.alias,
                parentType: "post",
		userid
            })
        } else if($i.request.method == "DELETE") {
            return await deleteAllCommentsOfAlias({
                $i,
                heichelId: vars.heichel,
                parentId: vars.post,
                author: vars.alias,
                parentType: "post",
		userid
            })
        }
    },
    /**
     * 
     * get sub comments of a comment
     */
    "/heichelos/:heichel/comment/:comment/comments": async vars => {
        if($i.request.method == "GET") {
            return await getComments({
                $i,
                heichelId: vars.heichel,
                parentType: "comment",
                parentId: vars.comment
            });
        }
    },
    /**
     * leave a comment on another comment
     */
    "/heichelos/:heichel/comment/:comment": async vars => {
        if($i.request.method == "GET") {
            //get comment with that ID
            return await getComment({
                $i,
                heichelId: vars.heichel,
                commentId: vars.comment
            });
        } else if($i.request.method == "POST") {
            return await addComment({
                $i,
                heichelId: vars.heichel,
                parentId: vars.comment,
		userid,
                parentType: "comment"
            })
        } else if($i.request.method == "DELETE") {
            return await deleteComment({
                $i,
                heichelId:vars.heichel,
		userid,
                commentId: vars.comment
            })
        } else if($i.request.method == "PUT") {
            return await editComment({
                $i,
		userid,
                heichelId: vars.heichel,
                commentId: vars.comment
            })
        }
    },

    /**
     * leave a comment driectly
     * 
     * requires POST --> parentType & parentId
     */
    "/heichelos/:heichel/comments": async vars => {
        if($i.request.method == "GET") {
            //get comment with that ID
            return er({
                message: "POST only",
                more: "requires POST --> parentType parentId"
            })
        } else if($i.request.method == "POST") {
            return await addComment({
                $i,
                heichelId: vars.heichel,
		userid
                
            })
        }
    },

	/**
     * leave a comment driectly
     * 
     * requires POST --> parentType & parentId
     */
    "/aliases/:alias/comments": async vars => {
        if($i.request.method == "GET") {
           /**
		gets all comments of alias organized by heichel
    	**/
		return {TODO: "work in progress"}
        } else if($i.request.method == "POST") {
		/*updateAllCommentIndexes,	
		addCommentIndexToAlias*/
	}
    },
	/**
		POST
  		requires parentId
    			parentType
       			//commentId
 	**/
	"/heichelos/:heichel/aliases/:alias/commentsActions/addCommentIndexToAlias/comment/:comment": async vars => {
		if($i.request.method == "GET") {
			return {
				tried: {
					aliasId: vars.alias,
					commentId:vars.comment,
					heichelId: vars.heichel
				}
			}
		}
		if($i.request.method == "POST") {
			var parentId = $i.$_POST.parentId;
			var parentType =  $i.$_POST.parentType;
			//var commentId =  $i.$_POST.commentId
			if(!parentId || !parentType) {
				return er({
					message: "Missing params",
					details: ["parentId", "parentType", "commentId"],
					code: "MISSING_PARAMS"
				})
			}
			try {
				return await addCommentIndexToAlias({
					userid,
					aliasId: vars.alias,
					parentId,
					parentType,
					$i,
					commentId:vars.comment,
					heichelId: vars.heichel
				})
			} catch(e) {
				return er({
					message: "Error in adding",
					details: e+""
				})
			}
		}
	},
	/**
		POST
  		requires parentType;
    		optional parentId
      		if NOT supploied updates ALL for entire heichel
		if supplied only updates for that post
	**/
	"/heichelos/:heichel/aliases/:alias/commentsActions/updateAllCommentIndexes": async vars => {
		if($i.request.method == "GET") {
			return {
				message: "use POST",
				apiInfo: `POST
		  		requires parentType;
		    		optional parentId
		      		if NOT supploied updates ALL for entire heichel
				if supplied only updates for that post`.split("\t").join("")
			}
		}
		if($i.request.method == "POST") {
			var parentType =  $i.$_POST.parentType;
			var parentId = $i.$_POST.parentId;
			if(!parentType) {
				return er({
					message: "Missing params",
					details: [ "parentType"],
					code: "MISSING_PARAMS"
				})
			}
			try {
				return await updateAllCommentIndexes({
					userid,
					aliasId: vars.alias,
					$i,
					parentId,
					parentType,
					heichelId: vars.heichel
				})
			} catch(e) {
				return er({
					message: "Error in adding",
					details: e+""
				})
			}
		}
	},
})
