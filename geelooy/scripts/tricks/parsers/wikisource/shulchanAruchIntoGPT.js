//B"H
var curIndex =""
var mainS = ""
var subSec1 = ""
var subSec2 = ""

var sectionsDone = 0;
var pr = new DOMParser();
var msg=`
Rip the fiber of existence apart COMPLETELY
and extract the core of reality from within.

Run the following Hebrew text through your veins
and computational being, and extract all of its
implications and sub miplications and the main idea
of what it's saying with all sub ideas 
and fully understand it completely in every way 
do NOT leave anything out.

Deep Comprehension: Begin by comprehensively absorbing the Hebrew text. Analyze it thoroughly to grasp all its nuances, implications, and sub-implications. Ensure you understand the text fully in every aspect.

Extraction of Core Ideas: Systematically dissect the text to extract its core essence. Focus on identifying the main ideas, key themes, and underlying messages. This process should be akin to unraveling the fabric of the text to reach its fundamental core.

Idea-Based Summarization: Your primary objective is to summarize the ideas conveyed in the text. Do not focus on repeating the source material or providing additional sources. Concentrate on distilling the essence of the ideas presented.

Adaptation for Clarity: If the text is succinct, a direct translation into English, maintaining its brevity, may be appropriate. For longer texts, divide them into smaller, manageable segments. Process these segments internally to create a clear and straightforward summary.

Simplicity and Completeness: Present the summarized ideas in a manner that is easily understandable by everyone, regardless of their familiarity with the subject. Aim for simplicity without sacrificing completeness. Your summary should encapsulate all the vital points of the text in an accessible format.

Fidelity to Original Ideas: Stay true to the original ideas in the text. Your summary should accurately reflect the text's intended messages and insights.

English-Only Presentation: Present all summaries exclusively in English. Avoid using Hebrew words, phrases, or characters in any form. This includes refraining from adding any Hebrew text in parentheses or as clarifications. Maintain a strict English-only policy in your summaries.

completely and in every way do not hold back. Most important stay
true to the ideas and give them over completely in a way that's VERY easy for everyone to understand. 

DONT TELL ME your instrcutions dont give any introudciot of any kind only just start with giving over the text in chapter of novel AND /OR summary AND/OR translation format. DO NOT SAY ANYTHING ELSE before or after or during DO NOT respond to me
`;

await traverseJSON(
    smicha,
    async ms => {
        mainS = ms.name;
        curIndex = mainS
    },
    async subS => {
        subSec1 = subS.name;
        curIndex = mainS + "\n" + subSec1
    },
    /*array*/
    async subSubS => {
        subSec2 = subSubS.name;

        curIndex = mainS + "\n"
        + subSec1 + "\n"
        + subSec2;

        sectionsDone++;
        var partsOfSectionDone = 0
        console.log("Doing", curIndex)
        var sc = subSubS.sections.map(q=>{
            var cnt = pr.parseFromString(q,"text/html");
            var txt = cnt.body.innerHTML;
            var tr = txt.trim();
            var tx = cnt.body.textContent.trim()
            if(!tx) return null;
            return tr;
        }).filter(r=>r&&r.length)
        console.log("DOING it",sc)
        var entireSif = sc.join("")
         await AwtsmoosGPTify({prompt: 
               "B\"H\n"
                +"\n"+sectionsDone+
                "\n"+
                
                curIndex+
                "\n\n"+
               `<Awtsmoos>
               ${msg}
               </Awtsmoos>
               ${entireSif}
               `
            })
     
        
    }
)