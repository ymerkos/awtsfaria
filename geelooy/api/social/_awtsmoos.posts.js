/**
 * B"H
 * 
 * posts endpoints
 */


var {
	NO_LOGIN,
	sp,
    myOpts
  
  } = require("./helper/_awtsmoos.constants.js");

 var {
  addComment,
  getComments,
  getComment
} = require("./helper/index.js");

var {
	loggedIn,
	er
} = require("./helper/general.js");

module.exports = ({
	$i,
	userid,
} = {}) => ({
    "/asdfg": async () => {
        return "Hi there!"
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
                parentType: "post"
            })
        }
    },
    /**
     * 
     * leave a comment directly on a post or get comments of post,
     * organized by the alias who left the comment
     */
    "/heichelos/:heichel/post/:post/alias/:alias/comments/": async vars => {
        if($i.request.method == "GET") {
            return await getComments({
                $i,
                heichelId: vars.heichel,
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
                parentType: "post"
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
                parentType: "comment"
            })
        }
    },

    
    
});