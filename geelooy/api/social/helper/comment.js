/**
 * B"H
 */


module.exports = {
    addCommentToPost
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

async function addCommentToPost({
    $i,
    postID,
    heichelID
}) {
    return "Adding comment!"
}