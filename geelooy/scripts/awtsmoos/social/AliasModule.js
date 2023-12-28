/**
B"H
for displaying and editing one's aliases.
@requires div with id aliasList before this script loads
as well as AwtsmoosSocialHandler 
**/
import EntityModule from './EntityModule.js';
import Awts from "../alerts.js";

//<?Awtsmoos
var usr = this.request.user;
if(usr) {
	
    sharedData.user = request.user.info.userId;
}
//?>
var aliasesHandler = new EntityModule({
  apiEndpoint:`/api/social/`
  
  ,
  containerID:"aliasList",
  entityIds: "aliasIds",
  entityType:"aliases", //entityType
  readonlyFields: [
    "aliasId",

  ],
  beforeHTML: entity => {
    return /*html*/`
    <a href="/email?alias=${entity.id}">Email account
    for alias</a><br>
      <a target="_blank" href="/u/heichelos/?alias=${
       entity.id 
      }">View and edit Heichelos for Alias</a>
    `
  },
  editableFields: [
    "name",
	"description"
  ],
  viewURL: m => "/@"+m.id,
  
  updateDataFn: async (r) => {
	  console.log(r)
    return {
      aliasName: r.updatedData.name,
      aliasId: r.id,
	  description:r.updatedData.description
	  
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
