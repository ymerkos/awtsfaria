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
  addCommentToPost
} = require("./helper/index.js");

var {
	loggedIn,
	er
} = require("./helper/general.js");

module.exports = ({
	$i,
	userid,
} = {}) => ({
    "/heichelos/:heichel/post/:post/comment": async vars => {
        return await addCommentToPost({
            $i,
            heichelID: vars.heichel,
            postID: vars.post
        })
    },
    
});