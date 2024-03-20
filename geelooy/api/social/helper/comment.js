/**
 * B"H
 */


module.exports = {
    addComment,
    getComments,
    getComment
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
    heichelId
}) {
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

    var myId = "BH_"+Date.now()+"_commentBy_"+aliasId;
    var content = $i.$_POST.content;
    var dayuh = $i.$_POST.dayuh;

    var shtar = {};
    shtar.author = aliasId;
    shtar.parentType = parentType;
    shtar.parentId = parentId;

    if(content && typeof(content) == "string") {
        shtar.content = content
    }

    if(dayuh && typeof(dayuh) == "object") {
        shtar.dayuh = dayuh;
    }

    var cm = await $i.db.write(`${
        sp
    }/heichelos/comments/chai/${
        myId
    }`, shtar);

    var atPost
    if(parentType == "post") {
        atPost = await $i.db.write(`${
            sp
        }/heichelos/comments/atPost/${
            parentId
        }/author/${
            aliasId
        }/${
            myId
        }`);
    }
    

    return {
        message: "Added comment!",
        details: {
            id: myId,
            writtenAtPost: {
                parentId,
                aliasId,
                atPost
            },
            raw: cm
        }
    }
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
async function getComments({
    $i,
    parentType = "post",
    parentId,
    heichelId,
    aliasParent = null
}) {
    
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
    
    if(aliasParent) {
        var aliases = await $i.db.get(`${
            sp
        }/heichelos/${
            heichelId
        }/${subPath}/${
            parentId
        }/author`);
        if(!aliases) return []
        return aliases
    } else {
        /**
         * this means we get the specific comment IDs of that alias
         */

        var commentIDs = await $i.db.get(`${
            sp
        }/heichelos/${
            heichelId
        }/${subPath}/${
            parentId
        }/author/${
            aliasParent
        }`);
        if(!commentIDs) return [];
        return commentIDs
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
    parentType = "post",
    commentId,
    heichelId
}) {
    

    

    
    return "getting comment!"
}