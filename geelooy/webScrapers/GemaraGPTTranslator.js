//B"H
/**
 * Assumes AwtsmoosGPTify function is included
 * specifically for gemara format from chabad.org
 * example snippet of data:
 * 


[
    {
        "index": 508,
        "hide-verse-number": true,
        "commentators": [
            {
                "type": 169,
                "commentaries": [
                    {
                        "hebrew": [
                            {
                                "index": 508,
                                "title": "מבית אחד",
                                "text": "<co:root xmlns:co=\"www1.chabadonline.com/alpha1\">ורחמנא אמר את בית אחיו (דברים כ״ה:ט׳) בית אחד הוא בונה ואינו בונה שני בתים:</co:root>"
                            },
                            {
                                "index": 508,
                                "title": "ולמיפטרה אידך",
                                "text": "<co:root xmlns:co=\"www1.chabadonline.com/alpha1\">דזיקה ככנוסה דמיא וכ\"ש זיקה ומאמר:</co:root>"
                            }
                        ],
                        "native": []
                    }
                ]
            }
        ],
        "hebrew": {
            "text": "\r\nמִבַּיִת אֶחָד יַבּוֹמֵי חֲדָא וְאִיפְּטוֹרֵ[י] אִידַּךְ לָא דְּדִלְמָא אֵין זִיקָה כִּכְנוּסָה וְהָווּ לְהוּ שְׁתֵּי יְבָמוֹת הַבָּאוֹת מִשְּׁנֵי בָתִּים אַלְמָא מְסַפְּקָא לֵיהּ\r\n"
        },
        "native": {
            "text": "\r\n<b>fr...."
        }
    }
]

 */

var resultData = []
var d = await showDirectoryPicker()
//expects JSON file(s) downlaoded already.
var names = await getFilesInDirectory(d);

async function processGemaraJson(fileName) {
    var fl;
    try {

        fl = await d.getFileHandle(fileName)
        fl = await fl.getFile();
    } catch(e) {
        console.log("Couldn;t find that file",fileName);
        return;
    }

    var writeDir = await d.getDirectoryHandle(
        fileName+"_awtsmoosTranslation",
        {
            create:true
        }
    );



    var res = await fetch(URL.createObjectURL(fl));
    try{
    var js = await res.json();
    } catch(e) {
        console.log("Not a json file", res,js)
        return;
    }

    if(!js.length) {
        console.log("Not proper format")
        return;
    }
    var i;
    for(
        i = 0;
        i < js.length;
        i++
    ) {
        resultData[i] = {}
        var g = resultData[i];

        g.index = js[i].index;

        g.commentaries = [];
        var heb = js[i].hebrew;
        var eng = js[i].native;

        var hebTxt = processChabadOneText(heb.text);
        var engTxt = processChabadOneText(eng.text)
        f = await AwtsmoosGPTify({
            prompt: `
                B"H
                ${hebTxt}

                ${engTxt}
            `,
            print:false
        });

        var result = f
        .message
        .content
        .parts[0];

        g.geelooy = result;

        var cm;
        var cms = js[i].commentators;
        console.log("Got commentators",cms,js[i])
        if(cms) {
            for(
                cm = 0;
                cm < cms.length;
                cm++
            ) {
                var heb = cms[cm].hebrew;
                if(!heb) continue;

                var n = {}
                g.commentators.push(
                    n
                );

                var h;
                n.hebrew = []
                for(
                    h = 0;
                    h < heb.length;
                    h++
                ) {
                    var b = {};
                    n.hebrew.push(b);
                    b.index = heb[h].index;
                    b.title = heb[h].title;

                    var txt = heb[h].text;
                    txt = processChabadOneText(txt);

                    var commentaried = await AwtsmoosGPTify({
                        prompt: `
                            B"H
                            <?Awtsmoos
                                Commentary for ${g.index}

                                Title: ${n.title}
                            ?>
                            Instructions: 

                            Remember the prompt before this
                            one, this Hebrew text is a 
                            commentary of it.

                            So therefore, explain and 
                            translate vividly this 
                            commentary with the previous
                            context in mind. 

                            Story format of a chapter of novel, 
                            as usual, but make 
                            sure it fully elaborates on the
                            previous context and 
                            fully captures everything
                            this commentary is saying
                            completely absolutely entirely
                            in every way possible and beyond.

                            ${txt}
                        `,
                        print:false
                    });

                    var translated = 
                    commentaried.message.content.parts[0];

                    n.text = translated;
                }
                


            }
        }


        var fileWritName = fileName + "_awtsmoosTranslated"+
        (g.index? "_" +g.index:"")
        +".json";
        var writeFile = await writeDir.getFileHandle(
            fileWritName
            ,
            {
                create:true
            }
        );

        var wr = await writeFile.createWritable();
        await wr.write(JSON.stringify(
            g
        ));

        await wr.close();





    }


}

function processChabadOneText(txt) {
    try {
        txt = txt.split(
            "www1.chabadonline.com/alpha1"
        ).join("awtsmoos").split("co:root")
        .join("coby");
    } catch(e) {

    }
    return txt;
}

async function doAll() {
    var g;
    for(
        g = 0;
        g < names.fileNames.length;
        g++
    ) {
        c = await processGemaraJson(names.fileNames[g]);
    }
}
/**
 * @description
 * Akin to the holy process of Seder Histalshilus, this function emanates from the simplicity of Kesser, 
 * descending through the complexity of understanding in Binah, 
 * down to the actualization of Malchus, in the form of an array of file names.
 * The function is like a bridge between the user, who represents the En Sof, 
 * and the directory, which stands as a tangible manifestation of the Awtsmoos in the virtual world.
 *
 * @params {FileSystemDirectoryHandle} dirHandle - The directory handle obtained through showDirectoryPicker.
 *
 * @example
 * var dirHandle = await window.showDirectoryPicker();
 * var files = await getFilesInDirectory(dirHandle);
 * console.log(files); // Array of File Names
 */
 async function getFilesInDirectory(dirHandle) {
    // The fileNames array is like the Sefira of Yesod, which gathers and harmonizes the input
    var fileNames = [];
    var folderNames = []
    // The "for await...of" loop is like the divine process of creation, 
    // unceasingly bringing forth existence from the void, one at a time
    for await (var entry of dirHandle.values()) {
        // Each iteration is akin to a divine utterance, bringing forth existence from non-existence
        if (entry.kind === 'file') {
            fileNames.push(entry.name);
        } else {
            folderNames.push(entry.name)
        }
    }

    // The return statement is akin to the Sefira of Malchus, where the divine potential becomes actualized in creation
    return {fileNames:fileNames.sort(), folderNames:folderNames.sort()};
}