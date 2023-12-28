//B"H

async function loadJSON() {
    var j = await showOpenFilePicker();
    var url = URL.createObjectURL(await j[0].getFile());
    var json = null;
    try {
        var r = await fetch(url)
        var js = await r.json()
        json=js;
    } catch(e){

    }
    window.g=j
    if(json)window.json=json;

    if(!json) return alert("No JSON file!");

    return json;
}


async function doItAll() {
    //f is AwtsmoosGPTify instance
    for(var vb of h) {
        var pages = getPagesOfEntry(vb)
        for(var pg of pages) {
            var h = await f.go({
                prompt: `B"H
                    <Awtsmoos>
                    <info>
                    <script>
                    var info = JSON.stringify({
                        vol:${vb.vol_eng},
                        page: ${vb.page},
                        title: ${vb.title},
                        num: ${vb.num},
                        order: ${vb.order},
                        summary: ${vb.summary}

                    })
                    </script>
                    </info>
                    <instructions>Write the most vivid chapter of all 
                    that completely and absolutely gets EVERY detail of 
                    this text, keep track of context and questions and answers
                    do NOT EVER mix female and male stories in the same chapter
                    use TONS of sensory details RIPPING the essence of existence
                    completely apart
        
                    dont overdo it. make sure it STICKS TO THE ORIGINAL TEXT
                    and FULLY captures EVERY detail of the text 
        
                    do not devite. make a metaphorical series of events that
                    surrounds it but also make sure to FULLY and COMPLETELY
                    get every detail of the text absolutely in the chapter of the novel. character development. plot twists. lots of dialogue between different characters. bring the ideas to life don't just say them (but also have some of the characters say the ideas in the text casually, but mainly make them LIVE it fully) SLOW pace very slow intense vivid the sensory details are the main thing and EXQUISIT profound metaphors tearing through the veil of existence and beyond.
        
                    Here is the text
        
                    </instructions>
                    <page>${pg.number}</page>
                    <sicha>
                        ${pg.content}
                    </sicha>

                    ${vb.kitzur? `
                    <instructions>

                    and here is the general idea of the ENTIRE thing, to keep in mind just in general throughout, sometimes incorporate the ideas along with the main text, sometimes just know about it:
                    `+vb.kitzur+`
                    </instructions>`:""}
                    </Awtsmoos>
        
                    
                `,
                onstream(d) {
                    console.log("DOING",pg,pg.number,pg.content,vb)
                }
            })
        }
    }

}