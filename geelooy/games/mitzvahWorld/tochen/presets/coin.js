/**B"H
 * 
 * for quests to collect coins,
 * this serves as the template for 
 * how each coin should behave.
 */

export default {
    placeholderName: "coin",
    on: {
        collected(n) {
            n.playSound("awtsmoos://dingSound", {
                layerName: "audio effects layer 1",
                loop: false
            });
        }
    }
}