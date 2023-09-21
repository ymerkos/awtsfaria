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


3. Heichels Endpoints - The Palaces of Wisdom:
Path: /heichels
Methods: GET, POST
GET:
Parameters:
page (Default: 1)
pageSize (Default: 10)
Output: Array of heichels.

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
Path: /heichels/:heichel
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



5. Details of Many Heichels
Path: /heichels/details
Method: POST
Parameters:
heichelIds: an array of strings
referring to IDs of each heichel to get
details of
Output: the info.json file of each Heicheil,
that includes name, description, and author 
(all strings)

6. Posts Endpoints - The Chronicles of Existence:
Path: /heichels/:heichel/posts
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
Path: /heichels/:heichel/posts/details
Methods: GET
Parameters: 
postIds (Stringifed Array from client side)
Output: Detailed list of multiple most details, like
single post (see next), but multiple.


8. Individual Post Endpoint:
Path: /heichels/:heichel/posts/:post
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

const { verify } = require("../../../ayzarim/utils");

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
      "/aliases": async () => {
        if(!loggedIn()) {
          return er(NO_LOGIN);
        }
        if (info.request.method == "GET") {
          const options = {
            page: info.$_GET.page || 1,
            pageSize: info.$_GET.pageSize || 10
          };
          const aliases = await info
            .db
            .get(
           
              `/users/${
                userid
              }/aliases`
            );
          if(!aliases) return [];

          return aliases;
        }
        if (info.request.method == "POST") {
          
          const aliasName = info.$_POST.aliasName;
 
          if(
            !info.utils.verify(
              aliasName, 26
            )
          ) {
            return er();
          }
  
  
          
          const aliasId = info.utils.generateId(aliasName);
          await info.db.write(
           
            `/users/${
              userid
            }/aliases/${
              aliasId
            }`, {
              name: aliasName, aliasId
            }
          );
          await info.db.write(
            sp+
            `/aliases/${
              aliasId
            }/info`, {
              name: aliasName,
              user: userid
            }
          );
          return { name: aliasName, aliasId };
        }
      },
      
      "/aliases/why":async() => {
        return "why?"
      },

      /**
       * @endpoint /aliases/details
       * returned the details of a 
       * lot of aliases.
       * @returns 
       */

      "/aliases/details": async () => {
      
        if (info.request.method == "POST") {
          const aliasIds = info.$_POST.aliasIds;
          /**
           * formatted:
           * aliasIds: [
           *  
           *    aliasIds (String)
           * 
           * ]
           */
          if (!aliasIds || !Array.isArray(aliasIds)) {
            return er("Invalid input");
          }
      
          const details = await Promise.all(
            aliasIds.map(id => ((async(aliasId) => {
              var value = await info
                .db
                .get(
              
                  `/users/${
                    userid
                  }/aliases/${
                    aliasId
                  }`
                );
                
                var isVerified = await verifyAliasOwnership(
                  aliasId,
                  info,
                  userid
                );
                if(isVerified) return value;
                else return {error: "You are not authorized to see that."}
              }))(id))
          );
      
          return details;
        }
      },
      
      /**
       * @endpoint aliases/:alias
       * @description gets details of, updates or 
       * deletes an alias.
       * @param {Object} vars 
       * @returns info.json of heichel with
       * @property name
       * @property description
       * @property author
       * 
       */

      "/aliases/:alias": async vars => {
        
        if (info.request.method == "DELETE") {
          if(!loggedIn()) {
            return er(NO_LOGIN);
          }
          
          // Getting the aliasId from request, modify this part as per your setup
          const aliasId = info.vars.alias;
          
          if(!aliasId) {
            return er("No alias ID provided");
          }
        
          var ver = await verifyAlias(aliasId, info);
          if(!ver) {
            return er("Not your alias");
          }
        
          try {
            // Delete alias from user's aliases
            await info.db.delete(`/users/${userid}/aliases/${aliasId}`);
            
            // Delete alias info
            await info.db.delete(sp+`/aliases/${aliasId}/info`);
            
            // Get all heichels associated with the alias
            const heichels = await info.db.get(sp+`/aliases/${aliasId}/heichels`);
            
            if(heichels) {
              for(const heichelId in heichels) {
                // Delete all heichels data
                await info.db.delete(sp+`/aliases/${aliasId}/heichels/${heichelId}`);
                await info.db.delete(sp+`/heichels/${heichelId}`);
              }
            }
        
            return { message: "Alias and associated data deleted successfully" };
          } catch(error) {
            console.error('Error deleting alias and associated data:', error);
            return er("Error deleting alias and associated data");
          }
        }

        if (info.request.method == "PUT") {
          if(!loggedIn()) {
            return er(NO_LOGIN);
          }
        
          const aliasId = info.$_PUT.aliasId;
          const newAliasName = info.$_PUT.newAliasName ||
            info.$_PUT.aliasName;
          
          
          if(!aliasId || !newAliasName) {
            return er("Alias ID or new alias name not provided");
          }

          var isVerified = await verifyAliasOwnership(
            aliasId,
            info,
            userid
          );
            
          if(!isVerified) {
            return er("You don't have permission to modify this alias.");
          }
        
          if(!info.utils.verify(newAliasName, 26)) {
            return er("Invalid new alias name");
          }
        
          try {
            // Fetch the existing alias data
            const aliasData = await info.db.get(sp+`/aliases/${aliasId}/info`);
            
            if(!aliasData) {
              return er("Alias not found");
            }
        
            // Update the alias name in the existing data
            aliasData.name = newAliasName;
        
            // Write the updated data back to the database
            await info.db.write(sp+`/aliases/${aliasId}/info`, aliasData);
        
            // Also update the alias name in user's aliases list
            await info.db.write(
              `/users/${userid}/aliases/${aliasId}`, { name: newAliasName, aliasId }
            );
        
            
        
            return { message: "Alias renamed successfully", newAliasName };
          } catch (error) {
            console.error("Failed to rename alias", error);
            return er("Failed to rename alias");
          }
        }
        

        // Existing GET logic
        return await getHeichel(vars.heichel, info);
      },
      
      
      /**
       * Heichels Endpoints - The Palaces of Wisdom
       */
      "/heichels": async () => {
        if (info.request.method == "GET") {
          const options = {
            page: info.$_GET.page || 1,
            pageSize: info.$_GET.pageSize || 10,
          };

         
          const heichels = await info.db.get(
            sp+`/heichels`, options
          );
          if(!heichels) return [];

          return heichels;
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
          if(!heichelId)
            heichelId = info.utils.generateId(name);

          
          await info.db.write(
            sp+
            `/aliases/${
              aliasId
            }/heichels/${
              heichelId
            }`
          );

          await info.db.write(
            sp+
            `/heichels/${
              heichelId
            }/info`, { name, description, author: aliasId }
          );

          await info.db.write(
            sp+
            `/heichels/${
              heichelId
            }/editors/${aliasId}`
          );

          
          await info.db.write(
            sp+
            `/heichels/${
              heichelId
            }/viewers/${aliasId}`
          );

          if(isPublic == "yes") {
            await info.db.write(
              sp+
              `heichels/${
                heichelId
              }/public`
            );
          }

          return { name, description, author: aliasId, heichelId };
        }
      },

      /**
       * @endpoint /heichels/details
       * returned the details of a 
       * lot of heichels.
       * @returns 
       */

      "/heichels/details": async () => {
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

      "/heichels/:heichel": async vars => {
        if (info.request.method == "DELETE") {
          if(!loggedIn()) {
            return er(NO_LOGIN);
          }
      
          // Verify ownership or permission to delete
          // (add your verification logic here)
      
          const heichelId = vars.heichel;
      
          try {
            // Delete heichel details
            await info.db.delete(sp+`/heichels/${heichelId}/info`);
      
            // Delete references in other entities such as aliases, 
            //editors, viewers, etc.
            await info.db.delete(sp+`/aliases/{aliasId}/heichels/${heichelId}`);
            await info.db.delete(sp+`/heichels/${heichelId}`);
      
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
            const heichelData = await info.db.get(sp+`/heichels/${heichelId}/info`);
      
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
            await info.db.write(sp+`/heichels/${heichelId}/info`, heichelData);
      
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
      "/heichels/:heichel/posts": async (v) => {
        if (info.request.method == "GET") {
          const options = {
            page: info.$_GET.page || 1,
            pageSize: info.$_GET.pageSize || 10
          };

          var heichelId = v.heichel;
          
          const posts = await info.db.get(
            sp+
            `/heichels/${
              heichelId
            }/posts`, 
            options
          );
          if(!posts) return [];
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
            ) > 5783 || !content
          ) return er();

          const postId = info.utils.generateId(title);
          await info.db.write(
            sp+
            `/heichels/${
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

      "/heichels/:heichel/posts/details": async (v) => {
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
      "/heichels/:heichel/posts/:post": async (v) => {
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
              const newTitle = info.$_POST.newTitle;
              const newContent = info.$_POST.newContent;
      
              if(!info.utils.verify(newTitle, 50)) {
                  return er("Invalid new title");
              }
      
              try {
                  // Fetch the existing data
                  const postData = await info.db
                  .get(sp+`/heichels/${heichelId}/posts/${postId}`);
      
                  // Update the title and content in the existing data
                  postData.title = newTitle;
                  postData.content = newContent;
      
                  // Write the updated data back to the database
                  await info.db
                  .write(sp+`/heichels/${heichelId}/posts/${postId}`, postData);
      
                  return { message: "Post updated successfully", newTitle, newContent };
              } catch (error) {
                  console.error("Failed to update post", error);
                  return er("Failed to update post");
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
                  await info.db.delete(sp+`/heichels/${heichelId}/posts/${postId}`);
      
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
            }/heichels/posts/comments`, options);

          return comments;
        }
        if (info.request.method == "POST") {
          const content = info.$_POST.content;
          const postId = info.$_POST.postId;
          const commentId = /* generate this */ "commentId";
          await info.db.write(
           
            `/users/${
              aliasId
            }/heichels/posts/${
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

  var editors = await info.db.get(
    sp+
    `/heichels/${heichelId}/editors`
  );

  if(!editors || !Array.isArray(editors))
    return false;
  
    
  return editors.includes(aliasId);
}

async function verifyHeichelViewAuthority(heichelId, aliasId, info) {
  if(!heichelId || !aliasId || !info) return false;
  var viewers = await db.get(
    sp+
    `/heichels/${
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
      `/heichels/${
        heichelId
      }/posts/${
        postID
      }`
    );
    return post;
  }

  return null;
  
}


async function getHeichel(heichelId, info) {
    var isAllowed = await verifyHeichelPermissions(heichelId)

    if(isAllowed)
      return await info.db.get(
        sp+
        `/heichels/${heichelId}/info`
      );
    else return er(NO_PERMISSION);
}

async function verifyAliasOwnership(aliasId, info, userid) {
  try {
    // Fetch the alias info using alias ID
    const aliasInfo = await info.db.get(`/users/${userid}/aliases/${aliasId}`);

    // If alias info exists and it belongs to the current user, return true
    if (aliasInfo) {
      return true;
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
    `/heichels/${
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
      `/heichels/${
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
  
