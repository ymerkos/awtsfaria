/**
 * B"H
 * 
 * events related to the main player -- chossid
 */

export default function() {

    this.on("ready from chossid", () => {
        setTimeout(() => {
          //  console.log("rain starting?")
            //this.ayshPeula("start rain cycle", 77)
         //   console.log("Started rain")
        }, 500)
        
    })

    this.on("reset player position", () => {
        
        var c = this.nivrayim.find(w => 
            w.constructor.name == "Chossid"
        );
        if(!c) return console.log("couldn't find player");
        if(this.playerPosition) {
            console.log("Resseting position",this.playerPosition)
            try {
                c
                .ayshPeula(
                    "change transformation", {
                        position: this
                            .playerPosition
                    }
                );
                
            } catch(e) {
                console.log(e)
            }
        } else {
            console.log("No player position!?")
        }
    });

    this.on("save player position", () => {
        var c = this.nivrayim.find(w => 
            w.constructor.name == "Chossid" 
        );
        if(!c) return console.log("no player found");
        this.playerPosition = c.mesh.position.clone();
    //    console.log("Saved!",this.playerPosition,c.mesh.position,c.modelMesh.position)
    });
}