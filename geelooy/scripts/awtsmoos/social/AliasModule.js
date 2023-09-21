/**
B"H
for displaying and editing one's aliases.
@requires div with id aliasList before this script loads
as well as AwtsmoosSocialHandler 
**/
import EntityModule from './EntityModule.js';

const aliasesHandler = new EntityModule({
  apiEndpoint:'/api/social/',
  containerID:"aliasList",
  entityIds: "aliasIds",
  entityType:"aliases", //entityType
  readonlyFields: [
    "aliasId"
  ],
  editableFields: [
    "name"
  ],
  updateDataFn: async (r) => {
    return {
      aliasName: r.updatedData.name,
      aliasId: r.id
    }
  },
  createFn: async m => {
    await m.handler.createEntity({
      entityType: "aliases",
      newEntityData: {
        aliasName: prompt("enter alias name")
      }
    })
    console.log(m);
  }
});
window.as=aliasesHandler
aliasesHandler.initialize();