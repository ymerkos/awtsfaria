/**
B"H
for displaying and editing one's aliases.
@requires div with id aliasList before this script loads
as well as AwtsmoosSocialHandler 
**/
import EntityModule from './EntityModule.js';
import Awts from "../alerts.js";
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
    await m.createEntity({
      async aliasName: 
        await Awts.prompt("enter alias name")
      
    })
    console.log(m);
  }
});
window.as=aliasesHandler
aliasesHandler.initialize();
