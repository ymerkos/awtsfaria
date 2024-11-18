/**
 * B"H
 * 
 * posts endpoints
 */


var {
	NO_LOGIN,
	sp,
    
  
  } = require("./helper/_awtsmoos.constants.js");

var {
	getPostsInHeichel,
	detailedPostOperation,
	addPostToHeichel,
	

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
    "/asdfg": async () => {
        return "Hi there!"
    },
    /**
	 * Posts Endpoints - The Chronicles of Existence
	 */
	"/heichelos/:heichel/posts": async (v) => {
	
	
		if ($i.request.method == "GET") {
			return await getPostsInHeichel({
				$i,
				
				heichelId: v.heichel
			})
		}
	
		if ($i.request.method == "POST") {
			return await addPostToHeichel({
				heichelId:v.heichel,
				
				
				
				
				$i
			});
		}
	},
	/**
	 * @endpoint /posts/details
	 * returned the details of a 
	 * lot of posts.
	 * @returns array of detailed posts
  	 * @requires at least a parent series ID, if not gets root
		$i.$_POST.seriesId || $i.$_GET.seriesId || "root";
		
	 */

	"/heichelos/:heichel/posts/details": async (v) => {
		var heichelId = v.heichel;
		

		
			return await getPostsInHeichel({
				$i,
				withDetails: true,
				
				
				heichelId: v.heichel
			});
			
		
	},

	/**
	 * 
	 * @endpoint /posts/:post
	 * @description gets details of 
	 * one post
	 * 
	 * OR if method is PUT edits post
	 * OR if method is DELETE deletes it
	 * 
	 * required params (dep. on method):
	 * postID
	 * 
	 * for edit:
	 * newTitle || title
	 * newContent || content
	 * @returns 
	 */
	"/heichelos/:heichel/post/:post": async (v) => {
		return await detailedPostOperation({
			
			userid,
			postID: v.post,
			heichelId: v.heichel,
			$i
			
			
			
		})
	},
	/**
	 * 
	 * similar as above but just for delete simpler
	 */
	"/heichelos/:heichel/post/:post/delete": async(v) => {
		
	},

    
    
});
