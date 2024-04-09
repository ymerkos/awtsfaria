/**
 * B"H
 */

var id = 4;
var totalItems = 7;
export default ({

    id,
    type:"single",
    shaym: "Elevation of Elements",
    requires: {
        started: [
            1
        ]
    },
    objective: "Go out to the wheat field and get some wheat for Challah baking, then bring it back.",
    tasks: [
        "Gather Wheat for Challah: Travel to the northern fields to harvest wheat. This wheat will be used to bake challah, representing physical and spiritual sustenance.",

        "Collect Grapes for Wine: Visit the eastern vineyards to gather grapes. These grapes will be turned into wine, symbolizing joy and spiritual elevation.",

        "Acquire Additional Ingredients: Seek out other ingredients needed for the Shabbat meals in local markets or from community members. Each item has its own unique spiritual significance.",

        "Return with the Ingredients: Once all items are collected, return to the starting point to prepare for Shabbat."
    ],
    completeText:"Mazel Tov! You have collected all of the items. "
    +"Now go to the gate.",
    dialogue: {
        intro:  
            [
                {
                    message: "B\"H\nWelcome, traveler! As Shabbat approaches, we seek to honor it with joy and holiness. Can you assist us in preparing for this sacred day?",
                    responses: [
                        {
                            text: "What kind of assistance do you need?",
                            nextMessageIndex: 1
                        },
                        {
                            text: "I'm sorry, I'm not available right now.",
                            close: "Well, see ya soon!" /*...*/ 
                        }
                    ]
                },
                {
                    message: "B\"H\nWe need to gather special ingredients to make Shabbat meals. These meals elevate the physical to the spiritual, embodying the Chassidic teaching of 'Dirah Betachtonim'. Will you help us?",
                    responses: [
                        {
                            text: "Tell me more about 'Dirah Betachtonim'.",
                            nextMessageIndex: 2
                        },
                        {
                            text: "I'm ready to help gather ingredients!",
                            nextMessageIndex: 4
                        },
                        {
                            text: "I'm not sure I can help.",
                            close: "Well, see ya soon!" /*...*/ 
                        }
                    ]
                },
                {
                    message: "B\"H\n'Dirah Betachtonim' means making this physical world a dwelling place for the Divine. We do this by using the material world for holy purposes, like preparing for Shabbat. Does this inspire you to help?",
                    responses: [
                        {
                            text: "Yes, I'm inspired! I'll help gather the ingredients.",
                            nextMessageIndex: 4
                        },
                        {
                            text: "It's interesting, but I must decline.",
                            close: "Well, see ya soon!" /*...*/ 
                        }
                    ]
                },
                {
                    message: "B\"H\nNo worries. Remember, every positive action brings light into this world. May your journey be blessed!",
                    close: "Well, see ya soon!" /*...*/ 
                },
                {
                    message: "B\"H\nWonderful! We need to collect wheat for challah, grapes for wine, and other foods. Each ingredient has a spiritual significance in Chassidus, elevating our Shabbat experience. Are you ready for this mission?",
                    responses: [
                        {
                            text: "Yes, I'm ready to begin!",
                            nextMessageIndex: 5
                        },
                        {
                            text: "Can you explain the spiritual significance of these ingredients?",
                            nextMessageIndex: 6
                        },
                        {
                            text: "I'm not sure this is the right task for me.",
                            close: "Well, see ya soon!" /*...*/ 
                        }
                    ]
                },
                {
                    message: "B\"H\nExcellent! Start by visiting the fields to the north for wheat, and then the vineyards to the east for grapes. Each item you gather brings more holiness into the world. Good luck!",
                    responses: [
                        {
                            
                            text: "Ok, Shabbat shalom!!",
                            
                            close: "Well, Hashem shall help you on your mission!", /*... and start mission*/ 
                            acceptShlichus: 4
                        }
                    ]
                },
                {
                    message: "B\"H\nIn Chassidus, wheat represents nourishment for both body and soul. Grapes for wine signify joy and spiritual elevation. By gathering these, we're not just preparing food; we're elevating the physical world. Ready to start?",
                    responses: [
                        {
                            text: "Yes, I understand now. Let's begin the mission!",
                            nextMessageIndex: 5
                        },
                        {
                            text: "Thank you for the explanation, but I must go.",
                            close: "Well, see ya soon!" /*...*/ 
                        }
                    ]
                }
            ]
        ,
        middle: [
            {
                message: "B\"H\nHow goes your quest to gather the Shabbat ingredients?",
                responses: [
                    {
                        text: "I'm still in the process of collecting them.",
                        nextMessageIndex: 1
                    },
                    {
                        text: "I'm finding it more challenging than expected.",
                        nextMessageIndex: 2
                    },
                    {
                        text: "I need to stop my quest.",
                        close: "Well, see ya soon!" /*...*/ 
                    }
                ]
            },
            {
                message: "B\"H\nKeep up your efforts. Each ingredient holds a spark of holiness waiting to be elevated this Shabbat.",
                close: "Well, see ya soon!" /*... and continue quest*/ 
            },
            {
                message: "B\"H\nRemember, in Chassidus, every challenge is an opportunity for growth. May you find strength and inspiration in your journey.",
                close: "Well, see ya soon!" /*... and continue quest with encouragement*/ 
            }
        ]
        ,
        finished: [
            {
                message: "B\"H\nWelcome back! Have you gathered all the ingredients for the Shabbat meals?",
                responses: [
                    {
                        text: "Yes, I have collected everything.",
                        nextMessageIndex: 1
                    },
                    {
                        text: "Not yet, I'm still working on it.",
                        close: "Well, see ya soon!" /*... and return to quest*/ 
                    }
                ]
            },
            {
                message: "B\"H\nMarvelous! Your efforts have infused these physical items with spiritual significance, truly embodying 'Dirah Betachtonim'.",
                responses: [
                    {
                        text: "It was an enlightening experience.",
                        nextMessageIndex: 2
                    },
                    {
                        text: "I'm glad to have been of service.",
                        nextMessageIndex: 2
                    }
                ]
            },
            {
                message: "B\"H\nAs a token of our gratitude, please accept this reward for your dedicated service in preparing for the holy Shabbat.",
                responses: [
                    {
                        text: "Cool. I'll take it",
                        close: "See u soon",
                        remove: true,
                        completeShlichus: id
                    }
                ]
            }
        ]
        
    },
    returnTo: {/*
        the entity that one turns the 
        mission into,
        for purposes of adding
        it to the minimap to return to.
    */
        nivra: "receiver"
    },
    totalCollectedObjects: totalItems,
    collected:0,
    progressDescription: "Items Collected",
    collectableItems: 
        {
            type: "Wheat",
            entityName: "wheat"
        }
    ,
    timeLimit: {
        minutes: 3,
        seconds: 0
    }, // in seconds
    returnTimeLimit: {
        minutes: 1,
        seconds: 30
    }
});