/**B"H */

export default class Interaction {
    me = null;
    opts = {};
	constructor(me, opts = {}) {
        this.me = me;
        this.opts = opts;
        this.approachTxt = typeof(opts.approachTxt) 
        == "function" ? opts.approachTxt :
            (() => this.me.name);
        
	}

    sealayk(nivra ) {
        console.log("removing")
        this.me.olam.htmlAction({

            shaym: this.opts.npcMessageShaym,
            
            methods: {
                classList: {
                    remove: "active"
                }
            }
        });

        this.nivraYotsee(nivra)

    }

    nivraYotsee(nivra) {
      
        /**
         * Only interact with player
         */
        if(
            nivra.type != "chossid"
        ) return;

       

        if(nivra.interactingWith)
            this.me.ayshPeula("close dialogue");
        
        if(this.me.wasApproached) {
            this.me.ayshPeula("was moved away from")
        }

        
        this.me.clear("initial approach");

    }

    clearEvents() {
      //  this.me.clear("sealayk");
        this.me.clear("accepted interaction");
    }

	nivraNeechnas(nivra) {
        /**
         * Only interact with player
         */
        if(
            nivra.type != "chossid"
        ) return;
        
        this.me.on("sealayk", () => {
            this.sealayk(nivra)
        })
		this.me.on("initial approach", () => {
            this.me.inRangeNivra = nivra;
            this.me.ayshPeula("was approached", nivra)
            if(this.opts.approachShaym)
                this.me.olam.htmlAction({
                    shaym: this.opts.approachShaym,
                    methods: {
                        classList: {
                            remove: "hidden"
                        }
                    },
                    properties: {
                        textContent: this.approachTxt()
                    }
                });

			nivra.ayshPeula("you approached", this.me);
			this.me.wasApproached = nivra;


			this.me.on("was moved away from", () => {
                this.me.ayshPeula("someone left", nivra)
                this.me.inRangeNivra = null;
				if(this.opts.approachShaym)
                    this.me.olam.htmlAction({
                        shaym: this.opts.approachShaym,
                        methods: {
                            classList: {
                                add: "hidden"
                            },
                        },
                        properties: {
                            innerText: ""
                        }
                    });
				this.me.wasApproached = false;

				nivra.interactingWith = null;
				nivra.ayshPeula("you moved away from", this.me);

				this.clearEvents();

				this.me.clear("was moved away from");
			});


			this.me.on("accepted interaction", () => {

                if(this.opts.approachShaym)
                    this.me.olam.htmlAction({
                        shaym: this.opts.approachShaym,
                        methods: {
                            classList: {
                                add: "hidden"
                            }
                        },
                        properties: {
                            innerText: ""
                        }
                    });
                if(typeof(
                    this.opts.approachAction
                ) == "function") {
                    this.opts.approachAction(nivra, this);
                }
				
				nivra.interactingWith = this.me;



				/**a nivra
				 * that entered interaction zone
				 */





				this.me.on("close dialogue", (message) => {
					nivra.ayshPeula("the dialogue was closed from", this.me)
					
					this.me.wasApproached = false;

					this.clearEvents();
					if (nivra.interactingWith) {
						this.me.ayshPeula("initial approach")
					}
					nivra.interactingWith = null;

				});
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
        if (!this.me.wasApproached) {
            this.me.ayshPeula("initial approach");
        }
	}
}