/**
 * B"H
 */

export default {
    shaym: "custom world",
    className: "customWorldScreen hidden",
    children: [
        {
            tag: "button",
            textContent: "Back",
            onclick(e, $, ui) {
                var mm = $("main menu");
                if(!mm) {
                    alert("Can't go back!")
                    return;
                }
                mm.classList.remove("hidden");
                var cw = $("custom world");
                cw.classList.add("hidden")
            }
        },
        {
            textContent: "Make a custom world",
            className: "hdr1"
        },
        {
            tag: "Button",
            textContent: "Click to import world file",
            onclick(e, $, ui) {
                var ikar = $("ikar");
                var mm = $("main menu");
                console.log(mm.gameUiHTML,"hihi")
                if(!ikar || !mm) {
                    alert("Can't do something, contact Coby")
                    return;
                }
                var inp = ui.html({
                    tag: "input",
                    type: "file",
                    className:"hidden",
                    async onchange(e) {
                        if(!e.target.files[0]) {
                            alert("No file selected!")
                            return;
                        }
                        var lvl = await new Promise(async (r,j) => {
                            var req = await fetch(URL.createObjectURL(
                                e.target.files[0])
                            );
                            var txt = await req.text();
                            r(txt);
                        });
                        var bl =  URL.createObjectURL(
                            new Blob([
                                lvl
                            ], {
                                type: "application/javascript"
                            })
                        );
                        console.log("BLOB",bl)
                        var dayuhOfOlam = await import(
                           bl
                        )
                            
                        //, {type:"application/javascript"}
                        console.log("Got it",lvl,dayuhOfOlam,mm.gameUiHTML)
                        
                        try {
                            ikar.dispatchEvent(
                                new CustomEvent("start", {
                                    detail: {
                                        worldDayuh: dayuhOfOlam
                                            .default,
                                        gameUiHTML:
                                        mm.gameUiHTML
                                    }
                                })
                            );
                            var cw = $("custom world");
                            cw.classList.add("hidden")

                            var ld = $("loading");

                            mm.classList.add("hidden")
                            mm.isGoing = false;

                            if(!ld) return;
                            ld.classList.remove("hidden");
                        } catch(e) {
                            alert("Couldn't load it")
                            console.log(e);
                        }
                        

                       
                        
                        
                    }
                });
                inp.click();
            }
        }
    ]
};