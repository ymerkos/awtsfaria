/**
 * B"H
 * @file tzomayaach.js
 * for now: things that can be
 * interacted with, like clicked, 
 * or if close enough can press
 * a
 * key or something to activate something 
 * else.
 */

import * as THREE from '/games/scripts/build/three.module.js';
import Domem from "./domem.js";
import Utils from "../utils.js";
export default class Tzomayach extends Domem {
    type = "tzomayach";
    
    constructor(options) {
        super(options);
        this.heesHawveh = true;
        this.proximity = (p=>
            /**
             * check if input proxomity 
             * is a number.
             */
            typeof(p) == "number" 
            ?p:0
        )(options.proximity);
        
		this.on("sealayk",() => {
            
			if(this.proximityCollider) {
				this.proximityCollider = null;
			}
		});
        // Additional properties can be set here
    }

    /**
     * @property {Number} proximity
     * represents the radius surrounding the
     * object with which it can be interacted with.
     * 
     * For example when a player (or anything)
     * gets close enough, based on this number,
     * it can activate something, or at least the
     * possibility for something. 
     */
    proximity = 0;

    /**
     * @property {THREE.Sphere} proximityCollider
     * a spehre object that represents the radius
     * with which it can be collided with to be
     * interacted with by other objects.
     * 
     * Initializes in first iteration of update loop
     * if proximity is more than 0;
     */
    proximityCollider = null;

    /**
     * @property {Array} objectsCollidingWith
     * represents the number of objects that
     * are currently within the given
     * proximity. 
     * 
     */
    objectsCollidingWith = [];
    async heescheel(olam) {
        await super.heescheel(olam);
        // Implement Tzomayach-specific behavior here
    }

    async ready() {
        await super.ready();
        
    }
    
	async afterBriyah() {
		await super.afterBriyah(this)
	}

    /**
     * @method heesHawvoos 
     * AKA "creation", happens
     * every frame as its "recreated"
     * @param {*} deltaTime 
     */
    heesHawvoos(deltaTime) {
        super.heesHawvoos(deltaTime);
      

        if(this.proximity > 0) {
           
            if(!this.proximityCollider) {

                this.proximityCollider = 
                new THREE.Sphere(
                    this.mesh.position.clone(),
                    this.proximity
                );
                

            } else if(this.olam) {
                this
					.proximityCollider
					.center.copy(this.mesh.position);
                if(
                    this.olam
                    .interactableNivrayim.length
                ) {
                   
                    this
                    .olam
                    .interactableNivrayim
                    .forEach(n => {
                        /**
                         * go through each
                         * nivra that can be 
                         * interacted with.
                         * 
                         **/


                        /**
                         * Only check interactions
                         * with nivrayim that have
                         * a capsule collider
                         *  
                         */

                        if(
                            n.collider &&
                            n.collider.constructor &&
                            n.collider.constructor.name == 
                            "Capsule"
                        ) {
                            
                            if(
                                /**
                                 * check if sphere,
                                 * proximity indicator,
                                 * is colliding
                                 * with nivra's capsule
                                 * collider
                                 * 
                                 */
                                Utils.capsuleSphereColliding(
                                    n.collider,
                                    this.proximityCollider
                                )
                            ) {
                               
                                /**
                                 * we are interacting / colliding
                                 * with the proper kind of nivra.
                                 * 
                                 * Now, do something.
                                 */


                                if(
                                    !this.objectsCollidingWith
                                    .includes(
                                        n
                                    )
                                ) {

                                    /**
                                     * * If we are NOT 
                                    * already colliding with it,
                                    * then add it to the 
                                    * list of currently 
                                    * colliding nivrayim
                                    * and fire an event that 
                                    * this nivra has entered
                                    * the interactive zone.
                                    */
									
                                    this.objectsCollidingWith
                                    .push(n);
                                    this.ayshPeula(
                                        "nivraNeechnas"/**
                                        creation entered */,
                                        n,
                                        this
                                    );
									
                                }
                            } else {
                                /**
                                 * if NOT currently colliding
                                 * with a nivra that we were
                                 * earlier colliding with,
                                 * it means that it left
                                 * the area, so we 
                                 * need to check IF we were
                                 * previously colliding with it
                                 * (if it was in our collision array),
                                 * and if so, if we now aren't,
                                 * then we remove it, and fire an 
                                 * event that this nivra left the area.
                                 * 
                                 */

                                if(
                                    /**
                                     * if we were already
                                     * colliding with it before
                                     */
                                    this.objectsCollidingWith
                                    .includes(
                                        n
                                    )
                                ) {
                                    /**
                                     * remove it from array
                                     * of currently colliding
                                     * objects, since we aren't
                                     * anymore.
                                     */
                                    this.objectsCollidingWith
                                    .splice(
                                        this.objectsCollidingWith
                                        .indexOf(n), 1
                                    );
                                    
                                    this.ayshPeula(
                                        "nivraYotsee"/**
                                        nivra left */, 
                                        n,
                                        this
                                    );
                                }
                            }
                        }

                        
                    });
                }
            }
        }
    }


}