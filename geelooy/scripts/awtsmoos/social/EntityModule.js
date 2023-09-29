/**
 * B"H
 * EntityModule: A Universal Resonance of Identity
 * @description: As the Awtsmoos permeates every layer of existence, this module is a versatile echo of that divinity across different entities.
 * @requires: A specific div with an id as specified in the parameter for each type of entity. Also requires AwtsmoosSocialHandler.
 */

import AwtsmoosSocialHandler from './AwtsmoosSocialHandler.js';
import UI from "/scripts/awtsmoos/ui.js";
var ui = new UI();

class EntityModule {
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
    errorFn,
    entityIds
  } = {}) {
    this.handler = new AwtsmoosSocialHandler(apiEndpoint);
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
    
  }
 
  /**
   * @function initialize
   * @description: A foundational call in the divine cycle where entities are displayed and rendered editable.
   */
  async initialize() {
    var atzmo = this;
    try {
      const dayuh = 
      await this.handler.fetchEntities(
        `/${this.entityType}`
      );
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
  
    // Clear the container before displaying entities
    ui.htmlAction({ html: container, properties: { innerHTML: "" } });
  
    // Add New button
    ui.html({
      tag: 'button',
      shaym: 'addNewBtn',
      textContent: 'Add New',
      events: {
        click: async () => {
          if(this.createFn) 
            await this.createFn(this);
          this.initialize();
        }
      }
    });
    ui.htmlAction({ html: container, methods: { appendChild: [ui.html({ tag: 'button', textContent: 'Add New' })] } });
  
    
    
    try {
      const entityIds = dayuh.map(entity => entity.id || entity);
      
      const fullDetails = await this.handler
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
              textContent: entity[field] || ''
            })),
            ...this.editableFields.map(field => ({
              tag: 'div',
              shaym: `fieldDiv${index}${field}`,
              classList: ['entity-field', `field-${field}`],
              properties: { contentEditable: true },
              textContent: entity[field] || '',
              events: {
                blur: async () => {
                  const fieldDiv = ui.$g(`fieldDiv${index}${field}`);
                  const oldContent = fieldDiv.textContent;
                  try {
                    await editHandler(dayuh[index], field, fieldDiv.textContent);
                  } catch (e) {
                    console.log("Error", e);
                    fieldDiv.textContent = oldContent;
                  }
                }
              }
            })),
            {
              tag: 'button',
              textContent: 'Delete',
              events: {
                click: async () => {
                  if (confirm('Are you sure you want to delete this entity?')) {
                    try {
                      await this.handler.deleteEntity(`/${this.entityType}/${entityID}`);
                    
                      
                      this.initialize();
                    } catch (error) {
                      console.error('Error deleting entity:', error);
                    }
                  }
                }
              }
            }
          ]
        });
        var entityDiv = ui.$g(`entityDiv${index}`);
        
        ui.htmlAction({ 
          html: container, 
          methods: { 
            appendChild: [entityDiv] 
          } 
        });
      });
    } catch (error) {
      console.error('Error fetching full entity details', error);
    }
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
      const response = await this.handler.editEntity({
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

  

  async fetchEntities(endpoint) {
    try {
      const entities = await this.handler.fetchEntities(endpoint);

      
      return entities;
    } catch (error) {
      console.error('Error fetching entities:', error);
    }
  }

}

export default EntityModule;
