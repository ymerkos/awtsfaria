/**
 * B"H
 * entity methods
 */

export default class {
    /**
     * @description gets an entity name
     * across the different current
     * nivrayim that may have it
     */
    getEntity(entityName, nivra=null) {
        var entity/*array of possible
        entities of meshes representing
        the child, see
        "saveEntityInNivra"*/ = 
        nivra ? nivra?.entities?.[entityName] : 
        ((n => n?n?.entities?.[entityName] : null)(this.nivrayim.find(q => q?.entities ? 
            q?.entities[entityName] : false    
        )));
        if(!entity) return null;

        var addedTo = null;
        if(entity.forEach)
        entity.forEach(c => {
            if(addedTo) return;
            if(!c.addedTo) {
                addedTo = c;
            }
        });
        
        if(!addedTo/*return first entity*/) {
            return entity[0]
        } else {
            /*
                return entitiy that is availalbe to 
                add to
            */
           return addedTo;
        }
    }

    saveEntityInNivra(entityName, nivra, child) {
        if(!nivra.entities) {
            nivra.entities = {};
        }
        if(!nivra.entities[entityName]) {
            nivra.entities[entityName] = [];
        }
        var ind = nivra.entities[entityName].indexOf(child);
        if(ind < 0) {
            nivra.entities[entityName].push(child);
            
        }
       
    }
}