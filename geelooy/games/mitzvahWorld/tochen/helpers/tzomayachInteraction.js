/**B"H */

export default class Interaction {
	constructor() {

	}

    static nivraYotsee(nivra, me) {
      
        /**
         * Only interact with player
         */
        if(
            nivra.type != "chossid"
        ) return;

       

        if(nivra.interactingWith)
            me.ayshPeula("close dialogue");
        
        if(me.wasApproached) {
            me.ayshPeula("was moved away from")
        }

        
        me.clear("initial approach");

    }

    static clearEvents(me) {
        
        me.clear("accepted interaction");
    }

	static nivraNeechnas(nivra, me) {
        /**
         * Only interact with player
         */
        if(
            nivra.type != "chossid"
        ) return;
		me.on("initial approach", () => {
			


			nivra.ayshPeula("you approached", me);
			me.wasApproached = true;


			me.on("was moved away from", () => {

				

				me.wasApproached = false;

				nivra.interactingWith = null;
				nivra.ayshPeula("you moved away from", me);

				this.clearEvents(me);

				me.clear("was moved away from");
			});


			me.on("accepted interaction", () => {


				
				nivra.interactingWith = me;



				/**a nivra
				 * that entered interaction zone
				 */





				me.on("close dialogue", (message) => {
					nivra.ayshPeula("the dialogue was closed from", me)
					
					me.wasApproached = false;

					this.clearEvents(me);
					if (nivra.interactingWith) {
						me.ayshPeula("initial approach")
					}
					nivra.interactingWith = null;

				});
			});


			/**
			 * when first 
			 * appraoching a dialogue
			 * character,
			 * a UI component like
			 * "Press C to talk to this person"
			 * would appear, then if one DOES
			 * press C then the "accepted interaction"
			 * event is fired on the NPC, which then 
			 * opens the actual dialogue.
			 */
			if (!me.wasApproached) {
				me.ayshPeula("initial approach");
			}
		})
	}
}