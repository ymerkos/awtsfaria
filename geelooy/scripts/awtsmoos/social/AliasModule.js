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
  entityType:"aliases", //entityType
  updateDataFnc: async (r) => {
    return {
      aliasName: r.updatedData
    }
  },
  createFnc: async m => {
    m.handler.createAlias(prompt("enter alias name"))
    console.log(m);
  }
});
window.as=aliasesHandler
aliasesHandler.initialize();