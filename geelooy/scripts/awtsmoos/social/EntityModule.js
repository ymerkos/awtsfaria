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
    displayFn, 
    errorFn
  } = {}) {
    this.handler = new AwtsmoosSocialHandler(apiEndpoint);
    this.containerID = containerID;
    this.entityType = entityType;
    this.updateDataFn = updateDataFn;
    this.createFn = createFn;
    this.getFn = getFn || (async (m) => m)
    this.editableFields = editableFields;
    this.displayFn = displayFn;
    this.errorFn = errorFn;
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

    /*
    OLD code, what do i do with this, if anything?
    this.handler.fetchEntities(`/${this.entityType}`)
      .then(data => {
        this.handler.displayEntities(data, this.containerID, (entity, elem) => {
          if(this.editIDs) {
            elem.contentEditable = true;
            elem.addEventListener('blur', async () => {
              var specificEntity = await this.getFn(entity, this);
              const updatedData = await this.updateDataFn({
                updatedData: elem.textContent,
                data,
                entity: specificEntity,
                id: entity
              });
              
              console.log(updatedData);
              this.handler.editEntity
              (entity?entity.id || entity:null, updatedData, `/${this.entityType}`)
              .then(r=>console.log(r));
              elem.contentEditable = false;
            });
          }
        });

        // The Genesis Button: A Nexus for New Creation
        const addButton = document.createElement("button");
        addButton.innerHTML = "Create New";
        addButton.addEventListener('click', () => {
          atzmo. createFn(atzmo)
          // Logic for new entity creation here, perhaps a POST method call.
        });
        
        document.getElementById(this.containerID).appendChild(addButton);
      });
      */
  }

  
  
  async defaultDisplayFn(dayuh, containerID, editHandler) {
    const container = document.getElementById(containerID);
    container.innerHTML = ""; // Clear the container before displaying entities
    
    try {
      // Extract the heichelIds from the dayuh array
      const heichelIds = dayuh.map(entity => entity.id || entity);
      
      // Fetch full details for all entities in a single API call
      const fullDetails = await this.handler.fetchEntities('/heichels/details', {
        method: 'POST',
        body: new URLSearchParams({ heichelIds: JSON.stringify(heichelIds) })
          .toString(),
      });
  
      console.log("Testing", fullDetails)
      // Now that we have full details, we proceed to display each entity
      fullDetails.forEach((entity, index) => {
        const entityDiv = document.createElement('div');
        entityDiv.classList.add('entity');
      
        this.editableFields.forEach((field) => {
          const fieldDiv = document.createElement('div');
          fieldDiv.classList.add('entity-field', `field-${field}`);
          fieldDiv.textContent = entity[field] || '';
      
          // Make the field editable and attach the edit handler
          fieldDiv.contentEditable = true;
          fieldDiv.addEventListener('blur', () => editHandler(dayuh[index], field, fieldDiv.textContent));
      
          entityDiv.appendChild(fieldDiv);
        });
      
        container.appendChild(entityDiv);
      });
    } catch (error) {
      console.error('Error fetching full entity details', error);
    }
  }

  
  

  editHandler(entity, field, newValue) {
      // Fetch the full data of the entity
    this.getFn(entity, this).then((fullEntityData) => {
      // Prepare the updated data using the updateDataFn
      this.updateDataFn({
        entity: fullEntityData,
        updatedData: { [field]: newValue },
      }).then((updatedData) => {
        // Send the updated data to the backend
        this.handler.editEntity(entity.id || entity, updatedData, `/${this.entityType}`).then((response) => {
          console.log('Update successful', response);
        }).catch((error) => {
          console.error('Error updating entity', error);
        });
      }).catch((error) => {
        console.error('Error preparing updated data', error);
      });
    }).catch((error) => {
      console.error('Error fetching full entity data', error);
    });
  }

  async createEntity(newEntityData) {
    try {
        const response = await this.handler.endpoint
        (newEntityData, `/${this.entityType}`);
        console.log('Creation successful', response);
        this.initialize();  // Re-initialize to update the UI
    } catch (error) {
        console.error('Error creating entity', error);
    }
}

  async deleteEntity(entityId) {
      try {
          const response = await this.handler.endpoint
          (entityId, `/${this.entityType}`);
          console.log('Deletion successful', response);
          this.initialize();  // Re-initialize to update the UI
      } catch (error) {
          console.error('Error deleting entity', error);
      }
  }

  async renameEntity(entityId, newName) {
      try {
          const response = await this.handler
          .endpoint(entityId, newName, `/${this.entityType}`);
          console.log('Renaming successful', response);
          this.initialize();  // Re-initialize to update the UI
      } catch (error) {
          console.error('Error renaming entity', error);
      }
  }

}

export default EntityModule;
