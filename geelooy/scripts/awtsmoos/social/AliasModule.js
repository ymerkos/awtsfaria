/**
B"H
for displaying and editing one's aliases.
@requires div with id aliasList before this script loads
as well as AwtsmoosSocialHandler 
**/
import AwtsmoosSocialHandler from './AwtsmoosSocialHandler.js';

const aliasesHandler = new AwtsmoosSocialHandler('/api/social/');

aliasesHandler.fetchEntities('/aliases')
  .then(data => {
    aliasesHandler.displayEntities(data, 'aliasList', (entity, elem) => {
      elem.contentEditable = true;
      elem.addEventListener('blur', function() {
        aliasesHandler.editEntity(entity.aliasId, { aliasName: this.textContent }, '/aliases');
        this.contentEditable = false;
      });
    });
  });
