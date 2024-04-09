/**
 * B"H
 */
var id = 1
export default ({

    id,
    type:"chain",
    nextShlichusID: 2,
    shaym: "Redemption of the Destitute 1",
    objective: "Go out into the tents (of life) "
    + "and collect 5 perutahs (coins), then bring them back to the pushka, in the center tent.",
    completeText:"Mazel Tov! You have collected all of the coins. "
    +"Now go to the pushkuh in the middle tent.",
    dialogue: {
        intro: [
            {
                message:`Welcome, brave Agent of the Divine. 

                I have a special task for you: to bring the ultimate redemption,
                one good deed at a time.

                There are sparks of the Creator spread throughout this world. I 
                need you to collect them, and use them for a divine purpose.

                Your first mission would be to find 5 coins in the world,
                and put them back in this pushka. Would you accept such a 
                mantle of responsibility?
                `,
                responses: [
                    {
                        text: "Maybe",
                        action(me) {
                            me.ayshPeula("close dialogue",
                                "Then maybe you're not ready to move on! See ya."
                            );
                        }
                    },
                    {
                        text: "Yes, whatever you say!",
                        acceptShlichus: id,
                        close: "Great. See ya soon!",
                        
                        
                    },
                    {
                        text: "nah, maybe later.",
                        action(me) {
                            me.ayshPeula("close dialogue",
                                "Ok. You'll be back!!!"
                            );
                        }
                    }
                ]
            }
            
        ],
        middle: [
            {
                message:"Did u collect all of the coins yet?",
                responses: [
                    {
                        text: "Maybe",
                        action(me) {
                            me.ayshPeula("close dialogue",
                                "Then maybe get back to it!"
                            );
                        }
                    },
                    {
                        text: "Not yet, but I'm running to get them all "
                        +"as fast as I can! I wont let you down "
                        +"(blee neder)",
                        action(me) {
                            me.ayshPeula("close dialogue", 
                            "Hopefully not");
                        }
                    }
                ]
            }
        ],
        finished: [
            {
                message:"Did u collect all of the coins yet?",
                responses: [
                    {
                        text: "Yes, Boruch Hashem! I rushed back here "
                        +"as fast as I could. Here they are.",
                        action(me) {
                            me.olam.ayshPeula("complete shlichus", id)
                            me.ayshPeula("close dialogue", 
                            "Cool. You have successfuly done your part "
                            +"to bring the redemption, so far. ");
                        }
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
    totalCollectedObjects: 5,
    collected:0,
    progressDescription: "Coins Collected",
    shlichuseemRequired: [
        /**
         * These are shlichuseem
         * that player may encounter 
         * in the process of doing this shlichus
         */
        4//Shabbos food shlichus
    ],
    collectableItems: {
        type: "Coin"
    },
    timeLimit: {
        minutes: 3,
        seconds: 0
    }, // in seconds
    returnTimeLimit: {
        minutes: 1,
        seconds: 30
    }
});