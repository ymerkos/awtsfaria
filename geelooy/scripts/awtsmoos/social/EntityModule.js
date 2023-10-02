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
    readonlyFields,
    displayFn, 
    subPath,
    errorFn,
    entityIds,
    viewState="edit
  } = {}) {
    super(apiEndpoint, subPath);

    this.containerID = containerID;
    this.entityType = entityType;
    this.updateDataFn = updateDataFn;
    this.createFn = createFn;
    this.getFn = getFn || (async (m) => m)
    this.editableFields = editableFields;
    this.readonlyFields = readonlyFields;
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
      const dayuh = 
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
    const container = document.getElementById(containerID);
    console.log("dayuh", dayuh)
    // Clear the container before displaying entities
    ui.htmlAction({ html: container, properties: { innerHTML: "" } });

    const isPublic=this.viewState==
      "public"

    if(isPublic) {
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
      ui.html({
        textContent: "There was an error! Here: " + dayuh.error,
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
      const entityIds = dayuh.map(entity => entity.id || entity);
      
      const fullDetails = await this
      .fetchEntities(`/${this.entityType}/details`, {
        method: 'POST',
        body: new URLSearchParams({ [this.entityIds]: JSON.stringify(entityIds) }).toString(),
      });
  
      fullDetails.forEach((entity, index) => {
        if(!entity) return null;
        const entityID = entityIds[index];
        entity.id = entityID;
        
  
        ui.html({
          tag: 'div',
          shaym: `entityDiv${index}`,
          classList: ['entity'],
          children: [
            ...this.readonlyFields.map(field => ({
              tag: 'div',
              shaym: `fieldDiv${index}${field}`,
              classList: ['entity-field', `field-${field}`],
              innerText: entity[field] || ''
            })),
            ...this.editableFields.map(field => ({
                tag: 'div',
                shaym: `fieldDiv${index}${field}`,
                classList: ['entity-field', `field-${field}`],
                children: [
                    {
                        tag: 'span',
                        textContent: entity[field] || ''
                    },
                    ...(!isPublic?({
                        tag: 'button',
                        textContent: 'Edit',
                        events: {
                            click: async () => {
                                const oldValue = entity[field] || '';
                                const newValue = await Awts.prompt
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
            })),
            {
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
            }
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
      const fullEntityData = await this.getFn(entity, this);
  
      // Prepare the updated data using the updateDataFn
      const updatedData = await this.updateDataFn({
        id: entityId,
        entity: fullEntityData,
        updatedData: { [field]: newValue },
      });
  
      // Send the updated data to the backend
      const response = await this.editEntity({
        entityId, 
        entityType: this.entityType,
        updatedData
      });
  
      if (response.error) {
        throw new Error(response.error);
      }
      
    } catch (error) {
      console.error('Error in editHandler:', error);
      throw error;
    }
  }
  

  async mapIdToAliasName(entityId) {
  const entity = await this.getFn(entityId);
  return entity.aliasName;
}

  

  async fetchEntities(endpoint, opts={}) {
    try {
      const entities = await super.fetchEntities
        (endpoint, opts);

      
      return entities;
    } catch (error) {
      console.error('Error fetching entities:', error);
    }
  }

}

export default EntityModule;
