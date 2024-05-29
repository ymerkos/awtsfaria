/**
 * B"H
 * 
 * events for showing or hiding labels 
 * when hovering over dynamic objects in game
 */
import * as THREE from '/games/scripts/build/three.module.js';

export default function() {
    this.pointer = new THREE.Vector2();
    var intersected = null;
    var hoveredLabel = false;

    this.on("hide label", async () => {
        await this.htmlAction({
            shaym: "minimap label",
            properties: {
                innerHTML: "",
                style: {
                    
                    transform:`translate(${-1e4}px, ${
                        -1e4
                    }px)`
                }
            },
            
            methods: {
                classList: {
                    add: "invisible"
                }
            }
        })
    })

    const mouseMove = async peula => {
        if(!this.boundingRect) {
            return;
        }
        if(peula) {
            this.achbar.x = peula.clientX;
            this.achbar.y = peula.clientY;
        }
        var {
            left,
            top,
            width,
            height
        } = this.boundingRect
        if(peula) {
            this.pointer.x = ((peula.clientX - left) / width) * 2 -1;
            this.pointer.y = -(
                (peula.clientY - top) / height
            ) * 2 + 1;
        }

        /**
         * as mouse moves check if any objects 
         * are being hovered over
         */

        var hit = this.ayin.getHovered()
        
        var ob = hit?.object;
        //   console.log("HIT 1",hit,ob)
        var niv = ob?.nivraAwtsmoos;
        const removeIntersted = () => {
            intersected.niv.isHoveredOver = false;
            this.hoveredNivra = null;

            intersected
            .ob.material.emissive.setHex( 
                // intersected.currentHex
                0x00
                );
            intersected = null;
            this.htmlAction({
                selector: "body",
                properties: {
                    style: {
                        cursor: "revert"
                    }
                }
            })
        }
        
        if(niv && !niv.wasSealayked) {
            niv.isHoveredOver = true;
            if(intersected && intersected?.niv != niv) {

                
                removeIntersted()
            }
            if((niv.dialogue || ob.hasDialogue)) {
                const makeMessage = async ({
                    tooFar=false,
                    gone=false
                }={}) => {
                    if(gone) {
                        await this.ayshPeula("hide label")
                        return;
                    }
                    var msg = "This is: " + niv.name;
                    if(!niv.inRangeNivra || tooFar) {
                        msg += ".\nYou are too far away. Come closer!"
                    }
                    var tx = this.achbar.x;
                    var ty = this.achbar.y;
                    hoveredLabel = true;
                    await this.htmlAction({
                        shaym: "minimap label",
                        properties: {
                            innerHTML:msg,
                            style: {
                                
                                transform:`translate(${tx}px, ${ty}px)`
                            }
                        },
                        
                        methods: {
                            classList: {
                                remove: "invisible"
                            }
                        }
                    })
                }
                await makeMessage()
                
                if(intersected?.niv != niv) {
                    console.log("NIV")
                    //wasApproached
                    var color = 0xff0000;
                    if(niv?.wasApproached) {
                        color = 0x00ff00;
                    }
                    

                    if(!ob.material.awtsmoosifized) {
                        var nm = ob.material.clone();
                        nm.awtsmoosifized = true;
                        nm.needsUpdate = true;
                        ob.material = nm;
                        
                    }

                    

                    niv.on("someone left", async () => {
                        if(!niv.isHoveredOver) return;
                        if(!ob) {
                            await makeMessage({gone:true})
                            ob.material.emissive.setHex(0x00);
                            niv.clear("someone left")
                            
                        } else {
                            await makeMessage({tooFar:true})
                            ob.material.emissive.setHex(0xff0000);
                            
                        }
                        await mouseMove();
                    });

                
                    niv.on("was approached", async () => {
                        if(!niv.isHoveredOver) return;
                        if(ob) {
                            ob.material.emissive.setHex(0x00ff00)
                            await makeMessage()
                        } else {
                            ob.material.emissive.setHex(0x00);
                            niv.clear("was approached")
                            
                        }
                        await mouseMove();
                    })
                    
                    
                    intersected = {niv, ob};
                    intersected.currentHex = ob
                        .material
                        .emissive.getHex();
                    ob.material.emissive.setHex( color );
                    this.hoveredNivra = niv;
                    this.htmlAction({
                        selector: "body",
                        properties: {
                            style: {
                                cursor: "pointer"
                            }
                        }
                    })
                }
        
            }
        } else {
            if(hoveredLabel) {
                hoveredLabel = false;
                await this.ayshPeula("hide label");
                
            }
            if(intersected) {
                
                removeIntersted()
            }
            

        }
        this.hoveredNivra = niv;
        if(this.mouseDown) {
            this.ayin.onMouseMove(peula);
        }

    };


    this.on("mousemove", mouseMove);
}