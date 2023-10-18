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
    
    

    var userid;
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
      /**
       * heichelos Endpoints - The Palaces of Wisdom
       */
      "/heichelos": async () => {
        
        if (info.request.method == "GET") {
          const options = {
            page: info.$_GET.page || 1,
            pageSize: info.$_GET.pageSize || 10,
          };

          console.log("Getting?",options)
          const heichelos = await info.db.get(
            sp+`/heichelos`, options
          );
          console.log("Trying",heichelos)
          if(!heichelos) return [];

          return heichelos;
        }

        if (info.request.method == "POST") {
          if(!loggedIn()) {
            return er(NO_LOGIN);
          }
          const name = info.$_POST.name;
          const description = info.$_POST.description;
          
          const aliasId = info.$_POST.aliasId;
          var isPublic = info.$_POST.isPublic;

          var ver = await verifyAlias(aliasId, info)
          if(!ver) {
            
            return er("Not your alias");
          }

          

          if(!info.utils.verify(
            name,50
          ) || description.length > 365) return er();

          //editing existing heichel
          var heichelId = info.$_POST.heichelId;
          
          //creating new heichel
          if(!heichelId) {
              
            let iteration = 0;
            let unique = false;
            
            
            while (!unique) {
              heichelId = info.utils.generateId(name, false, iteration);
              const existingHeichel = await info.db.get(sp+
                `/heichelos/${
                  heichelId
                }/info`);
              
              if (!existingHeichel) {
                unique = true;
              } else {
                iteration += 1;
              }
            }
            
          }
          
          await info.db.write(
            sp+
            `/aliases/${
              aliasId
            }/heichelos/${
              heichelId
            }`
          );

          await info.db.write(
            sp+
            `/heichelos/${
              heichelId
            }/info`, { name, description, author: aliasId }
          );

          await info.db.write(
            sp+
            `/heichelos/${
              heichelId
            }/editors/${aliasId}`
          );

          
          await info.db.write(
            sp+
            `/heichelos/${
              heichelId
            }/viewers/${aliasId}`
          );

          if(isPublic == "yes") {
            await info.db.write(
              sp+
              `heichelos/${
                heichelId
              }/public`
            );
          }

          return { name, description, author: aliasId, heichelId };
        }
      },

      /**
       * @endpoint /heichelos/details
       * returned the details of a 
       * lot of heichelos.
       * @returns 
       */

      "/heichelos/details": async () => {
        if (info.request.method == "POST") {
          const heichelIds = info.$_POST.heichelIds;
          /**
           * formatted:
           * heichelIds: [
           *  
           *    heichelId (String)
           * 
           * ]
           */
          if (!heichelIds || !Array.isArray(heichelIds)) {
            return er("Invalid input");
          }
      
          const details = await Promise.all(
            heichelIds.map(id => getHeichel(id, info))
          );
      
          return details;
        }
      },

      
      /**
       * 
       * @param {Object} vars 
       * @returns info.json of heichel with
       * @property name
       * @property description
       * @property author
       * 
       */

      "/heichelos/:heichel": async vars => {
        if (info.request.method == "DELETE") {
          if(!loggedIn()) {
            return er(NO_LOGIN);
          }
      
          // Verify ownership or permission to delete
          // (add your verification logic here)
      
          const heichelId = vars.heichel;
      
          try {
            // Delete heichel details
            await info.db.delete(sp+`/heichelos/${heichelId}/info`);
      
            // Delete references in other entities such as aliases, 
            //editors, viewers, etc.
            await info.db.delete(sp+`/aliases/{aliasId}/heichelos/${heichelId}`);
            await info.db.delete(sp+`/heichelos/${heichelId}`);
      
            return { message: "Heichel deleted successfully" };
          } catch (error) {
            console.error("Failed to delete heichel", error);
            return er("Failed to delete heichel");
          }
        }
      
        if (info.request.method == "PUT") {
          if(!loggedIn()) {
            return er(NO_LOGIN);
          }
      
          // Verify ownership or permission to rename
          // (add your verification logic here)
      
          const heichelId = vars.heichel;
          const newName = info.$_PUT.newName || info.$_PUT.name;
          const newDescription = info.$_PUT.newDescription ||
             info.$_PUT.description;
             
          if(
            newName && 
            !info.utils.verify(newName, 50)
          ) {
            return er("Invalid new name");
          }

          if(newDescription && newDescription.length > 365) {
            return er("Description too long")
          }
      
          try {
            // Fetch the existing data
            const heichelData = await info.db.get(sp+`/heichelos/${heichelId}/info`);
      
            var modifiedFields = {
              "name":false,
              "description":false
            }
            // Update the name in the existing data
            if(newName) {
              heichelData.name = newName;
              modifiedFields.name = true;
            }

            if(newDescription) {
              heichelData.description = newDescription;
              modifiedFields.description = true
            }
            // Write the updated data back to the database
            await info.db.write(sp+`/heichelos/${heichelId}/info`, heichelData);
      
            return { message: "Heichel renamed successfully", newName, modifiedFields };
          } catch (error) {
            console.error("Failed to rename heichel", error);
            return er("Failed to rename heichel");
          }
        }

        // Existing GET logic
        return await getHeichel(vars.heichel, info);
      },
      
  
      /**
       * Posts Endpoints - The Chronicles of Existence
       */
      "/heichelos/:heichel/posts": async (v) => {
        if (info.request.method == "GET") {
          const options = {
            page: info.$_GET.page || 1,
            pageSize: info.$_GET.pageSize || 10
          };

          var heichelId = v.heichel;
          
          var posts = await info.db.get(
            sp+
            `/heichelos/${
              heichelId
            }/posts`, 
            options
          );
          
          if(!posts) posts = [];
          console.log("Got psots", posts)
          return posts;
        }

        if (info.request.method == "POST") {
          if(!loggedIn()) {
            return er(NO_LOGIN);
          }
          const title = info.$_POST.title;
          const content = info.$_POST.content;
          const heichelId = v.heichel;
          var aliasId = info.$_POST.aliasId;
          var ver = await verifyHeichelAuthority(
            heichelId,
            aliasId,
            info
          );
          if(!ver) {
            return er(
              "You don't have authority to post to this heichel"
            );
          }

          
          if(
            !info.utils.verify(
            title,50 
            
          ) || 
            (
              content && content.length
            ) > 5784 || !content
          ) return er();

          const postId = info.utils.generateId(title);
          await info.db.write(
            sp+
            `/heichelos/${
              heichelId
            }/posts/${
              postId
            }`, { title, content, author: aliasId }
          );
          return { title, postId };
        }
      },


      /**
       * @endpoint /posts/details
       * returned the details of a 
       * lot of posts.
       * @returns 
       */

      "/heichelos/:heichel/posts/details": async (v) => {
        if (info.request.method == "POST") {
          const postIds = info.$_POST.postIds;
          var heichelId = v.heichel;
          /**
           * formatted:
           * postIds: [
           *  
           *    postId
           *    
           *  
           * ],
           * heichelId (String)
           */
          
          if (!postIds || !Array.isArray(postIds)) {
            return er("Invalid input");
          }
          
          const details = await Promise.all(
            postIds.map(id => getPost(heichelId, id))
          );
      
          return details;
        }
      },

      /**
       * 
       * @endpoint /posts/:post
       * @description gets details of 
       * one post
       * @returns 
       */
      "/heichelos/:heichel/posts/:post": async (v) => {
          if (info.request.method == "GET") {
              
      
              var heichelId = v.heichel;
              
              const postInfo = await getPost
                (heichelId, v.post)
              if(!postInfo) return null;
              return postInfo;
          }
          
          if (info.request.method == "PUT") {
              if(!loggedIn()) {
                  return er(NO_LOGIN);
              }
      
              const heichelId = v.heichel;
              const postId = v.post;
              const newTitle = info.$_PUT.newTitle ||
                info.$_PUT.title;
               
              const newContent = info.$_PUT.newContent ||
                info.$_PUT.content;
              
              if(newTitle)
                if(!info.utils.verify(newTitle, 50)) {
                    return er("Invalid new title");
                }

              if(
                newContent &&
                newContent.length > 5784
              ) {
                 {
                  return er("Invalid content length (max: 5784)")
                }
              }
              if(
                newTitle ||
                newContent
              ) {
                try {
                    // Fetch the existing data
                    const postData = await info.db
                    .get(sp+`/heichelos/${heichelId}/posts/${postId}`);
        
                    // Update the title and content in the existing data
                    if(newTitle)
                      postData.title = newTitle;
                    
                    if(newContent)
                      postData.content = newContent;
        
                    // Write the updated data back to the database
                    await info.db
                    .write(sp+`/heichelos/${heichelId}/posts/${postId}`, postData);
        
                    return { message: "Post updated successfully", newTitle, newContent };
                } catch (error) {
                    console.error("Failed to update post", error);
                    return er("Failed to update post");
                }
              } else {
                return er("No info to update.")
              }
          }
      
          if (info.request.method == "DELETE") {

              if(!loggedIn()) {
                  return er(NO_LOGIN);
              }
      
              const heichelId = v.heichel;
              const postId = v.post;
      
              try {
                  // Delete post details
                  await info.db.delete(sp+`/heichelos/${heichelId}/posts/${postId}`);
      
                  return { message: "Post deleted successfully" };
              } catch (error) {
                  console.error("Failed to delete post", error);
                  return er("Failed to delete post");
              }
          }
      },
    
  
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


    
async function verifyHeichelAuthority(heichelId, aliasId, info) {

  if(!heichelId || !aliasId) return false;
   return true
  var editors = await info.db.get(
    sp+
    `/heichelos/${heichelId}/editors`
  );

  if(!editors || !Array.isArray(editors))
    return false;
  
    
  return editors.includes(aliasId);
}

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

async function getPost(heichelId, postID) {
  var isAllowed = await verifyHeichelPermissions
  (heichelId)

  if(isAllowed) {
    var post = await info.db.get(
      sp+
      `/heichelos/${
        heichelId
      }/posts/${
        postID
      }`
    );
    return post;
  }

  return null;
  
}

async function getAlias(aliasId, info){
  console.log("Hi",aliasId,sp)
  

  return await info
  .db
  .get(

    `${sp}/aliases/${
      aliasId
    }/info`
  );


}


async function getHeichel(heichelId, info) {
    var isAllowed = await verifyHeichelPermissions(heichelId)

    if(isAllowed)
      return await info.db.get(
        sp+
        `/heichelos/${heichelId}/info`
      );
    else return er(NO_PERMISSION);
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



async function verifyHeichelPermissions(heichelId) {
  var isPublic = await info.db.get(
    sp +
    `/heichelos/${
      heichelId
    }/public`
  );
  var isAllowed = true;

  if(!isPublic) {
    if(!loggedIn()) {
      return er(NO_LOGIN);
    }
    var viewers = await info.db.get(
      sp + 
      `/heichelos/${
        heichelId
      }/viewers`
    );

    if(!viewers) return er(NO_PERMISSION);
    var myAliases = await info.db.get(
      `/users/${
        userid
      }/aliases`
    );

    if(!myAliases) return er(NO_PERMISSION);
    
    isAllowed = false;
    myAliases.forEach(q=> {
      if(viewers.includes(q)) {
        isAllowed = true;
      }
    });

  }
  return isAllowed;
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
  
