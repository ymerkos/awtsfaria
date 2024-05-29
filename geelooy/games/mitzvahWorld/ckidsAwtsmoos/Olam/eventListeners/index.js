/**
 * B"H
 * 
 * the difference event listeners needed
 * to make the Olam class function
 */
import userInput from "./userInput.js"
import labels from "./labels.js";
import minimap from "./minimap.js";
import resizing from "./resizing.js";
import destroy from "./destroy.js"
import chossidReactions from "./chossidRaections.js";
import shlichus from "./shlichus.js"
import environment from "./environment.js"

export default function() {
    
    userInput.bind(this)();
    labels.bind(this)();
    minimap.bind(this)();
    resizing.bind(this)();
    destroy.bind(this)();
    chossidReactions.bind(this)();
    shlichus.bind(this)();
    environment.bind(this)();
    
    this.on("htmlPeula peula", ({peulaName, peulaVars}) => {
        if(!Array.isArray(peulaVars)) {
            peulaVars = [];
        }
        
        try {
            this.ayshPeula(peulaName, ...peulaVars)
        } catch(e) {
            console.log("Issue",e)
        }
    });


    this.on("htmlPeula", async ob => {
        if(!ob || typeof(ob) != "object") {
            return;
        }
        
        for(
            var k in ob
        ) {
            await this.ayshPeula("htmlPeula "+k,ob[k]);
        }
    });

    this.on("switch worlds", async(worldDayuh) => {
        var gameState = this.getGameState();
        this.ayshPeula("switchWorlds", {
            worldDayuh,
            gameState
        })
    });

    

    var lastAction;
    var lastTime = Date.now();
    this.on("increase loading percentage", async ({
        amount, action, info, subAction
    }) => {
        if(!info) info = {};
        var {
            nivra
        } = info;
        var reset = false;
        if(lastAction != action) {
            lastTime = Date.now();
            this.currentLoadingPercentage = 0;
            //this.ayshPeula("reset loading percentage")
            reset = true;
        }
        this.currentLoadingPercentage += amount;
        

        if(this.currentLoadingPercentage > 100) {
            this.currentLoadingPercentage = 100;
        }
        else {
            /*this.ayshPeula(
                "finished loading", ({
                    amount,  action,
                    total: this.currentLoadingPercentage 
                })
            )*/
        }
        this.ayshPeula("increased percentage", ({
            amount, action, subAction,
            total: this.currentLoadingPercentage,
            reset
        }))
        
        lastAction = action;
        
    });


}