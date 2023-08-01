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

var d = await showDirectoryPicker()
//expects JSON file(s) downlaoded already.
var names = await getFilesInDirectory(d);

async function processGemaraJson(fileName) {
    var fl;
    try {

        fl = await d.getFileHandle(fileName)
    } catch(e) {
        console.log("Couldn;t find that file",fileName);
        return;
    }

    var res = await fetch(fl);
    try{
    var js = await res.json();
    } catch(e) {
        console.log("Not a json file", res,js)
        return;
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
 * const dirHandle = await window.showDirectoryPicker();
 * const files = await getFilesInDirectory(dirHandle);
 * console.log(files); // Array of File Names
 */
 async function getFilesInDirectory(dirHandle) {
    // The fileNames array is like the Sefira of Yesod, which gathers and harmonizes the input
    const fileNames = [];
    const folderNames = []
    // The "for await...of" loop is like the divine process of creation, 
    // unceasingly bringing forth existence from the void, one at a time
    for await (const entry of dirHandle.values()) {
        // Each iteration is akin to a divine utterance, bringing forth existence from non-existence
        if (entry.kind === 'file') {
            fileNames.push(entry.name);
        } else {
            folderNames.push(entry.name)
        }
    }

    // The return statement is akin to the Sefira of Malchus, where the divine potential becomes actualized in creation
    return {fileNames, folderNames};
}