/**
B"H
@requires div with id "heichelList"

for displaying and editing one's heichels.
@requires div with id aliasList before this script loads
as well as AwtsmoosSocialHandler 
**/

import EntityModule from './EntityModule.js';
import Awts from "../alerts.js"

async function go(myAlias) {
  try {
  const heichelsHandler = new EntityModule({
    apiEndpoint:`/api/social/alias/${
      myAlias
    }/`,
    containerID:"heichelList",
    entityIds: "heichelIds",
    entityType:"heichelos", //entityType
    editableFields: [
      "id",
      "name",
      "description"
    ],
    readonlyFields: [
      "author"
    ],
    getFn: async (entity, mod) => {
      
      var heych = await mod.getHeichel(entity)
      
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
      var heichelName = await Awts.prompt("enter heichel name")
      var aliasID = await Awts.prompt ("Enter your alias ID to match it")
      var description = await Awts.prompt("enter description")
      var r = await m.createEntity({
          name: heichelName,
          description,
          aliasId: aliasID,
          isPublic: true
        }
      )
      console.log("MAde! heichel", r)
    }
  }
  );

  heichelsHandler.initialize();

  } catch (e){
  await Awts.alert("Error: "+ JSON.stringify(e))
  }
}

window.go=go;