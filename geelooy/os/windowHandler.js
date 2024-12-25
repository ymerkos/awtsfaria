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
        var path = this.path;
        if(!path) return;
        await this.db.Koysayv(path, fileName, content);
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
        if(prog) {
            var program = programs[prog];
            if(program) {
                var system = new System({path, os})
                content = program(title, content, save);
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
