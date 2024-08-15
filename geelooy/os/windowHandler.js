//B"H
class WindowHandler {
    windows = [];
    constructor() {

    }

    addWindow({title, content}) {
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