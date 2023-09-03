/**
B"H
@requires div with id "heichelList"
**/

import AwtsmoosSocialHandler from './AwtsmoosSocialHandler.js';

const heichelsHandler = new AwtsmoosSocialHandler('/api');

heichelsHandler.fetchEntities('/heichels')
  .then(data => {
    heichelsHandler.displayEntities(data, 'heichelList', (entity, elem) => {
      elem.contentEditable = true;
      elem.addEventListener('blur', function() {
        heichelsHandler.editEntity(entity.aliasId, { name: this.textContent }, '/heichels');
        this.contentEditable = false;
      });
    });
  });
