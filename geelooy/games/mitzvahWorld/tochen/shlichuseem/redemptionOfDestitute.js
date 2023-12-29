/**
 * B"H
 */

export default ({
    shaym: "Redemption of the Destitute",
    objective: "Go out onto the obstacle course (of life) "
    + "and collect 5 perutahs (coins), then bring them back.",
    completeText:"Mazel Tov! You have collected all of the coins. "
    +"Now go back to the person.",
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