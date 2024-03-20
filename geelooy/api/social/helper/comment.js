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
 */


/**
 * 
 * @method addCommentToPost
 * request: POST
 * requires: aliasId of commenter 
 */
async function addCommentToPost({
    $i,
    postID,
    heichelID
}) {
    var aliasId = $i.$_POST.aliasId;
    var ver = await verifyHeichelAuthority({
        heichelID,
        
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

    
    return "Adding comment!"
}