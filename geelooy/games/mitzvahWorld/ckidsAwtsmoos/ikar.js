/**
 * B"H
 * 
 */
var w = new Worker(
    "./ckidsAwtsmoos/oyved.js",
    {
        type: "module"
    }
);

window.wk=w;
console.log("B\"H");
var canvas = document.createElement("canvas");
var container = document.getElementById("container");
container.appendChild(canvas);
var ctx = canvas.getContext("2d");

var tawfkeedeem = {
    async pawsawch() {
        console.log("opened");
        var model = "./models/gltf/collision-world.glb";
        var loaded = await fetch(model);
        var blob = await loaded.blob();
        var url = URL.createObjectURL(blob);
        w.postMessage({
            heescheel: {
                nivrayim: {
                    Domem: {
                        world: {
                            path: url
                        }
                    }
                }
            }
        })
    },
    async getBitmap(bit) {
        console.log(bit);
        canvas.width = bit.width;
        canvas.height=bit.height;
        ctx.drawImage(bit,0, 0);
    }
}

w.addEventListener("message", async e => {
    console.log("Got",e.data);
    var dayuh/*data*/ = e.data;
    if(typeof(dayuh) == "object") {
        console.log("Got it, going", dayuh)
        await Promise.all(Object.keys(dayuh).map(async q=>{
            var tawfeek /*function to do*/
                = tawfkeedeem[q];
            if(typeof(tawfeek) == "function") {

                console.log("Trying",tawfeek)
                var result = await tawfeek(dayuh[q]);
                postMessage({
                    [q]: result
                })
            }
        }))
    }
}, false);
