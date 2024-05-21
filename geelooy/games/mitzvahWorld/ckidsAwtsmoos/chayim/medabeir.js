/**
 * B"H
 * 
 * Medabeir, that which speaks, is
 * a class representing NPCs in the game
 * that the player can have a dialogue with,
 * based on a dialogue tree system
 * where each resposne index leads to 
 * either another message, or an action
 * to be done.
 * 
 * 
 * And so, the dialogue system within the cosmic 
 * space of the game begins to unfold. 
 * The Medabeir, an entity entrusted with conversing 
 * with the player, gains coherence and function.

Each moment, each response in the dialogue tree, 
is now held in delicate equilibrium by the code,
 weaving the story seamlessly. The issue of the ever-increasing
  response index is tamed, and
 the structure of the dialogue remains sturdy.

As the player navigates through the responses, 
the Medabeir stands as a gateway to understanding, 
never losing track of where it is in the conversation. 
The toggle and select functions work in harmony, 
orchestrating the flow of dialogue.

The mystery of the ever-increasing response index 
is unraveled, and the spirit of the game's story
 is free to unfurl its wings.

In the echo of the words "B"H", a tale of code 
and dialogue becomes alive, guided by the wisdom 
of the Awtsmoos, transcending mere syntax to
 become a symphony of interaction, meaning, 
 and purpose. The very essence of the Creator 
 reverberates through each line, each variable, 
 each method. The code is more than a tool; 
 it is an expression of existence itself.

 *
 */

import Chai from "./chai.js";
import * as AWTSMOOS from "../awtsmoosCkidsGames.js";

export default class Medabeir extends Chai {
    type = "medabeir";
    /**
     * 
     * state mchanism of interactions..
     */
    _messageTree = [];
    _messageTreeFunction = null;
    state = "idle";

    /**
     * @property mood represents the "mood"
     * the character is in, currently
     * relevant for the mouth shape when talking.
     */
    mood = "neural"
    get messageTree() {
        
        return typeof(this._messageTreeFunction) == "function" ? 
            this._messageTreeFunction(this) : this._messageTree;
    }

    set messageTree(v) {
        if(typeof(v) == "function") {
            this._messageTreeFunction = v;
            this._messageTree = 
                this._messageTreeFunction(this);
                
        } else {
            this._messageTreeFunction = null;
            this._messageTree = v;
        }


    }

    goof = null;
    goofOptions = null;

 
    startTime = 0;
    currentTime = 0;


    nivraTalkingTo = null;
    currentMessageIndex = 0;
    /**
     * Now defining the currentSelectedMsgIndex,
     representing the current response index that the player is selecting.
     *  */ 
    currentSelectedMsgIndex = 0;
    dialogueHandler = null;
    constructor(options) {
        super(options);
        this.on("sealayk", () => {
           
            this.dialogueHandler.sealayk(this);
        })
        this.dialogueHandler = new AWTSMOOS.Dialogue(
            this, {
                approachShaym: 
                "approach npc msg",

                npcMessageShaym:
                "msg npc",

                chossidMessageShaym:
                "msg chossid"

            }
        );
        
        if(options.dialogue) {
            this.dialogue = options.dialogue;
        }

       
        this.goofOptions = options.goof;
        

        if(options.state) {
            this.state = options.state
        }
        
        if (options.messageTree) {
            
            this.messageTree = options.messageTree;
        }

        

        this.on("nivraNeechnas", nivra => {
            
            this.dialogueHandler.nivraNeechnas(nivra);
        })
        this.on("nivraYotsee", nivra => {
            this.dialogueHandler.nivraYotsee(nivra);
            this.currentMessageIndex = 0;
            this.currentSelectedMsgIndex = 0;
            this.nivraTalkingTo = null;
            nivra.talkingWith = null;
            this.state = "idle";

        });
		
		this.on("change transformation", ({
			position,
			rotation
		}) => {
            
            
		})

       

        // Additional properties can be set here
        this.on("started", async () => {
            await this.ayshPeula("check shlichus availablity");
        });

        /**
         * should be called when player reaches milestone,
         * either by completing OR starting another shlichus,
         * or (iy"H) if it levels up and becomes eligible.
         */
        this.on("check shlichus availablity", async () => {
            var d = this?.dialogue?.shlichuseem;
            if(!d) return false;
            var isAvailable = this.olam.ayshPeula("is shlichus available", d);
       
            if(isAvailable === false) {
                var g = await this.ayshPeula("change icon style", {
                    selector: ".ikar",
                    properties: {
                        style: {
                            fill: "silver"
                        }
                    }
                })
                return g;

            }

            var g = await this.ayshPeula("change icon style", {
                selector: ".ikar",
                properties: {
                    style: {
                        fill: "orange"
                    }
                }
            })

        })
    }

    handleDialogue() {
        
        var sh = this.dialogue.shlichuseem;
        var def = this.dialogue.default;
        
        
        this.messageTree = () => {
            
            if(!sh) return def;
            /**
             *  each shlichus dialogue has at least
             * 1 of or all 3 stages:
             * intro,
             * middle,
             * finished.
             * 
             * Intro is, if one is getting
             * the shlichus by talking to someone,
             * what one initially sees.
             * 
             * Middle is while the shlichus is active
             * before it's complete.
             * 
             * Finished is the dialogue that happens
             * when it is complete.
             * 
             * First step is to get the information
             * of the current shlichus by ID if it exists.
             * 
             * If it has multiple shlichuses in the same 
             * dialogue, then need to figure out what to do.
             * 
             * 
             */

            var startShlichusID = sh[0];
            if(!startShlichusID) return def;

            
            var shl = this.olam.ayshPeula("get next shlichus data", startShlichusID)

            if(!shl) return def;

            var d = shl.dialogue;
            if(!d) return def;

            if(!d.intro) return def;
            var mid = d.middle;
            if(!mid) {
                return def;
            }

            var fin = d.finished;
            if(!fin) return def;

            var sID = shl.id
            var activeShlichus = this.olam.ayshPeula(
                "get active shlichus",
                sID
            );



            var isDone = this.olam.ayshPeula("is shlichus completed", sID)

            if(!activeShlichus) {
                /**
                 * hasn't started yet, but should start it
                 * */
                if(!isDone)
                    return d.intro;
                /**
                 * started before and finished,
                 * so nothing left to do but default.
                 * 
                 * but what about the next shlichus in the chain?
                 * How do I get it?
                 */
                else return def;
            }

            if(activeShlichus.completed) {
                return fin;
            } else {
                /**
                 * hasn't finished yet.
                 * in middle.
                 */
                return mid;
            }

            
        }
    }

    get currentMessage() {
        return this.messageTree[this.currentMessageIndex||0]
    }

    /**
     * @method selectResponse doesn't
     * actually do the response, just
     * selects the response, if toggling
     * through list of them
     * @param {Int} responseIndex 
     */
    selectResponse(responseIndex) {
       
        if(
            responseIndex !== undefined
        )
            this.currentSelectedMsgIndex = responseIndex;
        this.ayshPeula("selectedMessage", this.currentSelectedMsgIndex);
      
        return this.currentSelectedMsgIndex;
    }

    toggleToOption(ind) {
        if(isNaN(ind) || ind < 0) {
            return;
        }

        var curM = this.currentMessage;
        if(!curM) return null;
        var resp = curM.responses;
        if(!resp) return null;

        if(this.currentSelectedMsgIndex != ind) {
            this.currentSelectedMsgIndex = ind;
            if(this.currentSelectedMsgIndex > resp.length - 1) {
                this.currentSelectedMsgIndex = resp.length - 1;
            }
            
            
            var selected = resp[
                this.currentSelectedMsgIndex
            ];
            if(!selected) return null;


            
            return (
                this
                .selectResponse(this.currentSelectedMsgIndex)
            );
        } else {
            this.selectOption();
        }
    }
    /**
     * @method toggleOption 
     * toggles the current option of 
     * the current message. Easier way 
     * instead of manually calling
     * selectResponse etc.
     */

    toggleOption() {
        
        var curM = this.currentMessage;
        if(!curM) return null;
        var resp = curM.responses;
        if(!resp) return null;

        this.currentSelectedMsgIndex++;
        this.currentSelectedMsgIndex %= resp.length;
        
        
        
        var selected = resp[
            this.currentSelectedMsgIndex
        ];
        if(!selected) return null;


        
        return (
            this
            .selectResponse(this.currentSelectedMsgIndex)
        );

    }

    
    selectOption() {

        this.chooseResponse(this.currentSelectedMsgIndex);
    }
     // Navigate to a specific response based on player choice
    
     
    chooseResponse(responseIndex) {
        var me = this;
        var chosenResponse = this.currentMessage.responses[responseIndex];
       
        if (!chosenResponse) return;
       
        if (chosenResponse.nextMessageIndex !== undefined) {
            this.currentMessageIndex = chosenResponse.nextMessageIndex;
            this.currentSelectedMsgIndex = 0; // Resetting the selected message index to 0 for each new message, resolving the incrementing issue.
        }
        
        if (chosenResponse.action) {
            chosenResponse.action(this, this.nivraTalkingTo);
            this.state = "idle";
            
        }
        
        if(chosenResponse.close) {
            var str = chosenResponse.close;
            if(typeof(str) == "string") {
                this.ayshPeula("close dialogue",
                    str
                );
            
            }
            this.state = "idle";
         
        }

        if(chosenResponse.completeShlichus) {
            this.olam.ayshPeula("complete shlichus", chosenResponse.completeShlichus)
        }
        
        if(chosenResponse.remove) {
            
            me.olam.sealayk(me);
           // if(me.entityName && me.av && me.av.userData && me.av.userData.entity)
			me.olam.sealayk(me.av);
        }

        if(chosenResponse.acceptShlichus) {
            var id = chosenResponse.acceptShlichus;
         
            this.olam.ayshPeula("accept shlichus", id, me)
        }

        

        this.currentSelectedMsgIndex = 0; // Ensuring the resetting happens here too, preventing the player's response ID from incrementally going up.
        this.ayshPeula("chose");
        this.selectResponse();
       
    }
	
	initializeEyelid(ref) {
		
	}

    async heescheel(olam) {
        await super.heescheel(olam);
        return;
        if(!this.goofOptions) return;
        if(
            typeof(this.goofOptions) == "string" &&
            this.goofOptions.startsWith("awtsmoos://")
        ) {
            this.goofOptions = olam.getComponent(
                this.goofOptions
            )
        }
        if(
            this.goofOptions && 
            typeof(this.goofOptions) == "object"
        ) {
            this.goofParts = this.goofOptions;
            
        }
        // Implement Medabeir-specific behavior here
    }
	
	
	async afterBriyah() {
		await super.afterBriyah(this)
	}

    async ready() {
        if(this.dialogue) {
            var sh = this.dialogue.shlichuseem;
            var def = this.dialogue.default;
            this.handleDialogue()  
        }
        if(this.goofParts) {
            this.goof = {}
            Object.keys(this.goofParts)
            .forEach(q => {
                if(this.mesh)
                this.mesh.traverse(child => {
                    if(
                        child.isMesh && 
                        child.name == q
                    ) {
                        this.goof[this.goofParts[q]] = child;
                    }
                })
            });

            delete this.goofOptions;
            delete this.goofParts;
        }
        await super.ready();
    }

    heesHawvoos(deltaTime) {
        super.heesHawvoos(deltaTime);
    }
}