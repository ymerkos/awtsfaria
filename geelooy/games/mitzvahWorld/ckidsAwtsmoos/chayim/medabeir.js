/**
 * B"H
 */

import Chai from "./chai.js";


export default class Medabeir extends Chai {
    type = "medabeir";
    /**
     * 
     * state mchanism of interactions..
     */
    state = "idle";
    messageTree = [];

    /**
     messages: [
                                    "B\"H\n."+
                                    "Hi! How are you today?"
                                    +"\n(press F to continue)",
                                    "I have a special Shlichus "
                                    +"(mission) for you. Do you "
                                    +"want to accept it? "
                                ],
     */
 
    nivraTalkingTo = null;
    currentMessageIndex = 0;
    currentSelectedMsgIndex = 0;

    constructor(options) {
        super(options);
        if(options.state) {
            this.state = options.state
        }

        if (Array.isArray(options.messageTree)) {
            this.messageTree = options.messageTree;
        }

        this.on("nivraNeechnas", nivra => {
            this.nivraTalkingTo = nivra;
            nivra.talkingWith = this;

            if(this.state == "idle") {
                this.state = "talking";
            }
            this.selectResponse();
        })

        this.on("nivraYotsee", nivra => {
            this.currentMessageIndex = 0;
            this.currentSelectedMsgIndex = 0;
            this.nivraTalkingTo = null;
            nivra.talkingWith = null;
            this.state = "idle";

        });
        // Additional properties can be set here
    }

    get currentMessage() {
        return this.messageTree[this.currentMessageIndex] ||
        this.messageTree[0];
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
        this.ayshPeula("selectedMessage", responseIndex);
        return this.currentSelectedMsgIndex;
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
        const chosenResponse = this.currentMessage.responses[responseIndex];
        if(!chosenResponse) return;

        
        if (chosenResponse.nextMessageIndex !== undefined) {
            //this.selectResponse(0);
            this.currentMessageIndex = chosenResponse.nextMessageIndex;
        } else if (chosenResponse.action) {
            chosenResponse.action(this, this.nivraTalkingTo);
            this.state = "idle"; 
        }

        this.ayshPeula("chose");
        this.ayshPeula("selectedMessage");
    }

    async heescheel(olam) {
        super.heescheel(olam);
        // Implement Tzoayach-specific behavior here
    }

    heesHawvoos(deltaTime) {
        super.heesHawvoos(deltaTime);
    }
}