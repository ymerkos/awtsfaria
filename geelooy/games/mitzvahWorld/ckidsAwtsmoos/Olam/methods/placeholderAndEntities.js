/**
 * B"H
 * 
 * methods for placeholder and entity logic
 */

export default class {
    async doPlaceholderAndEntityLogic(nivra) {
        /**
         * check for shlichus data
         */

        var d = nivra?.dialogue?.shlichuseem;
        if(nivra.dialogue) {
           
            if(!this.nivrayimWithDialogue) {
                this.nivrayimWithDialogue = []
            }
            this.nivrayimWithDialogue.push(nivra)
        } //else{console.log("NO dialogue")}
      
        if(d) {
            this.nivrayimWithShlichuseem.push(nivra);
            nivra.hasShlichuseem = d;
            var isAvailable = this.ayshPeula("is shlichus available", d);
            nivra.iconPath = "indicators/exclamation.svg"
      
            nivra.shlichusAvailable = isAvailable;
            
            
        }

        //placeholder logic
        /**
         * placeholders work like this:
         * each general mesh can have children
         * meshes set up in the 3d modeling software
         * with children that have custom properties
         * "placeholder".
         * 
         * When that happens, then
         * whatever string the 
         * "placeholder" property is set to 
         * is the placeholder name.
         * 
         * When adding nivrayim in code,
         * if the placeholder name property
         * of the nivra matches an available
         * placeholder that's a child 
         * in a general mesh, then that 
         * placeholder
         * is filled up, meaning that
         * the newlty added
         * nivra is positioned at the 
         * position of the child (placeholder).
         * 
         * Then, it is kept track of that
         * the placeholder child mesh is no 
         * longer available, and then if one
         * in code continues to add more placeholders
         * with the same placeholder name, they essntially
         * keep looking for available placeholder child meshes
         * that match the same name, until no more are
         * available.
         * 
         * Also, sometimes placeholders are only associated
         * with specific missions.
         * 
         * In that case we check for the "shlichus" proeprty
         * in the child mesh, that would be set up in the 
         * modeling software, so we can keep track of what
         * items are added where as part of what mission,
         * and make sure to only add some items that
         * are meant for one mission to some positions,
         * even if they share the same placeholder name.
         */
        var nm = nivra.placeholderName;
        if(typeof(nm) == "string") {
            
            this.nivrayimWithPlaceholders.forEach(w=> {
                var pl = w.placeholders;
                console.log("Cehcking placeholder..",nm,pl[nm])
                if(pl[nm]) {
                    
                    var av/*available*/ = pl[nm]
                    .filter(q => (
                        q.shlichus ? 
                        nivra.shlichus == q.shlichus
                        : true
                    ))
                    .find(
                        q=> (
                            !q.addedTo
                        )
                    );

                    console.log("avail",av)
                    if(av) {
                   
						if(nivra.mesh) {
                            nivra.ayshPeula("change transformation", {
                                position: av.position,
                                rotation: av.rotation
                            });
                            

                            //nivra.mesh.rotation.copy(av.rotation);
                            av.addedTo = nivra;
                            nivra.addedToPlaceholder = av;
                            

                            var m = nivra.modelMesh || nivra.mesh;
                            if(m) {
                                this.meshesToInteractWith.push(
                                    m
                                )
                            }
                            if(nivra.static) {

                            }
                        } else {
                            console.log("No mesh?!",nivra)
                        }

                    
                        
                    }
                }
            })
        }


        await this.doEntityDataCheck(nivra)


        await this.doEntityNameCheck(nivra);

        
        

    }

    async doEntityNameCheck(nivra) {
        /**
         * entity logic for "entity name"
         * essntially meaning that if
         * an entity exists on another nivra,
         * it (later) finds that based
         * on the entity name set here
         * and sets the nivra as a reference to it
         */
        var entityName = nivra.entityName;
        /**
         * now, if one enters an
         * entityName to the nivra,
         * that means that it shoud
         * look for any available
         * entities with that name 
         * in the availalbe nivrayim, and
         * if so, then make the mesh of that nivra
         * into the child that already exists.
         * 
         * this means that the nivra
         * being processed is currently just a template.
         */
        if(!entityName) return //console.log("Nothing! entity",nivra);
        var entity = this.getEntity(entityName)
        if(!entity) return //console.log("TRIED entity",entity);
       // console.log("GOT?,entity",entity);
       // nivra.setMesh(entity);
        entity.addedTo = true;
        nivra.moveMeshToSceneRetainPosition(entity)
        nivra.ayshPeula("change transformation", {
            position: entity.position,
            rotation: entity.rotation
        });
        
        nivra.av = entity;
    }

    async doEntityDataCheck(nivra) {
        /**
         * entity logic
         * for parent with sub entities built in
         * 
         * */
        var ks = Object.keys(nivra.entityData);
        

        for(var k of ks) {
            var en = nivra.entityData[k];

            var type = en.type || "Domem";
            if(typeof(type) != "string") {
                type = "Domem"
            }
            var av = this.getEntity(k, nivra)//nivra.entities[k];
            
            if(!av) {
                return 
            }
            var ent = await this.loadNivrayim({
                [type]: [
                    en
                ]
            });

            av.hasDialogue = true;
            

            this.meshesToInteractWith.push(av)
            if(ent) {
                ent.forEach(w=>{
                    w.ayshPeula("change transformation", {
                        position: av.position,
                        rotation: av.rotation
                    });
                    w.av = av;
                    av.nivraAwtsmoos = w;
                    
                })
            }

            av.entityNivrayim = ent;
            
        }
    }
}