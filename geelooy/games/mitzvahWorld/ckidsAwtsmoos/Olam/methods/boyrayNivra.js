/**
 * B"H
 * 
 * Olam method for "creating" a nivra
 */

/**
     * The method 'boyrayNivra' creates a new instance of a creation, represented by the 'nivra' parameter.
     * The creation can be defined in two ways: by providing a path to a GLTF model, or by defining a 
     * primitive shape using Three.js geometries and materials.
     * If the creation is defined as a GLTF model, it's loaded and added to the scene, potentially to an Octree
     * if flagged as solid. If it's defined as a primitive, a new mesh is created based on the provided 
     * geometry and material parameters.
     *
     * @param {object} nivra - The creation object, either containing a 'path' property to load a GLTF model
     * or a 'golem' property to define a primitive shape.
     * @returns {Promise} A Promise resolving with either the loaded GLTF object or the created mesh.
     *
     * @example
     * var myNivra = { path: '/models/myModel.gltf', isSolid: true };
     * var createdNivra = await boyrayNivra(myNivra);
     * 
     * var myPrimitiveNivra = { 
     *    golem: { 
     *       guf: { BoxGeometry: [1, 1, 1] },
     *       toyr: { MeshLambertMaterial: { color: "white" } } 
     *    } 
     * };
     * var createdPrimitiveNivra = await boyrayNivra(myPrimitiveNivra);
     */

import Utils from '../../utils.js'

import * as THREE from '/games/scripts/build/three.module.js';

import { Octree } from '/games/scripts/jsm/math/Octree.js';

export default class {
    async boyrayNivra/*createCreation*/(nivra, info) {
        try {
            
            if(
                nivra.path &&
                typeof(nivra.path) == "string"
            ) {
                var derech = nivra.path;
                
                // Check if the path starts with "awtsmoos://"
                if (nivra.path.startsWith('awtsmoos://')) {
                    // Extract the component name from the path
                    //var componentName = nivra.path.slice(11);
    
                    
                    // Get the component from the Olam
                    var component = this.getComponent(nivra.path);
                    
                    // If the component doesn't exist, throw an error
                    if (!component) {
                        console.log("LOL nothing is found",component)
                    }
    
                    // Use the component's data URL as the path
                    derech = component;
                    nivra.path = derech;
                }
    
    
    
                /**
                 * If has path, load it as GLTF.
                 * If is primitive object. set it's model
                 * as a promitive
                 */
                
    
                /**
                 * check if GLTF has already
                 * been instantiated.
                 */
                var gltf = null;
                var gltfAsset = this.$ga(
                    "GLTF/" + derech
                );
                /**
                 * TODO officially clone gltf
                 * with skeleton utils
                 */
                
                
                if(0&&gltfAsset) {
                   // gltf = gltfAsset;
                } else { 
                    try {
                        
                        var lastTime = Date.now();
                        gltf = await new Promise((r,j) => {
                            this.loader.load(derech, onloadParsed => {
                                r(onloadParsed)
                            },
                            async progress => {
                                var {
                                    loaded,
                                    total
                                } = progress;
                                var percent = loaded/total;
                                var nivrayimLng = info?.nivrayimMade?.length || 1;
                                var thisSize = nivra.size;
                                var totalSize = this.totalSize;
                                var sizeIncrement = (thisSize / totalSize);
                                var loadingPercentage = percent  * sizeIncrement;
                                await this.ayshPeula("increase loading percentage", {
                                    amount: 100 * loadingPercentage,
                                    action: "building nivra model: "+nivra.name
                                })
                                var time = Date.now() - lastTime
                                lastTime = Date.now()
                                
                            }, error => {
                                console.log(error);
                                r();
                            });
                        })
                    } catch(e) {
                        throw e;
                        console.log("Problem loading",e,gltfAsset)
                    }
                }
                
    
                if(!gltf) {
                    throw "Couldn't load model!"
                }
                
                if(!gltfAsset) {
                    this.setAsset(
                        "GLTF/"+derech,
                        gltf
                    );
                    
                }
                nivra.asset = gltf;
                var placeholders = {};
                var entities = {};
    
                var thingsToRemove = [];
                var materials = [];
                var totalChildren = 0;
    
                gltf.scene.traverse(child => {
                    totalChildren++
                });
                var currentChild = 0;
                gltf.scene.traverse(child => {
                    currentChild++;
                    var loadingPercentage = currentChild / totalChildren;
                    this.ayshPeula("increase loading percentage", {
                        amount: 100 * loadingPercentage,
                        action: "Traversing: "+nivra.name + 
                        ".",
                        subAction: "Current Child #"+currentChild + " out of " + 
                            totalChildren
                        + ". Name: "
                        +child.name
                    });
                    child.nivraAwtsmoos = nivra;
                    if(child.userData && child.userData.water) {
                        child.isMesh = false;
                        this.ayshPeula("alert", "WATER IS HERE", child)
                        this.ayshPeula("start water", child);
                        this.ayshPeula("increase loading percentage", {
                            amount: 0,
                            action: "Adding water..."
                        });
                    }
    
                    if(child.userData.meen == "land") {
                        if(!nivra.lands) {
                            nivra.lands = [];
                        }
                        nivra.lands.push(child)
                    }
    
                    if(child.userData && child.userData.action) {
                        var ac = this.actions[child.userData.action];
                        
                        
                        if(ac) {
                            if(!nivra.childrenWithActions) {
                                nivra.childrenWithActions = [];
                            }
                            nivra.childrenWithActions.push(ac);
                            child.awtsmoosAction = (player, nivra) => ac(
                                player, nivra, this
                            );
                        }
                    }
                    /*
                        look for objects that
                        have the custom property "placeholder"
                        with the name of the nivra. for repeating
                        objects can have same name.
                    */
                    if(typeof(child.userData.placeholder) == "string") {
                        var {
                            position, rotation, scale
                        } = this.getTransformation(child)
                        
                        console.log("Found placeholder",child)
                        /*
    
    
                            for example if i have
                            lots of coins I can 
                            add lots to the list for 
                            different positions
                        */
                        
                        if(!placeholders[child.userData.placeholder])
                            placeholders[child.userData.placeholder] = [];
    
                        var shlichus = child.userData.shlichus;
                        placeholders[child.userData.placeholder].push(
                            {
                                position, rotation, scale,
                                mesh: child,
                                addedTo: false,
                                ...(/**
                                    some objects
                                    only have placeholders
                                    for a specific mission.
                                */
                                    shlichus ? {
                                        shlichus
                                    } : {}
                                )
                            }
                        );
    
                        /*console.log("Added placeholder",child.userData.placeholder,
                        placeholders[child.userData.placeholder],
                        child,nivra)*/
                        thingsToRemove.push(child)
                        //gltf.scene.remove(child);
                        
    
                    }
    
                    /**
                     * deal with entities
                     */
                    if(
                        typeof(child.userData.entity)
                        == "string"
                    ) {
                        
                        this.saveEntityInNivra(child.userData.entity, nivra, child)
                         if(nivra.isSolid) {
                            child.isSolid = true;
                         }
                         child.isMesh = true;
                       //  console.log("Saved",nivra.entities,child.userData)
                    }
    
                    if(child.userData.remove) {
                      //  thingsToRemove.push(child)
                    }
    
                    
    
    
                    /*adds items that aren't player to special list
                    for camera collisions etc.*/
                    if (child.isMesh && !child.isAwduhm) {
                        this.objectsInScene.push(child);
    
                    } else if(child.isMesh) {
                        if (child.material.map) {
    
                            ///child.material.map.anisotropy = 4;
            
                        }
                    }
    
                    if(child.isMesh) {
                        //shadows
                       // child.receiveShadow = true
                       // child.castShadow = true
                    }
    
                    /*
                        get materials of mesh for easy access later
                            */
                    if(child.material) {
                        var inv = child.userData.invisible
                        
                        //checkAndSetProperty(child, "invisible");
                        
                        
                        Utils.replaceMaterialWithLambert(child);
                        materials.push(child.material)
                        if(inv) {
                            child.material.visible = false;
                        }
                    }
    
                    
                });
                
                if(nivra.entities) {
                    
                    this.nivrayimWithEntities.push(nivra);
                }
                if(thingsToRemove.length) {
                    thingsToRemove.forEach(q => {
                        q.removeFromParent();
                    });
                    nivra.placeholders = placeholders;
                    
                    this.nivrayimWithPlaceholders.push(nivra);
                }
    
                
    
    
                /*if solid, add to octree*/
                if(nivra.isSolid) {
                    nivra.needsOctreeChange = true;
                    nivra.on(
                        "changeOctreePosition", () => {
                            var currentChild = 0;
                            gltf.scene.traverse(child => {
                                
                                currentChild++;
                                var loadingPercentage = currentChild / totalChildren;
                                this.ayshPeula(
                                    "increase loading percentage", 
                                    {
                                        amount:loadingPercentage * 100,
                                        nivra: nivra,
    
                                        subAction: "child #"
                                        +currentChild + " with name "
                                        +child.name +".",
                                        
                                        action: "Traversing nivra " +
                                        nivra.name + " to add children to octree."
                                    }
                                );
                                if(!child.isMesh) return;
                                var isAnywaysSolid = 
                                    checkAndSetProperty(child,
                                "isAnywaysSolid");
    
                                var has = checkAndSetProperty(child, "notSolid", 
                                "isAnywaysSolid");
                                //if does not have "not solid" to true, means !has IS solid
                                if(true) 
                                {
                                    this.worldOctree.fromGraphNode(child);
    
                                    child.layers.enable(2)
                                }
    
    
                                console.log("About to add to octree", has,child,nivra)
                                
                            })
                        }
                    );
    
                    if(nivra.lands) {
                        nivra.landOctree = new Octree();
                        nivra.lands.forEach(w => {
                            nivra.landOctree.fromGraphNode(w)
                        })
                    }
                    
                }
    
                function checkAndSetProperty(obj, prop, exceptProp) {
                    // If the object itself has the notSolid property set to true
                    if (
                        obj.userData && obj.userData[prop]
                        && !obj.userData[exceptProp]
                    ) {
                        
                        setPropToChildren(obj, prop);
                      return true;
                    }
                  
                    // Check its children
                    for (let i = 0; i < obj.children.length; i++) {
                        if(!obj.userData[exceptProp])
                      if (checkAndSetProperty(obj.children[i]), prop) {
                        return true;
                      }
                    }
                  
                    // If none of the children have the notSolid property set to true
                    return false;
                  }
                  
                  function setPropToChildren(obj, prop) {
                    obj.traverse((child) => {
                      if (!child.userData) {
                        child.userData = {};
                      }
                      child.userData[prop] = true;
                    });
                  }
    
                if(nivra.interactable) {
                    this.interactableNivrayim
                    .push(nivra);
                }
    
    
                nivra.materials = materials;
                return gltf;
            } else {
                var golem = nivra.golem || {};/*golem like form, 
                optional input object to allow users to 
                specify what kidn of three mesh to 
                add if not loading a model*/
                if(typeof(golem) != "object")
                    golem = {};
                    
                /*guf is mesh / body, toyr is material. 
                neshama is a different issue*/
                var guf = {"BoxGeometry":[1,1,1]};
                var toyr = {"MeshLambertMaterial":{
                    color:"white"
                }}; /*
                    defaults and also example of format.
                */
                
                /*
                    get first proerpties of object
                    like aboev example since only 
                    one property (entry) per 
                    either geometry or material is needed
                */
                var firstGuf = golem.guf || golem.body;
                var firstToyr = golem.toyr || 
                    golem.material || golem.appearance;
    
                if(typeof(firstGuf) == "object" && firstGuf) {
                    guf = firstGuf;
                }
                if(typeof(firstToyr) == "object" && firstToyr) {
                    toyr = firstToyr;
                }
    
                /*get properties*/
                var gufEntries = Object.entries(guf);
                var toyrEntries = Object.entries(toyr);
                
                var chomer /*geometry*/;
                var tzurah /*material*/;
                
                if(
                    THREE[gufEntries[0][0]]
                ) {
                    chomer = new THREE[gufEntries[0][0]](
                        ...gufEntries[0][1]
                    );
                }
    
                if(
                    THREE[toyrEntries[0][0]]
                ) {
                    tzurah = new THREE[toyrEntries[0][0]](
                        toyrEntries[0][1]
                    );
                }
    
                
                if(
                    !chomer ||
                    !tzurah
                ) {
                    throw "No model or valid geometry/material was given";
                }
                this.tzurah = tzurah;
                this.chomer = chomer;
                var mesh = new THREE.Mesh(
                    chomer, tzurah
                );
    
                
                
                return mesh;
            }
            
        } catch(e) {
            console.log(e)
            throw e;
        }
    
            
    }
}
