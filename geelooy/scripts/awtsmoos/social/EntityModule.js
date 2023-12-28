/**
 * B"H
 * EntityModule: A Universal Resonance of Identity
 * @description: As the Awtsmoos permeates every layer of existence, this module is a versatile echo of that divinity across different entities.
 * @requires: A specific div with an id as specified in the parameter for each type of entity. Also requires AwtsmoosSocialHandler.
 */

import AwtsmoosSocialHandler from './AwtsmoosSocialHandler.js';
import UI from "/scripts/awtsmoos/ui.js";
import Awts from "../alerts.js";
var ui = new UI();

class EntityModule extends AwtsmoosSocialHandler{
  constructor({
    apiEndpoint, 
    containerID, 
    entityType, 
    updateDataFn, 
    createFn,
    getFn,
    editableFields,
    beforeHTML,
    readonlyFields,
    displayFn, 
    subPath,
    errorFn,
    entityIds,
    viewState,
    viewURL//async function with arg m
  } = {}) {
    super(apiEndpoint, subPath);

    this.containerID = containerID;
    this.entityType = entityType;
    this.updateDataFn = updateDataFn;
    this.createFn = createFn;
    this.getFn = getFn || (async (m) => m)
    this.editableFields = editableFields;
    this.readonlyFields = readonlyFields;
    this.beforeHTML = beforeHTML;
	var a = document.createElement("a");
	this.viewURL = viewURL;
    this.viewFn =  async m => {
		var url = this.viewURL(m);
		if(typeof(url) != "string") {
			alert("No URL specified");
			return;
		}
			
		
		a.target="_blank"

		a.href = 
			url
		a.click()
	};
	
	
    if(!this.readonlyFields) {
      this.readonlyFields = []
    }

    if(!this.editableFields) {
      this.editableFields = []
    }
    this.displayFn = displayFn;
    this.errorFn = errorFn;
    this.entityIds = entityIds;
    this.viewState=viewState;
  }
 
  /**
   * @function initialize
   * @description: A foundational call in the divine cycle where entities are displayed and rendered editable.
   */
  async initialize() {
    
    try {
      var dayuh = 
      await this.fetchEntities(
        `/${this.entityType}`
      );
      console.log("What is it?",dayuh,this.entityType)
      var args = 
      [
        dayuh,
        this.containerID,
        this.editHandler.bind(this)
      ];
      var display = this.displayFn ||
        this.defaultDisplayFn.bind(this);
      display(
        ...args
      )
    } catch(e) {
      console.log("Error getting entities: ", e)
      this.errorFn?.call(0, e);
    }

    
  }

  
  
  async defaultDisplayFn(dayuh, containerID, editHandler) {
    var container = document.getElementById(containerID);
    console.log("dayuh", dayuh)
    // Clear the container before displaying entities
    ui.htmlAction({ html: container, properties: { innerHTML: "" } });

    var isPublic=this.viewState==
      "public"

    if(!isPublic) {
      // Add New button
      ui.html({
        tag: 'button',
        shaym: 'addNewBtn',
        textContent: 'Add New',
        events: {
          click: async () => {
            console.log("Hi!")
            
            if(this.createFn) 
              await this.createFn(this);
            this.initialize();
          }
        },
        parent:container
      });

    }

    
    if(!dayuh) {
      await Awts.alert(
        "not sure what happened"+
        dayuh +
        this.entityType
        

      )
      ui.html({
        textContent: "Server issue",
        parent:container
      })
    }
    if(dayuh.error) {
      console.log(dayuh.error)
      ui.html({
        textContent: 
          "There was an error! Here: " + 
          JSON.stringify(
            dayuh.error
          )
        ,
        classList: ["postMessage", "error"],
        parent:container
      });
      return;
    }

    if(!dayuh.length) {
      ui.html({
        textContent: "No posts yet, add one!",
        classList: ["postMessage"],
        parent:container
      });
      return;
    }

    
    

    try {
      var entityIds = dayuh.map(entity => entity.id || entity);
      
      var fullDetails = await this
      .fetchEntities(`/${this.entityType}/details`, {
        method: 'POST',
        body: new URLSearchParams({ [this.entityIds]: JSON.stringify(entityIds) }).toString(),
      });
  
      fullDetails.forEach((entity, index) => {
        if(!entity) return null;
        var entityID = entityIds[index];
        entity.id = entityID;
        
        var editableFields = this.editableFields
          .map(field => ({
            tag: 'div',
            shaym: `fieldDiv${index}${field}`,
            classList: ['entity-field', `field-${field}`],
            children: [
				{
					textContent: field,
					className:"fieldName"
				},
                {
                    textContent: entity[field] || '{Empty, enter some info}',
					
					className:"fieldValue"
                },
                (!isPublic?({
                    tag: 'button',
                    textContent: 'Edit',
                    events: {
                        click: async () => {
                            var oldValue = entity[field] || '';
                            var newValue = await Awts.prompt
                            (`Edit ${field}:`, oldValue);
                            if (newValue !== null && newValue !== oldValue) {
                                try {
                                    await editHandler
                                    (dayuh[index], field, newValue);
                                    this.initialize(); // Refresh the display after editing
                                } catch (e) {
                                    console.log("Error", e);
                                }
                            }
                        }
                    }
                }):null)
            ]
        }));

        var readOnlyFields = this.readonlyFields.map(field => ({
          tag: 'div',
          shaym: `fieldDiv${index}${field}`,
          classList: ['entity-field', `field-${field}`],
		  children: [
				{
					textContent: field,
					className:"fieldName"
				},
				{
                    textContent: entity[field] || '{Empty, enter some info}',
					
					className:"fieldValue"
                }
				
		  ]
        }))

        console.log(
          "Fields",readOnlyFields,editableFields,
          container
        )

        var deleteButton = 
        (!isPublic?({
          tag: 'button',
          textContent: 'Delete',
          events: {
            click: async () => {
              if (await Awts.confirm('Are you sure you want to delete this entity?')) {
                try {
                  await this.deleteEntity(`/${this.entityType}/${entityID}`);
                
                  
                  this.initialize();
                } catch (error) {
                  console.error('Error deleting entity:', error);
                }
              }
            }
          }
        }):null);

        var viewBtn = {
          tag:"button",
          textContent:"View",
          events: {
            click: async() => {
              try {
                this.viewFn(entity,this)
              } catch(e) {
                console.log(e)
              }
            }
          }
        }

        var customHTML = null;
        if(typeof(this.beforeHTML) == "function") {
          customHTML = this.beforeHTML(entity,this)
        }
        ui.html({
          
          shaym: `entityDiv${index}`,
          classList: ['entity'],
          children: [
            (customHTML?{
              innerHTML:customHTML,
              className: "beforeHTMl"
            }:null),
            viewBtn,
            ...editableFields,
            ...readOnlyFields,
            deleteButton
            
            
          ],
          parent:container
        });
        
      });
    } catch (error) {
      console.error('Error fetching full entity details', error);
    }
  }
  

  
  async createEntity(data) {
    return super.createEntity({
      entityType: this.entityType,
      newEntityData: data
    });
  }

  async editHandler(entity, field, newValue) {
    var entityId = entity.id || entity;
    try {
      // Fetch the full data of the entity
      var fullEntityData = await this.getFn(entity, this);
  
      // Prepare the updated data using the updateDataFn
      var updatedData = await this.updateDataFn({
        id: entityId,
        entity: fullEntityData,
        updatedData: { [field]: newValue },
      });
  
      // Send the updated data to the backend
      var response = await this.editEntity({
        entityId, 
        entityType: this.entityType,
        updatedData
      });
  
      if (response.error) {
        throw response.error;
      }
      
    } catch (error) {
      console.error('Error in editHandler:', error);
      throw error;
    }
  }
  

  async mapIdToAliasName(entityId) {
  var entity = await this.getFn(entityId);
  return entity.aliasName;
}

  

  async fetchEntities(endpoint, opts={}) {
    try {
      var entities = await super.fetchEntities
        (endpoint, opts);

      
      return entities;
    } catch (error) {
      console.error('Error fetching entities:', error);
    }
  }

}

export default EntityModule;
