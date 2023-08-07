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
    messageTree = [
        {
            message: "B\"H\nHello! How can I assist you today?",
            responses: [
                {
                    text: "Tell me more about this place.",
                    nextMessageIndex: 1
                },
                {
                    text: "I'm just browsing.",
                    nextMessageIndex: 2
                }
            ]
        },
        {
            message: "This place is a hub for adventurers like you!",
            responses: [
                {
                    text: "That's interesting. What else?",
                    nextMessageIndex: 3
                },
                {
                    text: "Thanks for the info.",
                    action: () => {
                        // Some custom action, for example:
                        console.log("Player thanked the NPC.");
                    }
                }
            ]
        },
        {
            message: "I have a special shlichus for you. \n" + 
                "Will you accept it?",
            responses: [
                {
                    text: "What's in it for me?",
                    nextMessageIndex:4
                },
                {
                    text: "Maybe",
                    nextMessageIndex: 5
                }
            ]
        },
        {
            message: "What ISN'T in it for you?",
            responses: [
                {
                    text: "Ok",
                    nextMessageIndex:4
                },
                {
                    text: "Thanks",
                    nextMessageIndex: 5
                }
            ]
        }
        
    ];

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

    currentMessageIndex = 0;
    constructor(options) {
        super(options);
        if(options.state) {
            this.state = options.state
        }

        if (Array.isArray(options.messageTree)) {
            this.messageTree = options.messageTree;
        }

        // Additional properties can be set here
    }

    get currentMessage() {
        return this.messageTree[this.currentMessageIndex] ||
        this.messageTree[0];
    }

     // Navigate to a specific response based on player choice
     chooseResponse(responseIndex) {
        const chosenResponse = this.currentMessage.responses[responseIndex];
        if(!chosenResponse) return;
        if (chosenResponse.nextMessageIndex !== undefined) {
            this.currentMessageIndex = chosenResponse.nextMessageIndex;
        } else if (chosenResponse.action) {
            chosenResponse.action();
            this.state = "idle";  // End the interaction after action is taken
        }

        this.ayshPeula("chose");
    }

    async heescheel(olam) {
        super.heescheel(olam);
        // Implement Tzoayach-specific behavior here
    }

    heesHawvoos(deltaTime) {
        super.heesHawvoos(deltaTime);
    }
}