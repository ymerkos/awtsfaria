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
    "user"
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
    var an = await Awts.prompt("enter new alias name")
    await m.createEntity({
       aliasName: an
        
      
    })
    await Awts. alert(
      "Did: "+ JSON.stringify(m)

    )
  }
});
window.as=aliasesHandler
aliasesHandler.initialize();
