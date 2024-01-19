/**
 * B"H
 */

export default ({

    id:1,
    shaym: "Redemption of the Destitute",
    objective: "Go out onto the obstacle course (of life) "
    + "and collect 5 perutahs (coins), then bring them back.",
    completeText:"Mazel Tov! You have collected all of the coins. "
    +"Now go back to the person.",
    dialogue: {
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
                            sh.isActive = false;
                            sh.finish(sh);
                            me.ayshPeula("close dialogue", 
                            "Cool. You have successfuly done your part "
                            +"to bring the redemption. ");
                        }
                    }
                ]
            }
        ]
    },
    totalCollectedObjects: 5,
    collected:0,
    progressDescription: "Coins Collected",
    collectableItems: {
        itemMap: {
            placeholderName: "coin",
            on: {
                collected(n) {
                    n.playSound("awtsmoos://dingSound", {
                        layerName: "audio effects layer 1",
                        loop: false
                    });
                }
            }
        },
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