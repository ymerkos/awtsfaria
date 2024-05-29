/**
 * B"H
 * 
 Olam events related to handling missions (shlichuseem)
 */

 export default function() {

    this.on("get shlichus data", shlichusID => {
        var shl = this.modules.shlichuseem;
        if(!shl) return null;
        if(typeof(shl) != "object") {
            return null;
        }
        var found = null;
        Object.keys(shl).forEach(w=> {
            if(found) return;
            var sh = shl[w];
            if(sh.id == shlichusID) {
                found = sh;
            }
        });
        return found;
    });

    //nivra.iconPath = "indicators/exclamation.svg"
    this.on("is shlichus available", shlichusID => {
        if(Array.isArray(shlichusID)) {
            var hasIt = false;
            for(var k of shlichusID) {
                var isItAvailable = this.ayshPeula("is shlichus available",k);
                if(isItAvailable) {
                    hasIt = isItAvailable;
                    return hasIt;
                }
            }
        }
        let shlichusData =  this.ayshPeula("get shlichus data", shlichusID);
        if(!shlichusData) {
            return null;
        }
        
        var r = shlichusData.requires;
        if(!r) return shlichusData;
        var st = r.started;
        if(Array.isArray(st)) {
            /**
                * if it requires certain shlichuseem to be started check
                * if they are ALL started
                */
            var allStarted = true;
            for(var n of st) {
                var started = this.ayshPeula("is shlichus started", n);
            
                if(!started) {
                    allStarted = false;
                    return allStarted;
                }
            }
            
            return shlichusData;
        }
        return shlichusData;
    })
    /**
        * Gets most recent shlichus data in chain of shlichuseem.
        * 
        * @param {number} shlichusID - The ID of the STARTING shlichus.
        * @returns {number|null} The ID of the next shlichus 
        * in the chain that hasn't been completed,
        *  or null if all are completed.
        */
    this.on("get next shlichus data",  (shlichusID) => {
        try {
            let currentShlichusData =  this.ayshPeula("get shlichus data", shlichusID);
            
            if(!currentShlichusData) {
                
                return null;
            }
            
        //     console.log("Trying",currentShlichusData,shlichusID)

            var r = currentShlichusData.requires;
            if(r) {
                var st = r.started;
                if(st) {
                    var isStarted = true;
                    if(Array.isArray(st)) {
                        st.forEach(w => {
                            var started = 
                            this.ayshPeula("is shlichus started", w);
                            if(!started) {
                                isStarted = false;
                            }
                        })
                    }
                    if(!isStarted) {

                        return null;
                    }
                }
            }
            if(currentShlichusData.type !== "chain") {
                if(this.completedShlichuseem.includes(shlichusID))
                    return null;

                return currentShlichusData// null;
            }
            if(!currentShlichusData.nextShlichusID) return null;
            // Recursively check the next shlichus if the current one is completed
            while (
                
                currentShlichusData.nextShlichusID
            ) {
                const isDone = this.ayshPeula(
                    "is shlichus completed", 
                    currentShlichusData.id
                );
                if (!isDone) {
                    return currentShlichusData;
                }

                currentShlichusData =  this.ayshPeula(
                    "get shlichus data",
                    currentShlichusData.nextShlichusID
                );
            }

            if(!currentShlichusData) {
                return null;
            }
            
            // If the chain ends or the 
            //current shlichus is not completed, return the current shlichus data
            //(2nd to last one, should be last result at this point)
            return currentShlichusData.type === "chain" ? currentShlichusData : null;
        } catch (error) {
            console.error("Error in getting next shlichus data: ", error);
            return null;
        }
        
    });



    
    this.on("get active shlichus", shlichusID => {
    //    console.log("Trying",shlichusID,this.shlichusHandler)
        if(!this.shlichusHandler) {
            console.log("NOT!")
            return null;
        }
        var sh = this.shlichusHandler.getShlichusByID(shlichusID);
        return sh;  
    });

    

    this.on("accept shlichus",async  (shlichusID, giver) => {
        if(!this.shlichusHandler) return null;
            var shData = this.ayshPeula("get shlichus data", shlichusID);
            if(!shData) return null;

            var shl = await this.shlichusHandler.
                createShlichus(shData, giver);

            shl.initiate();
            this.ayshPeula("updateProgress",{
                
                ["acceptedShlichus_"+shlichusID]: {
                    shlichusID,
                    time: Date.now()
                }
            })

            /*
                add to list of started shlichuseem
                
            */
            
            var ind = this.startedShlichuseem.indexOf(shlichusID);
            if(ind < 0) {
                this.startedShlichuseem.push(shlichusID)
            }
            return shl;
    });

    this.on("complete shlichus", sID => {
        var ash = this.ayshPeula("get active shlichus", sID)
        if(!ash) return false;

        ash.isActive = false;
        
        this.ayshPeula("updateProgress",{
                
            completedShlichus: {
                shlichusID: sID,
                time: Date.now()
            }
        })
        var ind = this.completedShlichuseem.indexOf(sID);
        if(ind < 0) {
            this.completedShlichuseem.push(sID)
        }

        ash.finish(ash);
    });

    this.on("remove shlichus", sID => {
        var ind = this.startedShlichuseem.indexOf(sID);
        if(ind > -1) {
            this.startedShlichuseem.splice(ind, 1)
        }
    })
    this.on("is shlichus started", sID => {
        return this.startedShlichuseem.includes(sID)
    });

    this.on("is shlichus completed", sID => {
        return this.completedShlichuseem.includes(sID)
    });
 }