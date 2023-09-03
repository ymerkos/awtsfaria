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
5. Posts Endpoints - The Chronicles of Existence:
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
6. Individual Post Endpoint:
Path: /heichels/:heichel/posts/:post
Method: GET
Output: Information about the specified post in the specified heichel.
7. Comments Endpoints - The Echoes of Divine Truth:
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


          const heichelId = info.utils.generateId(name);
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

          return { name, description, author: aliasId };
        }
      },

      "/heichels/:heichel": async vars => {
        
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

      "/heichels/:heichel/posts/:post": async (v) => {
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
            }/posts/${
              v.post
            }`, 
            options
          );
          if(!posts) return [];
          return posts;
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
  console.log("Editors?",heichelId,aliasId)
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

async function getHeichel(heichelId, info) {
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

    if(isAllowed)
      return await info.db.get(
        sp+
        `/heichels/${heichelId}/info`
      );
    else return er(NO_PERMISSION);
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
  
