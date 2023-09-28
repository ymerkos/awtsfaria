/**
B"H
@requires div with id "heichelList"

for displaying and editing one's heichels.
@requires div with id aliasList before this script loads
as well as AwtsmoosSocialHandler 
**/

import EntityModule from './EntityModule.js';

const heichelsHandler = new EntityModule({
  apiEndpoint:'/api/social/',
  containerID:"heichelList",
  entityIds: "heichelIds",
  entityType:"heichels", //entityType
  editableFields: [
    "id",
    "name",
    "description"
  ],
  readonlyFields: [
    "author"
  ],
  getFn: async (entity, mod) => {
    
    var heych = await mod.handler.getHeichel(entity)
    
    return heych
  },
  updateDataFn: async (r) => {
    console.log(r)
    return {
      aliasId: r.entity.author,
      heichelId: r.id,
      description:r.updatedData.description || 
        r.entity.description,
      name: r.updatedData.name || r.entity.name
    }
  },
  createFn: async m => {
    var heichelName = prompt("enter heichel name")
    var aliasID = prompt ("Enter your alias ID to match it")
    var description = prompt("enter description")
    var r = await m.handler.createEntity({
      entityType: "heichels",
      newEntityData: {
        name: heichelName,
        description,
        aliasId: aliasID,
        isPublic: true
      }
    })
    console.log("MAde! heichel", r)
  }
}
);

heichelsHandler.initialize();
