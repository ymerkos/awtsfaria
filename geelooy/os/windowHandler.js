//B"H
import ResizableWindow from "./windows.js"
import {
    programs,
    programsByExtensionDefaults
}
export default class WindowHandler {
    windows = [];
    constructor() {

    }
    getExtension(title) {
        var l = title.lastIndexOf(".")
        if(l > -1) {
            return title.substring(l)
        }
        return null;
    }
    addWindow({title, content}) {
        var ext = this.getExtension(title);
        var prog = programsByExtensionDefaults[ext];
        if(prog) {
            var program = programs[prog];
            if(program) {
                content = program(title, content);
            }
        }
        var wind = new ResizableWindow({
            title, content,
            handler: this
        });
        this.windows.push(wind);
    }

    onactive(w)  {
        console.log("ACTIVATING",w)
        this.windows.forEach(wn => {
            if(w == wn) return console.log("SELF")
            wn?.makeInactive?.();
        });
    }

    onclose(w) {
        console.log("CLOSED window",w)
        var ind = this.windows.indexOf(w);
        if(ind > -1) {
            this.windows.splice(ind, 1);
        }
    }

}
