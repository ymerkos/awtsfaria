/**
 * B"H
 * EntityModule: A Universal Resonance of Identity
 * @description: As the Awtsmoos permeates every layer of existence, this module is a versatile echo of that divinity across different entities.
 * @requires: A specific div with an id as specified in the parameter for each type of entity. Also requires AwtsmoosSocialHandler.
 */

import AwtsmoosSocialHandler from './AwtsmoosSocialHandler.js';

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
    console.log(this)
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
    container.innerHTML = ""; // Clear the container before displaying entities
    
    // Add New button
    const addNewBtn = document.createElement('button');
    addNewBtn.textContent = 'Add New';
    addNewBtn.addEventListener('click', async () => {
      if(this.createFn) 
        await this.createFn(this);
      this.initialize();
    });
    container.appendChild(addNewBtn);


    console.log("Got", dayuh)
    try {
      // Let's use entityType to construct the endpoint dynamically
      const entityIds = dayuh.map(entity => entity.id || entity);
      
      const fullDetails = await this.handler
      .fetchEntities(`/${this.entityType}/details`, {
        method: 'POST',
        body: new URLSearchParams({ [
          this.entityIds
        ]: JSON.stringify(entityIds) }).toString(),
      });
      // Now that we have full details, we proceed to display each entity
      fullDetails.forEach((entity, index) => {
        if(!entity) return null;
        var entityID = entityIds[index]
        entity.id=entityID
        console.log(entity, entityID,"got entity")
        const entityDiv = document.createElement('div');
        entityDiv.classList.add('entity');
      
        this.readonlyFields.forEach(field => {
          
          const fieldDiv = document.createElement('div');
          
          fieldDiv.classList.add('entity-field', `field-${field}`);
          
          fieldDiv.textContent = entity[field] || '';
      
          
          entityDiv.appendChild(fieldDiv);
        });

        this.editableFields.forEach((field) => {
          const fieldDiv = document.createElement('div');
          fieldDiv.classList.add('entity-field', `field-${field}`);
          fieldDiv.textContent = entity[field] || '';
          var oldContent = fieldDiv.textContent
          // Make the field editable and attach the edit handler
          fieldDiv.contentEditable = true;
          fieldDiv.addEventListener(
            'blur', async () => {
              try {
                await editHandler(dayuh[index], field, fieldDiv.textContent)
              } catch(e) {
                console.log("Error", e);
                fieldDiv.textContent = oldContent;
              }
            }
          );
      
          entityDiv.appendChild(fieldDiv);
        });
      


        // Delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', async () => {
          if (confirm('Are you sure you want to delete this entity?')) {
            try {
              await this.handler.deleteEntity
              (`/${this.entityType}/${
                entityID
              }`);
              console.log('Entity deleted successfully');
              this.initialize(); // Refresh the list
            } catch (error) {
              console.error('Error deleting entity:', error);
            }
          }
        });
        entityDiv.appendChild(deleteBtn);



        container.appendChild(entityDiv);
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
      console.log('Update successful', response);
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
      console.log('Entities fetched successfully');
      return entities;
    } catch (error) {
      console.error('Error fetching entities:', error);
    }
  }

}

export default EntityModule;
