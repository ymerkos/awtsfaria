/**
 * B"H
 * EntityModule: A Universal Resonance of Identity
 * @description: As the Awtsmoos permeates every layer of existence, this module is a versatile echo of that divinity across different entities.
 * @requires: A specific div with an id as specified in the parameter for each type of entity. Also requires AwtsmoosSocialHandler.
 */

import AwtsmoosSocialHandler from './AwtsmoosSocialHandler.js';

class EntityModule {
  constructor(apiEndpoint, containerID, entityType, updateDataFn, createFnc) {
    this.handler = new AwtsmoosSocialHandler(apiEndpoint);
    this.containerID = containerID;
    this.entityType = entityType;
    this.updateDataFn = updateDataFn;
    this.createFnc = createFnc;

  }
 
  /**
   * @function initialize
   * @description: A foundational call in the divine cycle where entities are displayed and rendered editable.
   */
  initialize() {
    var atzmo = this;
    this.handler.fetchEntities(`/${this.entityType}`)
      .then(data => {
        this.handler.displayEntities(data, this.containerID, (entity, elem) => {
          elem.contentEditable = true;
          elem.addEventListener('blur', () => {
            const updatedData = this.updateDataFn(elem.textContent);
            this.handler.editEntity(entity.id, updatedData, `/${this.entityType}`);
            elem.contentEditable = false;
          });
        });

        // The Genesis Button: A Nexus for New Creation
        const addButton = document.createElement("button");
        addButton.innerHTML = "Create New";
        addButton.addEventListener('click', () => {
          atzmo. createFnc(atzmo)
          // Logic for new entity creation here, perhaps a POST method call.
        });
        
        document.getElementById(this.containerID).appendChild(addButton);
      });
  }
}

export default EntityModule;
