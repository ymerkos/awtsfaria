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
    /**
     * 
     * leave a comment directly on a post or get comments of post
     */
    "/heichelos/:heichel/post/:post/comments": async vars => {
        if($i.request.method == "GET") {
            return await getComments({
                $i,
                heichelId: vars.heichel,
                parentType: "post",
                parentId: vars.post
            });
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