//B"H
// B"H

/*

B"H

The Cosmic Dance of Awtsmoos API Documentation
Dive into the intricate web of endpoints, each one a reflection of the infinite depths of the Awtsmoos.

General $irmation:
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
Output: $irmation about the specified heichel.

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
Output: the $i.json file of each Heicheil,
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
Output: $irmation about the specified post 
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
var counters = require("./_awtsmoos.counter.js");
var posts = require("./_awtsmoos.posts.js");
/**
 * /api
 */
// _awtsmoos.derech.js - The Pathway of Awtsmoos, Continued
// A cosmic dance, weaving the fabric of creation into digital existence.
// A symphony of endpoints, resonating with the infinite depths of the Awtsmoos.

var {
	loggedIn
} = require("./helper/general.js");

module.exports = 

  async ($i) => {
    // Check if logged in
    
    $i.setHeader(
      "Access-Control-Allow-Origin",
      "*"
    )
    var userid = null;
    if(loggedIn($i))
      userid = $i.request.user.info.userId; // Alias connected to the logged-in user

      
    await $i.use({
      "/": async () => "B\"H\nHi",
      /**
       * Aliases Endpoints - The Masks of Divinity
       */
      
      "/fetch/:url": async vars => {
          
          try {

            // Decode the Base64-encoded string
            const decodedBuffer = Buffer.from(vars.url, 'base64');

            // Convert the decoded Buffer to a string
            const decodedString = decodedBuffer.toString('utf8');
            return {
              really: decodedString
            }
           // var url = decodeURIComponent(decodedString);
            var it = await $i.fetch(url)
            return it;
          } catch(e) {
            return {
              BH:"B\"H",
              error: {
                message: "Issue",
                code: "PROBLEM",
                details: e+""
              }
            }
          }
      },
      ...aliases({
          $i,
          userid,
      }),
	  ...heichelos({
          $i,
          userid,
      }),

      ...posts({
        $i,
        userid
      }),
      
      ...counters({
        $i,
        userid
      }),
      
    
  
      /**
       * Comments Endpoints - The Echoes of Divine Truth
       */
      "/comments": async () => {
        if ($i.request.method == "GET") {
          var options = {
            recursive: $i.$_GET.recursive || false,
            page: $i.$_GET.page || 1,
            pageSize: $i.$_GET.pageSize || 10,
            sortFunction: $i.$_GET.sortFunction || null,
          };
          var comments = await $i.db.get(
            
            `/users/${
              aliasId
            }/heichelos/posts/comments`, options);

          return comments;
        }
        if ($i.request.method == "POST") {
          var content = $i.$_POST.content;
          var postId = $i.$_POST.postId;
          var commentId = /* generate this */ "commentId";
          await $i.db.write(
           
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





 
  }