//B"H
import ResizableWindow from "./windows.js"
import {
    programs,
    programsByExtensionDefaults
} from "./basicPrograms.js"
class System {
    path = null
    os = null
    constructor({path, os}={}) {
        this.path = path;
        this.os = os
    }
    async save(program) {
        var content = program?.content();
        var fileName = program?.fileName();
        console.log("Trying",fileName,content,program);
        if(!fileName) return false;
        var path = this.path;
        if(!path) return;
        console.log("doing filenam",fileName,content);
        
        window.os = this.os;
        
        await this.os?.db.Koysayv(path, fileName, content);
        return true;
    }
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
    addWindow({title, content, path, os}) {
        var ext = this.getExtension(title);
        var prog = programsByExtensionDefaults[ext];
        var program;
        if(prog) {
            var program = programs[prog];
            if(program) {
                var system = new System({path, os})
                program = program({
                    fileName: title, 
                    content, 
                    system,
                    extension:ext
                })
                content = program?.div;
            }
        }
        var wind = new ResizableWindow({
            title, content,
            handler: this
        });
        wind.onresize = e => {
            program?.onresize(e)
        }
        console.log(window.pr=program);
        program?.coded()?.init()
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
