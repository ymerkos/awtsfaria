/**
 * B"H
 * 
 */


import * as AWTSMOOS from "../awtsmoosCkidsGames.js";
export default class Portal extends AWTSMOOS.Tzomayach {
    constructor(opts) {
        super(opts);
        var self = this;
        this.interactionHandler = new AWTSMOOS.Interaction(
            this, {
                approachShaym: 
                "approach portal msg",
                approachText: "the place!",
                approachAction(nivra, ih/*interaction handler*/) {
                    import(nivra.olam.getComponent
                        ("world1File")
                    ).then(m => {
                        console.log(m.default);

                        nivra.olam.ayshPeula(
                            "switch worlds",
                            m.default
                        )
                    })
                    self.ayshPeula(
                        "close dialogue", "Ok cool story!!"
                    );
                }

            }
        );

        this.on("nivraNeechnas", nivra => {
            
            this.interactionHandler.nivraNeechnas(nivra);
        });

        this.on("nivraYotsee", nivra => {
            this.interactionHandler.nivraYotsee(nivra);

        });
    }
}