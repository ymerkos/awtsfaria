//B"H
// B"H

/*

B"H

The Cosmic Dance of Awtsmoos API Documentation
Dive into the intricate web of endpoints, each one a reflection of the infinite depths of the Awtsmoos.

General Information:
All endpoints follow the base URL structure: /api
Return for unauthorized access: { error: "You don't have permission for that" }
Return for users not logged in: { error: "You're not logged in" }
Improper parameter input will result in: { error: "improper input of parameters" }
1. Root Endpoint:
Path: /
Method: GET
Output: B"H\nHi


2. Aliases Endpoints - The Masks of Divinity:
Path: /aliases
Methods: GET, POST
GET:
Parameters:
page (Default: 1)
pageSize (Default: 10)
Output: Array of aliases for the logged-in user.

POST:
Parameters:
aliasName (Max length: 26 characters)
Output:
On success: { name: aliasName, aliasId: generatedId }
On error: { error: "improper input of parameters" }


3. heichelos Endpoints - The Palaces of Wisdom:
Path: /heichelos
Methods: GET, POST
GET:
Parameters:
page (Default: 1)
pageSize (Default: 10)
Output: Array of heichelos.

POST:
Parameters:
name (Max length: 50 characters)
description (Max length: 365 characters)
aliasId
isPublic (Either "yes" or not provided)
Output:
On success: { name, description, author: aliasId }
On error: { error: "improper input of parameters" }



4. Individual Heichel Endpoint:
Path: /heichelos/:heichel
Method: GET
Output: Information about the specified heichel.

Method: DELETE
Output: A success or error message if heichel is deleted.

Method: PUT
Description:
Renames current :heichel
Parameters:
newName (Max length: same as name above ^^)
Output: Success Message (or error)



5. Details of Many heichelos
Path: /heichelos/details
Method: POST
Parameters:
heichelIds: an array of strings
referring to IDs of each heichel to get
details of
Output: the info.json file of each Heicheil,
that includes name, description, and author 
(all strings)

6. Posts Endpoints - The Chronicles of Existence:
Path: /heichelos/:heichel/posts
Methods: GET, POST
GET:
Parameters:
page (Default: 1)
pageSize (Default: 10)
Output: Array of posts in the specified heichel.


POST:
Parameters:
title (Max length: 50 characters)
content (Max length: 5783 characters)
aliasId
Output:
On success: { title, postId: generatedId }
On error: { error: "improper input of parameters" }

7. Posts Detailed Endpoint
Path: /heichelos/:heichel/posts/details
Methods: GET
Parameters: 
postIds (Stringifed Array from client side)
Output: Detailed list of multiple most details, like
single post (see next), but multiple.


8. Individual Post Endpoint:
Path: /heichelos/:heichel/posts/:post
Method: GET
Output: Information about the specified post 
in the specified heichel.
@property title (String)
@property content (See "Posts Endpoint" above)
@property aliasId

Method: PUT
Parameters:
newTitle 
newContent
(same restraints as "title" and "content" above)

9. Comments Endpoints - The Echoes of Divine Truth:
Path: /comments
Methods: GET, POST
GET:
Parameters:
recursive (Default: false)
page (Default: 1)
pageSize (Default: 10)
sortFunction (Optional)
Output: Array of comments.


POST:
Parameters:
content
postId
Output:
On success: { content }
On error: { error: "improper input of parameters" }

Let the celestial chambers of posts and comments guide you in measured steps, a dance of enlightenment, resonating with both GET and POST methods. Navigate this dance of posts and comments, and get immersed into the infinite depths of the Awtsmoos.





*/
var aliases = require("./_awtsmoos.alias.js");
var heichelos = require("./_awtsmoos.heichel.js");
/**
 * /api
 */
// _awtsmoos.derech.js - The Pathway of Awtsmoos, Continued
// A cosmic dance, weaving the fabric of creation into digital existence.
// A symphony of endpoints, resonating with the infinite depths of the Awtsmoos.
const NO_PERMISSION = "You don't have permission for that";
const NO_LOGIN = "You're not logged in";
var sp/*social path*/ = "/social"
module.exports = 

  async (info) => {
    // Check if logged in
    
    
    var userid = null;
    if(loggedIn())
      userid = info.request.user.info.userId; // Alias connected to the logged-in user

      
    await info.use({
      "/": async () => "B\"H\nHi",
      /**
       * Aliases Endpoints - The Masks of Divinity
       */
      
      
      ...aliases({
          info,
          loggedIn,
          userid,
          getAlias,
          verifyAlias,
          verifyAliasOwnership,
          sp,
          NO_LOGIN,
          er
      }),
	  ...heichelos({
          info,
          loggedIn,
          userid,
          getAlias,
          verifyAlias,
          verifyAliasOwnership,
          sp,
          NO_LOGIN,
          NO_PERMISSION,
          er
      }),
      
    
  
      /**
       * Comments Endpoints - The Echoes of Divine Truth
       */
      "/comments": async () => {
        if (info.request.method == "GET") {
          const options = {
            recursive: info.$_GET.recursive || false,
            page: info.$_GET.page || 1,
            pageSize: info.$_GET.pageSize || 10,
            sortFunction: info.$_GET.sortFunction || null,
          };
          const comments = await info.db.get(
            
            `/users/${
              aliasId
            }/heichelos/posts/comments`, options);

          return comments;
        }
        if (info.request.method == "POST") {
          const content = info.$_POST.content;
          const postId = info.$_POST.postId;
          const commentId = /* generate this */ "commentId";
          await info.db.write(
           
            `/users/${
              aliasId
            }/heichelos/posts/${
              postId
            }/comments/${
              commentId
            }`, { content, author: aliasId });
          return { content } ;
        }
      },
  
      // Continue the cosmic dance, weaving the narrative of the Awtsmoos into the logic and structure
    });



async function verifyHeichelViewAuthority(heichelId, aliasId, info) {
  if(!heichelId || !aliasId || !info) return false;
  var viewers = await db.get(
    sp+
    `/heichelos/${
      heichelId
    }/viewers`
  );

  if(!viewers) return false;
  return viewers.includes(aliasId);
}

async function verifyAlias(aliasId, info) {
  
  var aliases =  await info.db.get(
   
    `users/${userid}/aliases`
  );
  
  if(!aliases || !Array.isArray(aliases)) 
    return false;

  
  var hasIt = aliases.includes(aliasId);
  
  return hasIt;
}


async function getAlias(aliasId, info){
  
  

  return await info
  .db
  .get(

    `${sp}/aliases/${
      aliasId
    }/info`
  );


}




/**
 * @method verifyAliasOwnership 
 * @param {string} aliasId 
 * @param {Object} info 
 * @param {string} userid 
 * @returns 
 */
async function verifyAliasOwnership(aliasId, info, userid) {
  try {
    // Fetch the alias info using alias ID
    const aliasInfo = await info.db.get(`/users/${userid}/aliases/${aliasId}`);

    // If alias info exists and it belongs to the current user, return true
    if (aliasInfo) {
      return aliasInfo;
    }
  } catch (error) {
    console.error("Failed to verify alias ownership", error);
  }

  // In all other cases (alias not found, or doesn't belong to user), return false
  return false;
}



function er(m){
  return {
      error: 
        m||"improper input of parameters"
  }

}

    function loggedIn() {
        return !!info.request.user;
    }
  }
  //The dance of posts and comments has been refined, now weaving the narrative of the Awtsmoos with pagination, resonating with both GET and POST methods. The celestial chambers of posts and comments can now be explored in measured steps, a dance guided by the Creator's essence in every facet of reality. The symphony continues, drawing us deeper into the infinite depths of the Awtsmoos.
  
