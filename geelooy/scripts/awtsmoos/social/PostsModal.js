/**
B"H
@requires div with id "heichelList"

for displaying and editing one's heichels.
@requires div with id aliasList before this script loads
as well as AwtsmoosSocialHandler 
**/

import EntityModule from './EntityModule.js';
try {
const heichelsHandler = new EntityModule({
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
      aliasId: r.entity.author,
      postId: r.id,
      content:r.updatedData. content || 
        r.entity. content,
      title: r.updatedData. title|| r.entity. title
    }
  },
  createFn: async m => {
    var heichelName = prompt("enter post title")
    var aliasID = prompt ("Enter your alias ID to match it")
    var description = prompt("enter content")
    var r = await m.handler.createEntity({
      entityType: "posts",
      newEntityData: {
        title: heichelName,
        content: description,
        aliasId: aliasID,
        isPublic: true
      }
    })
    console.log("MAde! heichel", r)
  }
}
);

} catch ($){
alert($+"")
}

alert (770)
