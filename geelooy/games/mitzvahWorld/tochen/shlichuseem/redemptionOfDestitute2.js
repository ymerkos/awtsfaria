/**
 * B"H
 */

var id = 2;
var totalCoins = 4;
export default ({

    id,
    type:"chain",
    nextShlichusID: 3,
    previousShlichusID: 1,
    shaym: "Redemption of the Destitute 2",
    objective: "Go out to the cars (of life) "
    + "and collect "+totalCoins+" perutahs (coins), then bring them back to the pushka, in the center tent.",
    completeText:"Mazel Tov! You have collected all of the coins. "
    +"Now go to the pushkuh in the middle tent.",
    dialogue: {
        intro:  [
            {
                message:"Ok cool, I see you are getting pretty good at this coin finding business!",
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
                        nextMessageIndex: 1
                    }
                ]
            },
            {
                message:"Nice. Now I have another shlichus for you, if you want to take it: "+
                "Even MORE people need coins. Are you willing to go find more coins?"+
                
                "!",
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
                        action(me) {
                           

                            me.ayshPeula("close dialogue",
                                "See you soon!"
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
                        +"as far as I could. Here they are.",
                        action(me) {
                            me.olam.ayshPeula("complete shlichus", id);

                            me.ayshPeula("close dialogue", 
                            "Cool. You have successfuly done your part "
                            +"to bring the redemption. ");
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
    totalCollectedObjects: totalCoins,
    collected:0,
    progressDescription: "Coins Collected",
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