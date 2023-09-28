/**
B"H
@requires div with id "postsList"

for displaying and editing one's posts.
@requires EntityModule 
**/

import EntityModule from './EntityModule.js';
try {
const postsHandler = new EntityModule({
  apiEndpoint:'/api/social/',
  containerID:"postList",
  entityIds: "postIds",
  entityType:"posts", //entityType
  editableFields: [
    "postId",
    "title",
    "content"
  ],
  readonlyFields: [
    "author"
  ],
  getFn: async (entity, mod) => {
    
    var heych = await mod.handler.getPost(entity)
    
    return heych
  },
  updateDataFn: async (r) => {
    console.log(r)
    return {
      
      
      
      postId: r.id,
      content:r.updatedData. content || 
        r.entity. content,
      title: r.updatedData. title|| r.entity. title
    }
  },
  createFn: async m => {
    var postName = prompt("enter post title")
    var aliasID = prompt ("Enter your alias ID to match it")
    var hid = prompt ("Enter the Heichel ID");
    var description = prompt("enter content")
    var r = await m.handler.createEntity({
      entityType: "posts",
      newEntityData: {
        title: postName,
        content: description,
        aliasId: aliasID,
        
        heichelId: hid
      }
    })
    console.log("MAde! post", r)
  }
}
);

} catch ($){
alert($+"")
}

alert (770)
