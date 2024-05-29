/**
 * B"H
 */

export default function() {
    var c;
    /*setup event listeners*/
    this.on("keydown", peula => {
        c = peula.code;
        if(!this.keyStates[peula.code]) {
            this.ayshPeula("keypressed", peula);
        }
        this.keyStates[peula.code] = true;
        
        if(this.keyBindings[c]) {
            this.inputs[this.keyBindings[c]] = true;
        }
    });

    this.on("setInput", peula => {
        var c = peula.code;
        if(this.keyBindings[c]) {
            this.inputs[this.keyBindings[c]] = true;
        }
    })

    this.on("setInputOut", peula => {
        var c = peula.code;
        if(this.keyBindings[c]) {
            this.inputs[this.keyBindings[c]] = false;
        }
    })

    this.on("keyup", peula => {
        c = peula.code;
        this.keyStates[peula.code] = false;

        if(this.keyBindings[c]) {
            this.inputs[this.keyBindings[c]] = false;
        }
    });

    this.on("presskey", peula => {
        this.ayshPeula("keypressed", peula);
        var c= peula.code;

    })

    this.on('wheel', (event) => {

        this.ayin.deltaY = event.deltaY;
        this.ayshPeula("htmlAction",{
            shaym:"Debug",
            properties: {
                textContent: "In world now got diff: "
                +event.deltaY
            }
        });
        this.ayin.zoom(event.deltaY)
    })

    this.on("mousedown", peula => {
        if(!peula.isAwtsmoosMobile)
            this.ayshPeula("mouseLock", true);

        this.ayin.onMouseDown(peula);
        this.mouseDown = true;
        if(this.hoveredNivra) {
            console.log(this.hoveredNivra);
            this.ayshPeula("keypressed", {
                code: "KeyC"
            })
        }
        
    });

    this.on("mouseup", peula => {
        this.ayshPeula("mouseRelease", true);
        this.ayin.onMouseUp(peula);
        this.mouseDown = false;
        
    });
}