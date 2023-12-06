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
    timeLimit: 3 * 60, // in seconds
    on: {
        accept(sh) {
            var num = sh.totalCollectedObjects
            var coins = Array.from({length:num})
                .map(q=>({
                    placeholderName: "coin",
                    on: {
                        collected(n) {
                            n.playSound("awtsmoos://dingSound", {
                                layerName: "audio effects layer 1",
                                loop: false
                            });

                            
                            if(sh) {
                                //used for testing completion
                            // for(var i = 0; i < 3; i++)
                                sh.collectItem();
                            }
                        }
                    }
                }));

            sh.olam.loadNivrayim({
                Coin: coins
            }).then(() => {
                console.log("Added coins", coins)
            });
            
        }
    }
});